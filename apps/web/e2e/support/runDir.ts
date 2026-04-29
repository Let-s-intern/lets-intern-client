import * as fs from 'node:fs';
import * as path from 'node:path';
import type { Page, TestInfo } from '@playwright/test';
import { log } from './log';

const RESULTS_ROOT = path.resolve(
  __dirname,
  '..',
  '..',
  'test-results',
  'e2e-screenshots',
);

function formatTimestamp(d: Date) {
  const pad = (n: number) => String(n).padStart(2, '0');
  return (
    `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}` +
    `-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`
  );
}

/**
 * 한 test 의 산출물 디렉토리를 관리.
 *   - timestamp 기반 _pending/<TS>/ 에 저장
 *   - finalize() 시 success/failure/skipped 폴더로 이동
 *   - snap() 으로 스크린샷 + meta/error 파일 작성
 */
export class RunDir {
  readonly timestamp = formatTimestamp(new Date());
  readonly pendingDir = path.join(RESULTS_ROOT, '_pending', this.timestamp);

  prepare() {
    if (fs.existsSync(this.pendingDir)) {
      fs.rmSync(this.pendingDir, { recursive: true, force: true });
    }
    fs.mkdirSync(this.pendingDir, { recursive: true });
  }

  /** 단계별 스크린샷 저장. fullPage + 스크롤 최상단 보정. */
  async snap(page: Page, seq: number, name: string): Promise<void> {
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(150);
    const safeName = name.replace(/[^\w가-힣\-]/g, '_');
    const filename = `${String(seq).padStart(2, '0')}-${safeName}.png`;
    const filepath = path.join(this.pendingDir, filename);
    await page.screenshot({ path: filepath, fullPage: true });
    log(`  📸 ${filename}`);
  }

  writeMeta(content: string) {
    fs.writeFileSync(path.join(this.pendingDir, 'meta.txt'), content, 'utf8');
  }

  writeError(content: string) {
    fs.writeFileSync(path.join(this.pendingDir, 'error.txt'), content, 'utf8');
  }

  /** afterEach 에서 호출 — testInfo 로 status 결정 + meta/error 작성 + 폴더 이동. */
  async finalize(
    page: Page,
    testInfo: TestInfo,
    challengeTitle: string,
  ): Promise<void> {
    if (testInfo.status === 'failed' || testInfo.status === 'timedOut') {
      try {
        const failureFile = path.join(this.pendingDir, '99-실패시점.png');
        await page.screenshot({ path: failureFile, fullPage: true });
        log(`📸 실패 시점 캡처: ${failureFile}`);
      } catch {
        /* page 가 닫혔으면 무시 */
      }
      const message = testInfo.error?.message ?? '(no error message)';
      const stack = testInfo.error?.stack ?? '';
      this.writeError(`${message}\n\n${stack}\n`);
    }

    this.writeMeta(
      [
        `Test:       ${testInfo.title}`,
        `Status:     ${testInfo.status}`,
        `Expected:   ${testInfo.expectedStatus}`,
        `Run ID:     ${this.timestamp}`,
        `Duration:   ${testInfo.duration} ms`,
        `Final URL:  ${page.url()}`,
        `Base URL:   ${process.env.PLAYWRIGHT_BASE_URL ?? '(default)'}`,
        `Challenge:  ${challengeTitle}`,
      ].join('\n') + '\n',
    );

    const status: 'success' | 'failure' | 'skipped' =
      testInfo.status === 'passed'
        ? 'success'
        : testInfo.status === 'skipped'
          ? 'skipped'
          : 'failure';

    try {
      const targetParent = path.join(RESULTS_ROOT, status);
      fs.mkdirSync(targetParent, { recursive: true });
      const target = path.join(targetParent, this.timestamp);
      if (fs.existsSync(target)) {
        fs.rmSync(target, { recursive: true, force: true });
      }
      fs.renameSync(this.pendingDir, target);
      log(`📁 결과 저장: ${target}`);
    } catch (err) {
      log(`⚠ 결과 폴더 이동 실패: ${(err as Error).message}`);
    }
  }
}
