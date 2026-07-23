/**
 * apps/mentor/index.html 정적 메타 태그 검증.
 *
 * 멘토 앱은 Vite SPA라 라우트별 동적 메타데이터가 불가능해, 링크 미리보기(OG)·탭 식별용
 * 메타 태그를 index.html 한 곳에 정적으로 박는다. 이 테스트는 그 태그들이 존재하고 값이
 * 맞는지 index.html을 텍스트로 읽어 단언한다. prettier가 속성을 여러 줄로 쪼갤 수 있으므로
 * 공백을 정규화한 뒤 검사한다.
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

// vitest 는 패키지 루트(apps/mentor)를 cwd 로 실행하므로 index.html 이 여기 있다.
const INDEX_HTML_PATH = resolve(process.cwd(), 'index.html');

// 속성 순서/줄바꿈에 무관하게 검사하기 위해 태그 내부 공백을 단일 스페이스로 정규화.
const html = readFileSync(INDEX_HTML_PATH, 'utf-8').replace(/\s+/g, ' ');

const OG_IMAGE_URL =
  'https://letsintern-bucket.s3.ap-northeast-2.amazonaws.com/banner/popup/%E1%84%85%E1%85%A6%E1%86%BA%E1%84%8E%E1%85%B3%E1%84%8F%E1%85%A5%E1%84%85%E1%85%B5%E1%84%8B%E1%85%A5%20%E1%84%85%E1%85%A9%E1%84%80%E1%85%A9%20og_image%201200_630.png';

const DESCRIPTION =
  '렛츠커리어 챌린지 멘토를 위한 일정·피드백 관리 페이지입니다.';

describe('index.html 정적 메타 태그', () => {
  it('description 메타 태그를 가진다', () => {
    expect(html).toContain('name="description"');
    expect(html).toContain(`content="${DESCRIPTION}"`);
  });

  it('robots noindex, nofollow 메타 태그를 가진다', () => {
    expect(html).toContain('name="robots"');
    expect(html).toContain('content="noindex, nofollow"');
  });

  it('Open Graph 기본 세트를 가진다', () => {
    expect(html).toContain('property="og:type" content="website"');
    expect(html).toContain('property="og:title" content="렛츠커리어 멘토"');
    expect(html).toContain('property="og:site_name" content="렛츠커리어 멘토"');
    expect(html).toContain('property="og:locale" content="ko_KR"');
  });

  it('og:description 은 description 과 동일하다', () => {
    expect(html).toContain('property="og:description"');
    expect(html).toContain(`content="${DESCRIPTION}"`);
  });

  it('og:image 는 사이트 전역 대표 이미지 URL 을 사용한다', () => {
    expect(html).toContain(`property="og:image" content="${OG_IMAGE_URL}"`);
  });

  it('og:url 은 VITE_BASE_URL 플레이스홀더를 사용한다', () => {
    expect(html).toContain('property="og:url" content="%VITE_BASE_URL%"');
  });

  it('favicon link 의 type 이 실제 포맷(PNG)과 일치한다', () => {
    expect(html).toContain('rel="icon" type="image/png"');
  });
});
