import { Buffer } from 'node:buffer';

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
  const base64 = match[2];
  const buffer = Buffer.from(base64, 'base64');

  if (!buffer.length) {
    throw new Error('Invalid image data');
  }

  const subtype = mime.split('/')[1]?.replace('jpeg', 'jpg') || 'jpg';
  const extension = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'].includes(
    subtype,
  )
    ? subtype === 'jpeg'
      ? 'jpg'
      : subtype
    : 'jpg';

  return { mime, buffer, extension };
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
  form.append('fileToUpload', new Blob([buffer], { type: mime }), filename);

  const response = await fetch('https://catbox.moe/user/api.php', {
    method: 'POST',
    body: form,
  });

  const url = String(await response.text()).trim();
  if (!response.ok || !IMAGE_URL_RE.test(url)) {
    throw new Error('Catbox upload failed');
  }

  return url;
}

async function uploadToTelegraph(buffer, mime, filename) {
  const form = new FormData();
  form.append('file', new Blob([buffer], { type: mime }), filename);

  const response = await fetch('https://telegra.ph/upload', {
    method: 'POST',
    body: form,
  });

  if (!response.ok) {
    throw new Error('Telegraph upload failed');
  }

  const data = await response.json();
  const src = Array.isArray(data) ? data[0]?.src : data?.src;
  if (!src) {
    throw new Error('Telegraph upload failed');
  }

  const url = src.startsWith('http') ? src : `https://telegra.ph${src}`;
  if (!IMAGE_URL_RE.test(url)) {
    throw new Error('Telegraph returned an unsupported URL');
  }

  return url;
}

export async function uploadImagePayload(dataUrl, name = 'photo.jpg') {
  const { mime, buffer, extension } = parseDataUrl(dataUrl);
  const filename = buildFilename(name, extension);

  try {
    return await uploadToCatbox(buffer, mime, filename);
  } catch {
    return await uploadToTelegraph(buffer, mime, filename);
  }
}
