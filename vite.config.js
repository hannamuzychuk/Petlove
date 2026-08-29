import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { Buffer } from 'node:buffer';
import { uploadImagePayload } from './server/uploadImage.js';

function uploadImageApiPlugin() {
  return {
    name: 'upload-image-api',
    configureServer(server) {
      server.middlewares.use('/api/upload-image', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ message: 'Method not allowed' }));
          return;
        }

        try {
          const chunks = [];
          for await (const chunk of req) {
            chunks.push(chunk);
          }

          const body = JSON.parse(
            Buffer.concat(chunks).toString('utf8') || '{}',
          );
          if (!body.image) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ message: 'Image is required' }));
            return;
          }

          const url = await uploadImagePayload(body.image, body.name);
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ url }));
        } catch (error) {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          res.end(
            JSON.stringify({
              message: error.message || 'Failed to upload image',
            }),
          );
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), uploadImageApiPlugin()],
});
