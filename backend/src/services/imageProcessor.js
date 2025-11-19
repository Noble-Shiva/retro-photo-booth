const sharp = require('sharp');

async function applyRetroFilter(imageBuffer, filterType = 'vintage') {
  let image = sharp(imageBuffer);

  switch (filterType) {
    case 'vintage':
      image = image
        .modulate({ saturation: 0.8, brightness: 1.1 })
        .tint({ r: 255, g: 240, b: 220 })
        .gamma(1.1)
        .sharpen({ sigma: 0.5 });
      break;

    case 'sepia':
      image = image
        .greyscale()
        .tint({ r: 255, g: 220, b: 180 })
        .modulate({ brightness: 1.05 });
      break;

    case 'polaroid':
      image = image
        .modulate({ saturation: 1.2, brightness: 1.15 })
        .tint({ r: 255, g: 250, b: 240 })
        .gamma(0.95);
      break;

    case 'film':
      image = image
        .modulate({ saturation: 0.9, brightness: 1.05 })
        .tint({ r: 250, g: 245, b: 255 })
        .gamma(1.05)
        .sharpen({ sigma: 0.3 });
      break;

    case 'faded':
      image = image
        .modulate({ saturation: 0.6, brightness: 1.1 })
        .gamma(1.2)
        .tint({ r: 255, g: 250, b: 245 });
      break;

    default:
      // No filter
      break;
  }

  // Add slight vignette effect by overlaying
  const metadata = await image.metadata();

  // Convert to WebP with good quality
  return image
    .webp({ quality: 85 })
    .toBuffer();
}

async function createThumbnail(imageBuffer, width = 300) {
  return sharp(imageBuffer)
    .resize(width, null, { fit: 'inside' })
    .webp({ quality: 70 })
    .toBuffer();
}

module.exports = { applyRetroFilter, createThumbnail };
