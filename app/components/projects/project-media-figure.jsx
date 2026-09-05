import Image from 'next/image';
import bidiText from '@/utils/data/bidi-text.cjs';

const { isolateBidiText, segmentBidiText } = bidiText;

const aspectRatios = {
  '16:9': '16 / 9',
  '4:3': '4 / 3',
  '3:2': '3 / 2',
  portrait: '3 / 4',
};

export default function ProjectMediaFigure({ media, roleLabel, priority = false, className = '' }) {
  if (!media?.publicApproved || media.sensitive) return null;

  const isSvg = media.src.endsWith('.svg');
  const width = media.width || 1600;
  const height = media.height || 900;
  const objectPosition = media.focalPoint
    ? `${media.focalPoint.x}% ${media.focalPoint.y}%`
    : '50% 50%';
  const captionSegments = media.locale === 'fa'
    ? segmentBidiText(media.caption, media.technicalTerms)
    : [{ text: media.caption, direction: null }];
  const alt = media.locale === 'fa'
    ? isolateBidiText(media.alt, media.technicalTerms)
    : media.alt;

  return (
    <figure className={`project-media-figure ${className}`.trim()}>
      <div
        className={`project-media-figure__frame project-media-figure__frame--${media.aspectRatio || '16:9'}`}
        style={{ aspectRatio: aspectRatios[media.aspectRatio] || `${width} / ${height}` }}
      >
        <Image
          src={media.src}
          width={width}
          height={height}
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 80vw, 1216px"
          priority={priority}
          loading={priority ? 'eager' : 'lazy'}
          unoptimized={isSvg}
          alt={alt}
          className={media.aspectRatio === 'portrait' ? 'project-media-figure__image project-media-figure__image--contain' : 'project-media-figure__image'}
          style={{ objectPosition }}
        />
      </div>
      <figcaption className="project-media-figure__caption">
        {roleLabel && <span className="project-media-figure__role">{roleLabel}</span>}
        <span>
          {captionSegments.map((segment, index) => segment.direction === 'ltr'
            ? <bdi dir="ltr" key={`${segment.text}-${index}`}>{segment.text}</bdi>
            : <span key={`${segment.text}-${index}`}>{segment.text}</span>)}
        </span>
      </figcaption>
    </figure>
  );
}
