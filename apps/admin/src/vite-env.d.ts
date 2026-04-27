/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_PATH?: string;
  readonly VITE_SERVER_API?: string;
  readonly VITE_SERVER_API_V2?: string;
  readonly VITE_SERVER_API_V3?: string;
  readonly VITE_PROFILE?: string;
  readonly VITE_SENTRY_DSN?: string;
  readonly VITE_ADMIN_URL?: string;
  readonly VITE_MENTOR_URL?: string;
  readonly VITE_WEB_URL?: string;
  readonly VITE_BASE_URL?: string;
  readonly VITE_KAKAO_CLIENT_ID?: string;
  readonly VITE_NAVER_CLIENT_ID?: string;
  readonly VITE_TOSS_CLIENT_KEY?: string;
  readonly VITE_MUI_X_LICENSE_KEY?: string;
  readonly VITE_GA_ID?: string;
  readonly VITE_DISCORD_WEBHOOK_URL?: string;
  readonly [key: `VITE_${string}`]: string | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
