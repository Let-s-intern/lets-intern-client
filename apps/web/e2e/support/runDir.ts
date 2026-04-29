import * as fs from 'node:fs';
import * as path from 'node:path';
import type { Page, TestInfo } from '@playwright/test';
import { log } from './log';
import type { JournalEntry, JournalNote } from './pipeline';

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
    log(`  [SNAP] ${filename}`);
  }

  writeMeta(content: string) {
    fs.writeFileSync(path.join(this.pendingDir, 'meta.txt'), content, 'utf8');
  }

  writeError(content: string) {
    fs.writeFileSync(path.join(this.pendingDir, 'error.txt'), content, 'utf8');
  }

  /** afterEach 에서 호출 — testInfo 로 status 결정 + meta/error 작성 + 폴더 이동 + 리포트 출력. */
  async finalize(
    page: Page,
    testInfo: TestInfo,
    challengeTitle: string,
    journal: JournalEntry[] = [],
    notes: JournalNote[] = [],
  ): Promise<void> {
    if (testInfo.status === 'failed' || testInfo.status === 'timedOut') {
      try {
        const failureFile = path.join(this.pendingDir, '99-실패시점.png');
        await page.screenshot({ path: failureFile, fullPage: true });
        log(`[SNAP] 실패 시점 캡처: ${failureFile}`);
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

    let savedTarget: string | null = null;
    try {
      const targetParent = path.join(RESULTS_ROOT, status);
      fs.mkdirSync(targetParent, { recursive: true });
      const target = path.join(targetParent, this.timestamp);
      if (fs.existsSync(target)) {
        fs.rmSync(target, { recursive: true, force: true });
      }
      fs.renameSync(this.pendingDir, target);
      savedTarget = target;
      log(`[OUT] 결과 저장: ${target}`);
    } catch (err) {
      log(`[WARN] 결과 폴더 이동 실패: ${(err as Error).message}`);
    }

    // 실행 통계 출력 (콘솔 + report.txt).
    const screenshots = savedTarget
      ? fs.readdirSync(savedTarget).filter((f) => f.endsWith('.png')).length
      : 0;
    const seconds = (testInfo.duration / 1000).toFixed(1);
    const passedSteps = journal.filter((j) => j.status === 'passed').length;
    const failedSteps = journal.filter((j) => j.status === 'failed').length;

    const lines: string[] = [];
    lines.push('=========================================');
    lines.push('E2E 실행 결과 리포트');
    lines.push('=========================================');
    lines.push('');
    lines.push('[기본 정보]');
    lines.push(`  Run ID      : ${this.timestamp}`);
    lines.push(`  Status      : ${testInfo.status}`);
    lines.push(`  Duration    : ${testInfo.duration} ms (${seconds}s)`);
    lines.push(`  Final URL   : ${page.url()}`);
    lines.push(
      `  Base URL    : ${process.env.PLAYWRIGHT_BASE_URL ?? '(default)'}`,
    );
    lines.push(`  Challenge   : ${challengeTitle}`);
    lines.push(`  Screenshots : ${screenshots}장`);
    if (savedTarget) lines.push(`  Output      : ${savedTarget}`);
    lines.push('');

    lines.push('[검사한 플로우]');
    if (journal.length === 0) {
      lines.push('  (단계 기록 없음 — Pipeline 사용 spec 인지 확인)');
    } else {
      lines.push(
        `  총 ${journal.length}단계 (passed=${passedSteps}, failed=${failedSteps})`,
      );
      journal.forEach((j, idx) => {
        const tag = j.status === 'passed' ? '[OK]    ' : '[FAIL]  ';
        const dur = `${j.durationMs}ms`.padStart(7);
        lines.push(
          `  ${String(idx + 1).padStart(2)}. ${tag}${j.label} (${dur}) @${j.startedAt}`,
        );
        lines.push(`      url=${j.finalUrl}`);
        if (j.errorMessage) {
          lines.push(`      err=${j.errorMessage}`);
        }
      });
    }
    lines.push('');

    if (notes.length > 0) {
      lines.push('[페이지 상태 / 발견 이벤트]');
      notes.forEach((n) => {
        lines.push(`  [${n.at}] ${n.message}`);
      });
      lines.push('');
    }

    if (
      testInfo.status === 'failed' ||
      testInfo.status === 'timedOut' ||
      testInfo.status === 'skipped'
    ) {
      lines.push('[종결 사유]');
      if (testInfo.error?.message) {
        const msg = testInfo.error.message
          .split('\n')
          .slice(0, 4)
          .join('\n        ');
        lines.push(`  ${testInfo.status}: ${msg}`);
      } else if (testInfo.status === 'skipped') {
        lines.push(
          `  skipped: 명시적 test.skip() 호출 (사유는 위 단계 err 메시지 또는 콘솔 로그 참고)`,
        );
      } else {
        lines.push(`  ${testInfo.status}: (메시지 없음)`);
      }
      lines.push('');
    }

    lines.push('=========================================');

    // 콘솔에 출력
    lines.forEach((l) => log(l));

    // report.txt 로도 저장 (savedTarget 안에).
    if (savedTarget) {
      try {
        fs.writeFileSync(
          path.join(savedTarget, 'report.txt'),
          lines.join('\n') + '\n',
          'utf8',
        );
      } catch (err) {
        log(`[WARN] report.txt 저장 실패: ${(err as Error).message}`);
      }
    }
  }
}
