import react from '@vitejs/plugin-react';
import path from 'path';
import vike from 'vike/plugin';
import { defineConfig } from 'vite';
import { cjsInterop } from 'vite-plugin-cjs-interop';
import svgrPlugin from 'vite-plugin-svgr';
import vercel from 'vite-plugin-vercel';

export default defineConfig({
  plugins: [
    vike({
      // prerender: true,
    }),
    react(),
    svgrPlugin(),
    cjsInterop({
      // Add broken npm package here
      dependencies: [
        // Apply patch to root import:
        //   import someImport from 'some-package'
        'react-icons',

        // Apply patch to all sub imports:
        //   import someImport from 'some-package/path'
        //   import someImport from 'some-package/sub/path'
        //   ...
        'react-icons/**',
        'styled-components',
      ],
    }),
    vercel(),
  ],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
