export const config = {
  runtime: 'edge',
};

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
  const binary = atob(match[2]);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }

  if (!bytes.length) {
    throw new Error('Invalid image data');
  }

  let extension = mime.split('/')[1] || 'jpg';
  if (extension === 'jpeg') extension = 'jpg';
  if (!['png', 'jpg', 'gif', 'bmp', 'webp'].includes(extension)) {
    extension = 'jpg';
  }

  return {
    mime: extension === 'jpg' ? 'image/jpeg' : mime,
    bytes,
    extension,
  };
}

function buildFilename(name, extension) {
  const base = String(name || 'photo')
    .replace(/\.[^.]+$/, '')
    .replace(/[^\w.-]+/g, '-')
    .slice(0, 40);
  return `${base || 'photo'}.${extension}`;
}

async function uploadToCatbox(bytes, mime, filename) {
  const form = new FormData();
  form.append('reqtype', 'fileupload');
  form.append('fileToUpload', new Blob([bytes], { type: mime }), filename);

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

export default async function handler(request) {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  if (request.method !== 'POST') {
    return Response.json(
      { message: 'Method not allowed' },
      { status: 405 },
    );
  }

  try {
    const body = await request.json();
    const { image, name } = body || {};

    if (!image) {
      return Response.json({ message: 'Image is required' }, { status: 400 });
    }

    const { mime, bytes, extension } = parseDataUrl(image);
    const filename = buildFilename(name, extension);
    const url = await uploadToCatbox(bytes, mime, filename);

    return Response.json(
      { url },
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      },
    );
  } catch (error) {
    return Response.json(
      { message: error.message || 'Failed to upload image' },
      { status: 400 },
    );
  }
}
