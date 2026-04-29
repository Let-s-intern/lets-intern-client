import { test, type Page } from '@playwright/test';
import { log } from './log';
import { RunDir } from './runDir';

/**
 * 파이프라인 디자인 패턴 — 시나리오의 각 단계를 일관된 형태로 실행.
 *
 * 각 step:
 *   1) test.step() 으로 묶음 (Playwright trace/리포트에 단계 기록)
 *   2) "[START] 라벨" / "[OK] 라벨" 자동 로그
 *   3) snapName 주면 단계 끝에 스크린샷 자동 캡처 (seq 자동 증가)
 *   4) 액션 결과를 그대로 반환 — 다음 POM 으로 chain 가능
 */
export class Pipeline {
  private seq = 0;

  constructor(
    public readonly page: Page,
    public readonly runDir: RunDir,
  ) {}

  async run<T>(
    label: string,
    fn: () => Promise<T>,
    snapName?: string,
  ): Promise<T> {
    return test.step(label, async () => {
      log(`[START] ${label}`);
      const result = await fn();
      if (snapName) {
        this.seq += 1;
        await this.runDir.snap(this.page, this.seq, snapName);
      }
      log(`[OK] ${label}`);
      return result;
    });
  }
}
