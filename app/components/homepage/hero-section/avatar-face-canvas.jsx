'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { VRMLoaderPlugin, VRMUtils } from '@pixiv/three-vrm';
import { voiceAnalyserRef } from '@/app/utils/avatarVoiceAudio';

const MODEL_URL = '/avatar/kakhki-robot.vrm';
const FACE_MESH_NAMES = new Set(['HEAD', 'EYES', 'EYES.001']);
const HIDDEN_FACE_MATERIALS = new Set(['SPINE']);
const FACE_CLIP_PATH =
  'polygon(0 0, 100% 0, 100% 70%, 83% 70%, 73% 78%, 50% 83%, 25% 78%, 18% 70%, 0 70%)';

export default function AvatarFaceCanvas({ onReady }) {
  const canvasRef = useRef(null);
  const onReadyRef = useRef(onReady);

  useEffect(() => {
    onReadyRef.current = onReady;
  }, [onReady]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) {
      return undefined;
    }

    let disposed = false;
    let animationFrame;
    let vrm;
    let readySent = false;
    const mouthTarget = { aa: 0, oh: 0 };
    const mouthCurrent = { aa: 0, oh: 0 };
    const mouthSamples = new Uint8Array(256);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(24, 1, 0.01, 20);
    let renderer;

    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        canvas,
        powerPreference: 'low-power',
      });
    } catch {
      return undefined;
    }

    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    const keyLight = new THREE.DirectionalLight(0xfff1e6, 0.56);
    keyLight.position.set(1.2, 1.8, 2.4);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x8bd3dd, 0.12);
    fillLight.position.set(-1.5, 1.1, 1.2);
    scene.add(fillLight);
    scene.add(new THREE.AmbientLight(0xe2e8f0, 0.34));

    const resize = () => {
      const width = Math.max(1, host.clientWidth);
      const height = Math.max(1, host.clientHeight);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    resize();

    const loader = new GLTFLoader();
    loader.register(parser => new VRMLoaderPlugin(parser));

    loader.load(
      MODEL_URL,
      gltf => {
        if (disposed) {
          const abandonedVrm = gltf.userData.vrm;
          if (abandonedVrm) {
            VRMUtils.deepDispose(abandonedVrm.scene);
          }
          return;
        }

        vrm = gltf.userData.vrm;
        if (!vrm) {
          return;
        }

        VRMUtils.rotateVRM0(vrm);
        scene.add(vrm.scene);

        const faceMeshIndexes = new Set(
          gltf.parser.json.nodes
            .filter(node => FACE_MESH_NAMES.has(node.name) && Number.isInteger(node.mesh))
            .map(node => node.mesh),
        );

        vrm.scene.traverse(object => {
          object.frustumCulled = false;
          if (!object.isMesh) {
            return;
          }

          const meshIndex = gltf.parser.associations.get(object)?.meshes;
          object.visible = faceMeshIndexes.has(meshIndex);
          if (object.visible && object.material) {
            const materials = Array.isArray(object.material)
              ? object.material
              : [object.material];
            const filteredMaterials = materials.map(material => {
              if (!HIDDEN_FACE_MATERIALS.has(material.name)) {
                return material;
              }

              const hiddenMaterial = material.clone();
              hiddenMaterial.transparent = true;
              hiddenMaterial.opacity = 0;
              hiddenMaterial.depthWrite = false;
              return hiddenMaterial;
            });
            object.material = Array.isArray(object.material)
              ? filteredMaterials
              : filteredMaterials[0];
          }
        });

        const cameraHead = vrm.humanoid?.getRawBoneNode('head');
        if (!cameraHead) {
          return;
        }

        vrm.scene.updateMatrixWorld(true);
        const headPosition = cameraHead.getWorldPosition(new THREE.Vector3());
        camera.position.set(headPosition.x, headPosition.y + 0.05, headPosition.z + 0.72);
        camera.lookAt(headPosition.x, headPosition.y + 0.04, headPosition.z);
      },
      undefined,
      () => {
        // Keep the original portrait unchanged when the model cannot load.
      },
    );

    const avatarPixelsAreVisible = () => {
      const gl = renderer.getContext();
      const width = gl.drawingBufferWidth;
      const height = gl.drawingBufferHeight;
      const pixels = new Uint8Array(width * height * 4);

      try {
        gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
      } catch {
        return false;
      }

      let visiblePixels = 0;
      for (let index = 3; index < pixels.length; index += 4) {
        if (pixels[index] > 16) {
          visiblePixels += 1;
        }
      }

      return visiblePixels > width * height * 0.02;
    };

    const clock = new THREE.Clock();
    const render = () => {
      animationFrame = window.requestAnimationFrame(render);
      const delta = Math.min(clock.getDelta(), 0.1);

      if (vrm) {
        const elapsed = clock.elapsedTime;
        const head = vrm.humanoid?.getNormalizedBoneNode('head');
        if (head) {
          head.rotation.y = Math.sin(elapsed * 0.55) * 0.055;
          head.rotation.x = Math.sin(elapsed * 0.38) * 0.018;
        }

        const blink = Math.max(0, Math.sin(elapsed * 0.72) - 0.985) * 66;
        vrm.expressionManager?.setValue('blink', Math.min(blink, 1));

        const voiceAnalyser = voiceAnalyserRef.current;
        if (voiceAnalyser) {
          voiceAnalyser.getByteTimeDomainData(mouthSamples);
          let energy = 0;
          for (let index = 0; index < mouthSamples.length; index += 1) {
            const sample = (mouthSamples[index] - 128) / 128;
            energy += sample * sample;
          }
          const amplitude = Math.min(1, Math.sqrt(energy / mouthSamples.length) * 4.5);
          mouthTarget.aa = amplitude;
          mouthTarget.oh = Math.min(1, amplitude * 0.72);
        } else {
          mouthTarget.aa = 0;
          mouthTarget.oh = 0;
        }
        mouthCurrent.aa += (mouthTarget.aa - mouthCurrent.aa) * Math.min(1, delta * 16);
        mouthCurrent.oh += (mouthTarget.oh - mouthCurrent.oh) * Math.min(1, delta * 12);
        vrm.expressionManager?.setValue('aa', mouthCurrent.aa);
        vrm.expressionManager?.setValue('oh', mouthCurrent.oh);
        vrm.update(delta);
        renderer.render(scene, camera);

        if (!readySent && avatarPixelsAreVisible()) {
          readySent = true;
          window.requestAnimationFrame(() => onReadyRef.current?.());
        }
      }
    };

    render();

    return () => {
      disposed = true;
      window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      if (vrm) {
        scene.remove(vrm.scene);
        VRMUtils.deepDispose(vrm.scene);
      }
      renderer.dispose();
      renderer.forceContextLoss();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="relative h-full w-full [filter:drop-shadow(0_3px_3px_rgba(2,6,23,0.38))]"
      style={{
        clipPath: FACE_CLIP_PATH,
        transform: 'scaleX(1.28)',
        transformOrigin: '50% 50%',
      }}
    />
  );
}
