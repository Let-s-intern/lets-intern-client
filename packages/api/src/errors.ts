/** 모든 도메인 에러의 베이스. message는 항상 한국어 운영 메시지. */
export class AppError extends Error {
  /** 한국어 사용자/운영자용 메시지. message와 동일. */
  readonly displayMessage: string;
  /** 머신 식별 코드. Sentry 검색·알람 라우팅 키. */
  readonly code: string;
  /** HTTP status (있을 때만). */
  readonly status?: number;
  /** Sentry extra로 그대로 전달될 메타. */
  readonly context: Record<string, unknown>;

  constructor(opts: {
    code: string;
    message: string;
    status?: number;
    context?: Record<string, unknown>;
    cause?: unknown;
  }) {
    super(opts.message, { cause: opts.cause });
    this.name = new.target.name; // class name 보존
    this.code = opts.code;
    this.status = opts.status;
    this.context = opts.context ?? {};
    this.displayMessage = opts.message;
  }
}

/** API 호출 실패. fetch/axios 모두 이 타입으로 통일. */
export class ApiError extends AppError {
  /** API endpoint (e.g. `/vods/123`). */
  readonly endpoint: string;
  /** GET/POST/... */
  readonly method: string;
  /** BE에서 내려준 message (있을 때만). */
  readonly serverMessage?: string;

  constructor(opts: {
    code: string;
    message: string;
    status: number;
    endpoint: string;
    method: string;
    serverMessage?: string;
    context?: Record<string, unknown>;
    cause?: unknown;
  }) {
    super(opts);
    this.endpoint = opts.endpoint;
    this.method = opts.method;
    this.serverMessage = opts.serverMessage;
  }
}

/** Zod parse 실패 (스키마 미스매치). */
export class SchemaParseError extends AppError {}

/** 인증/권한 (401/403). UnauthorizedHandler가 잡아서 별도 라우팅. */
export class AuthError extends ApiError {}
