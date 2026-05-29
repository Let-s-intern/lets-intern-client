#!/usr/bin/env node
/*
 * capture_screens.js — feature 유형 전용. URL 목록을 순서대로 접속해 fullPage 스크린샷을
 *                       <out-dir>/screen-{n}.png 로 저장한다. (git-branch-report 스킬)
 *
 * 사용법:
 *   node capture_screens.js --content <content.json> --out-dir <out>/screens
 *   node capture_screens.js --urls "http://localhost:3000/a,http://localhost:3000/b" --out-dir <dir>
 *
 *   URL 출처는 content.json 의 screens[].url 또는 --urls 콤마 목록.
 *
 * 화질: deviceScaleFactor:2 (레티나) + fullPage. PDF 에서 선명하게 보이도록.
 *
 * 엣지케이스(PRD §9 — 전체 중단 없이 진행):
 *   - 접속/캡처 실패한 URL 은 건너뛰고(해당 screen-n.png 미생성) 다음 URL 진행.
 *     → build_report.js 가 파일 부재를 감지해 "캡처 실패" 빈 칸으로 표시.
 *   - Playwright 미설치 → 캡처 불가 안내 후 exit 3(비치명적). HTML 은 텍스트로만 구성됨.
 */
'use strict';

const fs = require('fs');
const path = require('path');

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i].startsWith('--')) out[argv[i].slice(2)] = argv[i + 1];
  }
  return out;
}
const log = (m) => process.stderr.write(`[capture_screens] ${m}\n`);

function loadChromium() {
  try {
    return require('playwright').chromium;
  } catch {
    try {
      return require('playwright-core').chromium;
    } catch {
      return null;
    }
  }
}

function resolveUrls(args) {
  if (args.urls)
    return args.urls
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  if (args.content) {
    try {
      const c = JSON.parse(fs.readFileSync(args.content, 'utf8'));
      return (c.screens || []).map((s) => s.url).filter(Boolean);
    } catch (e) {
      log(`content JSON 파싱 실패: ${e.message}`);
      return [];
    }
  }
  return [];
}

(async () => {
  const args = parseArgs(process.argv.slice(2));
  const outDir = args['out-dir'];
  if (!outDir) {
    log('필수 인자 누락: --out-dir <screens 디렉토리>');
    process.exit(1);
  }
  const urls = resolveUrls(args);
  if (urls.length === 0) {
    log(
      '캡처할 URL 이 없습니다 — 화면 캡처를 건너뜁니다 (텍스트 전용 보고서).',
    );
    process.exit(0); // URL 미제공은 정상 흐름(PRD §5)
  }

  const chromium = loadChromium();
  if (!chromium) {
    log('Playwright 가 설치되어 있지 않아 화면 캡처를 건너뜁니다.');
    log('  로컬 dev 서버 화면을 캡처하려면:  npx playwright install chromium');
    log('  (캡처 없이도 텍스트 보고서는 정상 생성됩니다.)');
    process.exit(3);
  }

  fs.mkdirSync(outDir, { recursive: true });
  let browser;
  let ok = 0;
  const failed = [];
  try {
    browser = await chromium.launch();
  } catch (e) {
    // playwright 패키지는 있으나 브라우저 바이너리가 없을 때 — 미설치와 동일하게 graceful 처리(exit 3).
    if (/Executable doesn't exist|playwright install/i.test(e.message)) {
      log(
        'Playwright 브라우저(chromium)가 설치되어 있지 않아 화면 캡처를 건너뜁니다.',
      );
      log(
        '  로컬 dev 서버 화면을 캡처하려면:  npx playwright install chromium',
      );
      log('  (캡처 없이도 텍스트 보고서는 정상 생성됩니다.)');
      process.exit(3);
    }
    log(`브라우저 실행 실패: ${e.message}`);
    process.exit(1);
  }
  try {
    const context = await browser.newContext({
      deviceScaleFactor: 2,
      viewport: { width: 1280, height: 800 },
    });
    for (let i = 0; i < urls.length; i += 1) {
      const url = urls[i];
      const file = path.join(outDir, `screen-${i + 1}.png`);
      const page = await context.newPage();
      try {
        await page.goto(url, { waitUntil: 'networkidle', timeout: 20000 });
        await page.screenshot({ path: file, fullPage: true });
        ok += 1;
        log(`캡처 ${i + 1}/${urls.length}: ${url}`);
      } catch (e) {
        failed.push({ index: i + 1, url, reason: e.message });
        log(
          `캡처 실패 ${i + 1}/${urls.length}: ${url} — ${e.message.split('\n')[0]}`,
        );
        log(
          '  → 로그인이 필요한 페이지거나 서버가 떠 있지 않을 수 있습니다. 로컬 dev 서버 권장.',
        );
      } finally {
        await page.close();
      }
    }
  } catch (e) {
    log(`브라우저 실행 실패: ${e.message}`);
    process.exit(1);
  } finally {
    if (browser) await browser.close();
  }
  process.stdout.write(
    `${JSON.stringify({ total: urls.length, captured: ok, failed })}\n`,
  );
  log(`완료: ${ok}/${urls.length} 캡처`);
})();
