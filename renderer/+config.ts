import config from '@vite-plugin-vercel/vike/config';
import type { Config } from 'vike/types';

// https://vike.dev/config
export default {
  // https://vike.dev/clientRouting
  clientRouting: true,
  hydrationCanBeAborted: true,
  extends: config,
} satisfies Config;
