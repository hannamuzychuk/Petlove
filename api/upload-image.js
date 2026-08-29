import { uploadImagePayload } from '../server/uploadImage.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  try {
    const { image, name } = req.body || {};
    if (!image) {
      res.status(400).json({ message: 'Image is required' });
      return;
    }

    const url = await uploadImagePayload(image, name);
    res.status(200).json({ url });
  } catch (error) {
    res.status(400).json({
      message: error.message || 'Failed to upload image',
    });
  }
}
