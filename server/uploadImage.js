import { Buffer, File } from 'node:buffer';

const IMAGE_URL_RE =
  /^https:\/\/.+\.(?:png|jpg|jpeg|gif|bmp|webp)$/i;

const USER_AGENT =
  'Mozilla/5.0 (compatible; PetloveUpload/1.0; +https://petlove-goit.vercel.app)';

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

async function postMultipart(endpoint, fields) {
  const form = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    form.append(key, value);
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'User-Agent': USER_AGENT,
    },
    body: form,
  });

  const text = String(await response.text()).trim();
  return { ok: response.ok, status: response.status, text };
}

async function uploadImage(buffer, mime, filename) {
  const hosts = [
    {
      endpoint: 'https://catbox.moe/user/api.php',
      buildFields: (file) => ({
        reqtype: 'fileupload',
        fileToUpload: file,
      }),
    },
    {
      endpoint: 'https://litterbox.catbox.moe/resources/internals/api.php',
      buildFields: (file) => ({
        reqtype: 'fileupload',
        time: '72h',
        fileToUpload: file,
      }),
    },
  ];

  const errors = [];

  for (const host of hosts) {
    try {
      const file = new File([buffer], filename, { type: mime });
      const { ok, status, text } = await postMultipart(
        host.endpoint,
        host.buildFields(file),
      );

      if (IMAGE_URL_RE.test(text)) {
        return text;
      }

      errors.push(
        `${host.endpoint}: ${ok ? text.slice(0, 120) : `HTTP ${status} ${text.slice(0, 80)}`}`,
      );
    } catch (error) {
      errors.push(`${host.endpoint}: ${error.message}`);
    }
  }

  throw new Error(errors[0] || 'Failed to upload image');
}

export async function uploadImagePayload(dataUrl, name = 'photo.jpg') {
  const { mime, buffer, extension } = parseDataUrl(dataUrl);
  const filename = buildFilename(name, extension);
  return uploadImage(buffer, mime, filename);
}
