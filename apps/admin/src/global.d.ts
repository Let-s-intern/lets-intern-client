declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    Kakao?: unknown;
    naver?: unknown;
  }
}

export {};
