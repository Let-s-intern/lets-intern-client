import react from '@vitejs/plugin-react';
import path from 'path';
import vike from 'vike/plugin';
import { defineConfig } from 'vite';
import { cjsInterop } from 'vite-plugin-cjs-interop';
import svgrPlugin from 'vite-plugin-svgr';
import vercel from 'vite-plugin-vercel';

const isProd = process.env.NODE_ENV === 'production';

// https://vitejs.dev/config/ssr-options.html#ssr-noexternal
const noExternal: string[] = [];
if (isProd) {
  noExternal.push(
    ...[
      // MUI needs to be pre-processed by Vite in production: https://github.com/brillout/vite-plugin-ssr/discussions/901
      '@mui/base',
      '@mui/icons-material',
      '@mui/material',
      '@mui/system',
      '@mui/utils',
    ],
  );
}

export default defineConfig({
  plugins: [
    cjsInterop({
      // Add broken npm package here
      dependencies: [
        // Apply patch to root import:
        //   import someImport from 'some-package'
        // 'react-icons',

        // Apply patch to all sub imports:
        //   import someImport from 'some-package/path'
        //   import someImport from 'some-package/sub/path'
        //   ...
        'styled-components',
      ],
    }),
    vike({
      prerender: true,
    }),
    react(),
    svgrPlugin(),
    vercel(),
  ],
  server: {
    port: 3000,
  },
  ssr: { noExternal },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
    },
  },
});
