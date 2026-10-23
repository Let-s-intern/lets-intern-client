import {
  test,
  type APIRequestContext,
  type BrowserContext,
  type Page,
} from '@playwright/test';
import { log } from './log';
import { Pipeline } from './pipeline';
import { RunDir } from './runDir';

/**
 * LC-3492 통합 QA 공용 설정·헬퍼.
 *
 * 로컬 스택(`.claude/local-dev`) 전제다 — 백엔드 8080 + web 3000 + admin 3001, 로컬 Docker MySQL.
 * 공용 RDS 에는 붙지 않는다. 시드는 `seed.sh` → `seed-live-mentoring.sql` → `seed-lc3492.sql`.
 */

export const ADMIN_URL = process.env.E2E_ADMIN_URL ?? 'http://localhost:3001';
/** 백엔드 API 루트. 끝에 `/v1`, `/v2` 를 붙여 쓴다 */
export const API_URL = process.env.E2E_API_URL ?? 'http://localhost:8080/api';

/** `.claude/local-dev/seed.sh` 의 로컬 전용 어드민 계정 */
export const ADMIN_EMAIL =
  process.env.E2E_ADMIN_EMAIL ?? 'local-admin@letscareer.test';
export const ADMIN_PASSWORD = process.env.E2E_ADMIN_PW ?? 'fptcmdjemals99!';

/** 시드의 멘토 A. 경력·키워드·LIVE·VOD·후기 시드가 이 멘토에 붙는다 */
export const MENTOR_A_EMAIL =
  process.env.E2E_LC3492_MENTOR_A_EMAIL ?? 'lm-mentor1@letscareer.test';
/** 시드 멘토 비밀번호(seed-live-mentoring.sql 과 같다) */
export const MENTOR_PASSWORD =
  process.env.E2E_LC3492_MENTOR_PW ?? ADMIN_PASSWORD;

/**
 * 화면에 넣는 가짜 이미지 주소. 상세페이지 이미지는 서버가 HTTPS 만 받으므로 HTTPS 로 두고,
 * 실제로는 `serveFakeImages` 가 브라우저에서 가로채 1px PNG 로 답한다. 외부 망에 기대지 않는다.
 */
export const FAKE_IMAGE_HOST = 'https://e2e-assets.letscareer.test';
export const fakeImageUrl = (name: string) => `${FAKE_IMAGE_HOST}/${name}.png`;

// 1x1 투명 PNG
const PNG_1PX = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
  'base64',
);

/** 이 컨텍스트의 모든 페이지(어드민·웹)에서 가짜 이미지 주소를 1px PNG 로 답한다 */
export async function serveFakeImages(context: BrowserContext): Promise<void> {
  await context.route(`${FAKE_IMAGE_HOST}/**`, (route) =>
    route.fulfill({ status: 200, contentType: 'image/png', body: PNG_1PX }),
  );
}

/**
 * 로컬 백엔드에는 S3 자격 증명이 없어 `POST /file` 이 실패할 수 있다(PRD §3.2).
 * `E2E_REAL_FILE_UPLOAD=1` 이 아니면 업로드 응답만 가짜 HTTPS 주소로 바꾼다.
 * 대체했는지는 돌려준 값으로 스펙이 Pipeline.note 에 남긴다.
 */
export async function mockFileUpload(
  page: Page,
  name: string,
): Promise<boolean> {
  if (process.env.E2E_REAL_FILE_UPLOAD === '1') return false;
  const fileUrl = fakeImageUrl(name);
  await page.route(/\/api\/v1\/file(\?|$)/, (route) => {
    if (route.request().method() !== 'POST') return route.fallback();
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ status: 200, data: { fileUrl } }),
    });
  });
  log(`  [MOCK] POST /file -> ${fileUrl}`);
  return true;
}

/** 실행마다 다른 문구. 앞 실행이 남긴 값과 섞이지 않게 한다 */
export const uniqueText = (prefix: string) =>
  `${prefix} ${new Date().toISOString().slice(5, 19).replace(/[-:T]/g, '')}`;

export interface AdminMentor {
  id: number;
  name: string;
  nickname?: string | null;
  email?: string | null;
  isVisible?: boolean | null;
}

/**
 * 백엔드 API 직접 호출. 화면 조작의 준비(픽 5명 세팅 등)와 id 조회에만 쓴다.
 * 검증은 화면으로 한다.
 */
export class Lc3492Api {
  private constructor(
    private readonly request: APIRequestContext,
    private readonly accessToken: string,
  ) {}

  static async login(
    request: APIRequestContext,
    email: string,
    password: string,
  ): Promise<Lc3492Api> {
    const res = await request.post(`${API_URL}/v1/user/signin`, {
      data: { email, password },
    });
    if (!res.ok()) {
      throw new Error(
        `로그인 실패 ${email}: ${res.status()} ${await res.text()}`,
      );
    }
    const body = await res.json();
    return new Lc3492Api(request, body.data.accessToken);
  }

  static admin(request: APIRequestContext) {
    return Lc3492Api.login(request, ADMIN_EMAIL, ADMIN_PASSWORD);
  }

  private get headers() {
    return { Authorization: `Bearer ${this.accessToken}` };
  }

  async get<T>(path: string): Promise<T> {
    const res = await this.request.get(`${API_URL}${path}`, {
      headers: this.headers,
    });
    if (!res.ok()) {
      throw new Error(`GET ${path}: ${res.status()} ${await res.text()}`);
    }
    return (await res.json()).data as T;
  }

  async put<T>(path: string, data: unknown): Promise<T> {
    const res = await this.request.put(`${API_URL}${path}`, {
      headers: this.headers,
      data,
    });
    if (!res.ok()) {
      throw new Error(`PUT ${path}: ${res.status()} ${await res.text()}`);
    }
    return (await res.json()).data as T;
  }

  async mentors(): Promise<AdminMentor[]> {
    const data = await this.get<{ mentorList: AdminMentor[] }>(
      '/v2/admin/user/mentor',
    );
    return data.mentorList;
  }

  async mentorIdByEmail(email: string): Promise<number> {
    const mentor = (await this.mentors()).find((m) => m.email === email);
    if (!mentor) {
      throw new Error(`멘토 ${email} 가 없습니다. 시드를 먼저 넣으세요.`);
    }
    return mentor.id;
  }

  /** 렛커 픽을 통째로 바꾼다(PUT 은 전체 교체) */
  setPicks(mentorIds: number[]) {
    return this.put('/v1/admin/mentor/pick', { mentorIds });
  }
}

/**
 * 스펙 한 파일의 실행 기록. 기존 스위트와 같이 단계마다 스크린샷을 남기고, 끝나면 결과 폴더로 옮긴다.
 * 파일마다 테스트 하나만 둔다 — RunDir 가 초 단위 시각으로 폴더를 만들어 같은 초에 둘이 끝나면 겹친다.
 */
export function setupRun(title: string) {
  let runDir: RunDir | undefined;
  let flow: Pipeline | undefined;

  test.afterEach(async ({ page }, testInfo) => {
    if (!runDir) return;
    await runDir.finalize(page, testInfo, title, flow?.journal, flow?.notes);
  });

  return (page: Page): Pipeline => {
    runDir = new RunDir();
    runDir.prepare();
    flow = new Pipeline(page, runDir);
    return flow;
  };
}
