#!/usr/bin/env python3
"""Create the hero portrait with its opaque studio backdrop matched to --bg-primary."""
from collections import deque
from pathlib import Path
from PIL import Image, ImageFilter

SOURCE = Path('assets/source/hero-portrait-source.webp')
OUTPUT = Path('public/avatar-page-background.webp')
SOURCE_BACKGROUND = (15, 23, 43)
PAGE_BACKGROUND = (7, 16, 24)
BACKGROUND_DISTANCE = 16
FEATHER_RADIUS = 1.15
TARGET_SIZE = (512, 512)


def color_distance_squared(pixel):
    return sum((channel - reference) ** 2 for channel, reference in zip(pixel, SOURCE_BACKGROUND))


def is_background(pixel):
    return color_distance_squared(pixel) <= BACKGROUND_DISTANCE ** 2


def background_mask(image):
    width, height = image.size
    pixels = image.load()
    mask = Image.new('L', image.size, 0)
    mask_pixels = mask.load()
    if pixels is None or mask_pixels is None:
        raise RuntimeError('Could not access portrait pixels while compositing the hero asset')
    visited = bytearray(width * height)
    pending = deque()

    def enqueue(x, y):
        index = y * width + x
        if not visited[index] and is_background(pixels[x, y]):
            visited[index] = 1
            pending.append((x, y))

    for x in range(width):
        enqueue(x, 0)
        enqueue(x, height - 1)
    for y in range(height):
        enqueue(0, y)
        enqueue(width - 1, y)

    while pending:
        x, y = pending.popleft()
        mask_pixels[x, y] = 255
        for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
            if 0 <= nx < width and 0 <= ny < height:
                enqueue(nx, ny)

    return mask.filter(ImageFilter.GaussianBlur(FEATHER_RADIUS))


def main():
    image = Image.open(SOURCE).convert('RGB')
    mask = background_mask(image)
    page_background = Image.new('RGB', image.size, PAGE_BACKGROUND)
    composited = Image.composite(page_background, image, mask)
    output = composited.resize(TARGET_SIZE, Image.Resampling.LANCZOS)

    # Preserve exact page-color corners even after resize/encoding.
    output_pixels = output.load()
    width, height = output.size
    for point in ((0, 0), (width - 1, 0), (0, height - 1), (width - 1, height - 1)):
        output_pixels[point[0], point[1]] = PAGE_BACKGROUND

    output.save(OUTPUT, 'WEBP', lossless=True, method=6)
    print(f'Wrote {OUTPUT} ({output.size[0]}x{output.size[1]})')


if __name__ == '__main__':
    main()
