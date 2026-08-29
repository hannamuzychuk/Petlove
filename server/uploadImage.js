import { Buffer, File } from 'node:buffer';

const IMAGE_URL_RE =
  /^https:\/\/.+\.(?:png|jpg|jpeg|gif|bmp|webp)$/i;

function parseDataUrl(dataUrl) {
  const match = String(dataUrl || '').match(
    /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/,
  );
  if (!match) {
    throw new Error('Invalid image data');
  }

  const mime = match[1].toLowerCase();
  const buffer = Buffer.from(match[2], 'base64');
  if (!buffer.length) {
    throw new Error('Invalid image data');
  }

  let extension = mime.split('/')[1] || 'jpg';
  if (extension === 'jpeg') extension = 'jpg';
  if (!['png', 'jpg', 'gif', 'bmp', 'webp'].includes(extension)) {
    extension = 'jpg';
  }

  return { mime: extension === 'jpg' ? 'image/jpeg' : mime, buffer, extension };
}

function buildFilename(name, extension) {
  const base = String(name || 'photo')
    .replace(/\.[^.]+$/, '')
    .replace(/[^\w.-]+/g, '-')
    .slice(0, 40);
  return `${base || 'photo'}.${extension}`;
}

async function uploadToCatbox(buffer, mime, filename) {
  const form = new FormData();
  form.append('reqtype', 'fileupload');
  form.append(
    'fileToUpload',
    new File([buffer], filename, { type: mime }),
  );

  const response = await fetch('https://catbox.moe/user/api.php', {
    method: 'POST',
    body: form,
  });

  const url = String(await response.text()).trim();
  if (!IMAGE_URL_RE.test(url)) {
    throw new Error(
      response.ok
        ? 'Upload host returned an unsupported URL'
        : 'Failed to upload image',
    );
  }

  return url;
}

export async function uploadImagePayload(dataUrl, name = 'photo.jpg') {
  const { mime, buffer, extension } = parseDataUrl(dataUrl);
  const filename = buildFilename(name, extension);
  return uploadToCatbox(buffer, mime, filename);
}
