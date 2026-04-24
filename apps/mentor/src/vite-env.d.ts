/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_PATH?: string;
  readonly VITE_SERVER_API?: string;
  readonly VITE_PROFILE?: 'development' | 'production' | string;
  readonly VITE_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// 자산 import 선언
declare module '*.gif';
declare module '*.jpg';
declare module '*.png';
declare module '*.svg';
declare module '*.svg?react' {
  import type * as React from 'react';
  const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}
