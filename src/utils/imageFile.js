const ACCEPTED_TYPES = new Set([
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/gif',
  'image/bmp',
  'image/webp',
]);

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_DIMENSION = 1000;
const JPEG_QUALITY = 0.75;

const IMAGE_URL_RE =
  /^https:\/\/.+\.(?:png|jpg|jpeg|gif|bmp|webp)$/i;

const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Failed to read the selected image'));
    image.src = src;
  });

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Failed to read the selected image'));
    reader.readAsDataURL(file);
  });

export async function fileToImageDataUrl(file) {
  if (!file) {
    throw new Error('Please select an image file');
  }

  if (!ACCEPTED_TYPES.has(file.type)) {
    throw new Error('Use png, jpg, jpeg, gif, bmp or webp');
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error('Image must be smaller than 5MB');
  }

  const originalDataUrl = await readFileAsDataUrl(file);
  const image = await loadImage(originalDataUrl);

  const scale = Math.min(1, MAX_DIMENSION / Math.max(image.width, image.height));
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext('2d');
  if (!context) {
    return originalDataUrl;
  }

  context.drawImage(image, 0, 0, width, height);

  return canvas.toDataURL('image/jpeg', JPEG_QUALITY);
}

export async function uploadImageFile(file) {
  const dataUrl = await fileToImageDataUrl(file);

  const response = await fetch('/api/upload-image', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      image: dataUrl,
      name: (file.name || 'photo').replace(/\.[^.]+$/, '') + '.jpg',
    }),
  });

  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    throw new Error(
      'Upload API is unavailable on this deployment. Redeploy with /api/upload-image.',
    );
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || 'Failed to upload image');
  }

  if (!IMAGE_URL_RE.test(data.url || '')) {
    throw new Error('Uploaded image URL has an unsupported format');
  }

  return data.url;
}
