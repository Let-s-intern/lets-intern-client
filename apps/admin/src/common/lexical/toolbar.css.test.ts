/**
 * Lexical 툴바(.toolbar) CSS 회귀 테스트
 *
 * 배경: 어드민 → 챌린지 운영 → 피드백 → 피드백 관리 페이지에서 Lexical 에디터의
 *      상단 툴바가 보이지 않는 버그가 있었다. 원인은 `.toolbar` 가 고정 height: 36px 를 갖고
 *      `overflow-x: auto` 만 설정해 브라우저가 overflow-y 를 auto 로 추론하면서
 *      18px+padding 인 버튼/아이콘이 세로 방향으로 잘려 보이지 않게 된 것.
 *
 * 회귀 방지: index.css 의 `.toolbar` 룰이 (a) 고정 height 가 아닌 min-height 를 쓰고
 *           (b) overflow-y: visible 을 명시하며 (c) flex-wrap: wrap 으로 세로 클립을
 *           유발하지 않는 구조를 유지하는지 단언한다. 단순 문자열 검사이지만 향후 누군가
 *           실수로 height: 36px 으로 되돌릴 때 즉시 실패한다.
 */
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const __dirname = dirname(fileURLToPath(import.meta.url));
const cssPath = resolve(__dirname, 'index.css');
const css = readFileSync(cssPath, 'utf-8');

// `.toolbar { ... }` 블록 추출 (.toolbar . 같은 nested 셀렉터는 제외)
const TOOLBAR_BLOCK_RE = /\.toolbar\s*\{([^}]+)\}/m;

describe('lexical .toolbar CSS', () => {
  const match = css.match(TOOLBAR_BLOCK_RE);

  it('.toolbar 룰 블록이 존재한다', () => {
    expect(match).not.toBeNull();
  });

  const block = match?.[1] ?? '';

  it('고정 height 대신 min-height 를 사용한다 (세로 클립 방지)', () => {
    expect(block).toMatch(/min-height:\s*36px/);
    // 단순 height: 36px 이 다시 들어오면 즉시 실패
    expect(block).not.toMatch(/(^|\s)height:\s*36px/);
  });

  it('overflow-y: visible 이 명시되어 있다 (overflow-x: auto 의 부작용 차단)', () => {
    expect(block).toMatch(/overflow-y:\s*visible/);
  });

  it('flex-wrap: wrap 으로 좁은 뷰포트에서 줄바꿈 처리한다', () => {
    expect(block).toMatch(/flex-wrap:\s*wrap/);
  });
});
