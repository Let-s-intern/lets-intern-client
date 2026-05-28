#!/usr/bin/env node
/*
 * render_to_pdf.js — report.html 을 A4 흑백 PDF 로 변환한다. (git-branch-report 스킬)
 *
 * 사용법:
 *   node render_to_pdf.js --html <report.html> [--out <report.pdf>]
 *
 * 동작: Playwright Chromium 으로 file:// 로드 → networkidle(웹폰트 로딩) 대기 → page.pdf().
 *       A4 / 여백 20mm / printBackground:false(흑백 출력에 배경 불필요).
 *
 * Playwright 미설치(PRD §9): 변환을 건너뛰고 HTML 을 그대로 두며,
 *   "브라우저에서 열어 인쇄(Cmd/Ctrl+P) → PDF 저장" 안내 후 exit 3 으로 종료(비치명적).
 *   exit 3 = 브라우저 미가용으로 건너뜀(HTML 은 정상). exit 1 = 실제 오류.
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
const log = (m) => process.stderr.write(`[render_to_pdf] ${m}\n`);

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

(async () => {
  const args = parseArgs(process.argv.slice(2));
  if (!args.html) {
    log('필수 인자 누락: --html <report.html>');
    process.exit(1);
  }
  const htmlPath = path.resolve(args.html);
  if (!fs.existsSync(htmlPath)) {
    log(`HTML 파일을 찾을 수 없습니다: ${htmlPath}`);
    process.exit(1);
  }
  const pdfPath = args.out
    ? path.resolve(args.out)
    : htmlPath.replace(/\.html$/, '.pdf');

  const chromium = loadChromium();
  if (!chromium) {
    log('Playwright 가 설치되어 있지 않아 PDF 변환을 건너뜁니다.');
    log('  HTML 보고서는 정상 생성되었습니다: ' + htmlPath);
    log('  PDF 가 필요하면 둘 중 하나:');
    log(
      '    1) 브라우저에서 HTML 을 열고 인쇄(Cmd/Ctrl+P) → "PDF로 저장" (A4, 배경 끄기)',
    );
    log('    2) Playwright 설치 후 재실행:  npx playwright install chromium');
    process.exit(3);
  }

  let browser;
  try {
    browser = await chromium.launch();
  } catch (e) {
    // playwright 패키지는 있으나 브라우저 바이너리가 없을 때 — 미설치와 동일하게 graceful 처리(exit 3).
    if (/Executable doesn't exist|playwright install/i.test(e.message)) {
      log(
        'Playwright 브라우저(chromium)가 설치되어 있지 않아 PDF 변환을 건너뜁니다.',
      );
      log('  HTML 보고서는 정상 생성되었습니다: ' + htmlPath);
      log('  PDF 가 필요하면:  npx playwright install chromium  후 재실행');
      log('  또는 브라우저에서 HTML 을 열고 인쇄(Cmd/Ctrl+P) → "PDF로 저장".');
      process.exit(3);
    }
    log(`브라우저 실행 실패: ${e.message}`);
    process.exit(1);
  }
  try {
    const page = await browser.newPage();
    await page.goto(`file://${htmlPath}`, {
      waitUntil: 'networkidle',
      timeout: 30000,
    });
    await page.pdf({
      path: pdfPath,
      format: 'A4',
      printBackground: false,
      margin: { top: '20mm', right: '20mm', bottom: '20mm', left: '20mm' },
    });
    log(`생성: ${pdfPath}`);
    process.stdout.write(`${JSON.stringify({ pdfPath })}\n`);
  } catch (e) {
    log(`PDF 변환 실패: ${e.message}`);
    process.exit(1);
  } finally {
    if (browser) await browser.close();
  }
})();
