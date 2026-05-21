/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_PATH?: string;
  readonly VITE_SERVER_API?: string;
  readonly VITE_SERVER_API_V2?: string;
  readonly VITE_SERVER_API_V3?: string;
  readonly VITE_PROFILE?: 'development' | 'production' | string;
  readonly VITE_BASE_URL?: string;
  readonly VITE_WEB_URL?: string;
  readonly VITE_ZEP_SPACE_URL?: string;
  readonly VITE_ZEP_ENTRY_CODE?: string;
  readonly VITE_ZEP_SPACE_NAME?: string;
  readonly VITE_JITSI_BASE_URL?: string;
  readonly VITE_JITSI_FALLBACK_URL?: string;
  readonly VITE_JITSI_ROOM_SALT?: string;
  readonly VITE_JITSI_USE_DEV_MOCK?: string;
  readonly VITE_JITSI_DEV_MOCK_FEEDBACK_ID?: string;
  readonly VITE_API_MOCKING?: string;
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
