import { test, type Page } from '@playwright/test';
import { log } from './log';
import { RunDir } from './runDir';

/** 시나리오 단계 단위 기록 — 통계/리포트 생성 입력. */
export interface JournalEntry {
  label: string;
  status: 'passed' | 'failed' | 'skipped';
  durationMs: number;
  startedAt: string;
  finalUrl: string;
  errorMessage?: string;
}

/** ad-hoc 메모/이벤트 (예: "404 감지", "이미 신청 완료" 등). */
export interface JournalNote {
  at: string;
  message: string;
}

/**
 * 파이프라인 — 시나리오의 각 단계를 일관된 형태로 실행 + 기록.
 *
 * 책임:
 *   1) test.step() 으로 묶음
 *   2) 자동 로그 + 스크린샷
 *   3) 단계 결과를 journal 에 기록 — afterEach 에서 요약 리포트 생성
 *   4) note() 로 ad-hoc 이벤트 기록 (404 감지 / 이미신청 등)
 */
export class Pipeline {
  private seq = 0;
  readonly journal: JournalEntry[] = [];
  readonly notes: JournalNote[] = [];

  constructor(
    public readonly page: Page,
    public readonly runDir: RunDir,
  ) {}

  async run<T>(
    label: string,
    fn: () => Promise<T>,
    snapName?: string,
  ): Promise<T> {
    const start = Date.now();
    const startedAt = new Date().toISOString().slice(11, 19);
    return test.step(label, async () => {
      log(`[START] ${label}`);
      try {
        const result = await fn();
        if (snapName) {
          this.seq += 1;
          await this.runDir.snap(this.page, this.seq, snapName);
        }
        const durationMs = Date.now() - start;
        this.journal.push({
          label,
          status: 'passed',
          durationMs,
          startedAt,
          finalUrl: this.page.url(),
        });
        log(`[OK] ${label} (${durationMs}ms)`);
        return result;
      } catch (err) {
        const durationMs = Date.now() - start;
        const e = err as Error;
        // test.skip() 은 "Test is skipped: ..." throw — fail 이 아니라 skipped 로 분류.
        const message = e?.message ?? '';
        const isSkip = /Test is skipped/i.test(message);
        this.journal.push({
          label,
          status: isSkip ? 'skipped' : 'failed',
          durationMs,
          startedAt,
          finalUrl: this.page.url(),
          errorMessage: message.split('\n')[0]?.slice(0, 240),
        });
        throw err;
      }
    });
  }

  /** ad-hoc 이벤트 기록 — 단계 안에서 일어난 특수 상황(감지/우회 등). */
  note(message: string): void {
    const at = new Date().toISOString().slice(11, 19);
    this.notes.push({ at, message });
    log(`[NOTE] ${message}`);
  }
}
