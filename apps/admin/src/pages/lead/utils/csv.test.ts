import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { downloadCsv } from './csv';

// downloadCsv는 Blob/URL/DOM API를 사용하므로 jsdom에서 검증한다.
// 생성된 CSV 본문을 확인하기 위해 Blob 생성자를 가로채 텍스트를 캡처한다.

describe('downloadCsv', () => {
  const blobs: string[] = [];
  const originalBlob = global.Blob;
  let createObjectURLSpy: ReturnType<typeof vi.fn>;
  let revokeObjectURLSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    blobs.length = 0;
    // Blob 인스턴스의 첫 번째 인자(string 배열)를 캡처한다.
    (global as { Blob: typeof Blob }).Blob = class extends originalBlob {
      constructor(parts?: BlobPart[], options?: BlobPropertyBag) {
        super(parts, options);
        if (parts && typeof parts[0] === 'string') {
          blobs.push(parts[0] as string);
        }
      }
    } as unknown as typeof Blob;

    createObjectURLSpy = vi.fn(() => 'blob:mock');
    revokeObjectURLSpy = vi.fn();
    (
      URL as unknown as { createObjectURL: typeof URL.createObjectURL }
    ).createObjectURL = createObjectURLSpy;
    (
      URL as unknown as { revokeObjectURL: typeof URL.revokeObjectURL }
    ).revokeObjectURL = revokeObjectURLSpy;
    // jsdom에서 anchor click이 navigation을 시도하므로 차단한다.
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
  });

  afterEach(() => {
    (global as { Blob: typeof Blob }).Blob = originalBlob;
    vi.restoreAllMocks();
  });

  it('헤더 첫 컬럼이 "신청일자"이고 행 첫 컬럼이 YYYY-MM-DD HH:mm 포맷으로 직렬화된다', () => {
    downloadCsv(
      'magnet-123-applications',
      [
        '신청일자',
        '이름',
        '전화번호',
        '학년',
        '희망직군',
        '희망직무',
        '희망산업',
        '희망기업',
        '질문 답변',
        '마케팅 동의 여부',
      ],
      [
        [
          '2026-05-12 18:30',
          '김철수',
          '01099998888',
          '4학년',
          '디자인',
          'UX',
          '플랫폼',
          '회사',
          '-',
          '미동의',
        ],
        [
          '2026-05-10 09:00',
          '홍길동',
          '01011112222',
          '3학년',
          '개발',
          '프론트엔드',
          'IT',
          '렛츠커리어',
          '왜: 성장',
          '동의',
        ],
      ],
    );

    expect(blobs).toHaveLength(1);
    // BOM(﻿) 제거 후 라인 분리.
    const csv = blobs[0].replace(/^﻿/, '');
    const [headerLine, firstRow, secondRow] = csv.split('\n');

    // 헤더 첫 컬럼이 "신청일자".
    expect(headerLine.split(',')[0]).toBe('신청일자');
    // 행 첫 컬럼이 YYYY-MM-DD HH:mm 포맷.
    expect(firstRow.split(',')[0]).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/);
    expect(secondRow.split(',')[0]).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/);
    // 헤더 전체 순서가 기존 컬럼 순서를 유지한다.
    expect(headerLine).toBe(
      '신청일자,이름,전화번호,학년,희망직군,희망직무,희망산업,희망기업,질문 답변,마케팅 동의 여부',
    );
  });

  it('파일명은 입력 파일명과 타임스탬프로 구성된다', () => {
    // createElement('a')를 가로채 download 속성을 캡처한다.
    const originalCreateElement = document.createElement.bind(document);
    let capturedDownload = '';
    vi.spyOn(document, 'createElement').mockImplementation((tagName) => {
      const element = originalCreateElement(tagName);
      if (tagName === 'a') {
        const anchor = element as HTMLAnchorElement;
        const originalSetAttribute = anchor.setAttribute.bind(anchor);
        anchor.setAttribute = (name: string, value: string) => {
          if (name === 'download') capturedDownload = value;
          return originalSetAttribute(name, value);
        };
      }
      return element;
    });

    downloadCsv('magnet-123-applications', ['신청일자'], [['2026-05-12 18:30']]);

    expect(capturedDownload).toMatch(
      /^magnet-123-applications_\d{8}_\d{6}\.csv$/,
    );
  });
});
