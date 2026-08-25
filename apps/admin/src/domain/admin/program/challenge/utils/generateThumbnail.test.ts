import { describe, expect, it } from 'vitest';

import {
  extractVersion,
  fitVerFontSize,
  resolveThumbnailImage,
} from './generateThumbnail';

describe('extractVersion', () => {
  it('제목 앞 대괄호 안의 문구를 그대로 반환한다', () => {
    expect(
      extractVersion('[인턴·실무 경험자 Ver.] 기필코 경험정리 가이드북 30기'),
    ).toBe('인턴·실무 경험자 Ver.');
  });

  it('Ver 표기가 소문자거나 마침표가 없어도 적힌 대로 반환한다', () => {
    expect(extractVersion('[대기업 ver] 4주 완성 자기소개서 챌린지 30기')).toBe(
      '대기업 ver',
    );
    expect(extractVersion('[스타트업 Ver] 면접 준비 7일 끝장 챌린지 7기')).toBe(
      '스타트업 Ver',
    );
  });

  it('Ver 이 없는 대괄호도 그대로 반환한다', () => {
    expect(extractVersion('[특별판] 기필코 경험정리 챌린지 12기')).toBe(
      '특별판',
    );
  });

  it('대괄호가 없으면 null 을 반환한다', () => {
    expect(extractVersion('기필코 경험정리 챌린지 30기')).toBeNull();
  });

  it('대괄호가 비어 있거나 공백뿐이면 null 을 반환한다', () => {
    expect(extractVersion('[] 기필코 경험정리 챌린지 30기')).toBeNull();
    expect(extractVersion('[   ] 기필코 경험정리 챌린지 30기')).toBeNull();
  });

  it('대괄호가 여러 개면 첫 번째만 쓴다', () => {
    expect(extractVersion('[대기업 Ver.] [재모집] 자소서 챌린지 30기')).toBe(
      '대기업 Ver.',
    );
  });

  it('앞뒤 공백은 다듬는다', () => {
    expect(extractVersion('[  대기업 Ver.  ] 자소서 챌린지 30기')).toBe(
      '대기업 Ver.',
    );
  });
});

// 배너 최대 폭 802.2px(캔버스 1146의 70%), 좌우 패딩 각 48 → 텍스트 한계 706.2px
describe('fitVerFontSize', () => {
  it('한계 폭 이내면 기본 크기 64를 유지한다', () => {
    expect(fitVerFontSize(545)).toBe(64);
    expect(fitVerFontSize(706)).toBe(64);
  });

  it('한계 폭을 넘으면 들어갈 때까지 줄인다', () => {
    expect(fitVerFontSize(1000)).toBe(45);
    expect(fitVerFontSize(1400)).toBe(32);
  });

  it('줄인 크기로 다시 재면 한계 폭 안에 들어온다', () => {
    for (const textWidth of [800, 1000, 1400, 2400]) {
      const fontSize = fitVerFontSize(textWidth);
      expect((textWidth * fontSize) / 64).toBeLessThanOrEqual(706.2);
    }
  });
});

describe('resolveThumbnailImage', () => {
  it('Ver 가 있으면 그래픽이 작은 전용 이미지를 쓴다', () => {
    expect(
      resolveThumbnailImage('EXPERIENCE_SUMMARY', '인턴·실무 경험자 Ver.'),
    ).toBe('/images/challenge-thumbnail-experience-summary-ver.png');
    expect(resolveThumbnailImage('PORTFOLIO', '1~3년차 주니어 Ver.')).toBe(
      '/images/challenge-thumbnail-portfolio-ver.png',
    );
  });

  it('Ver 가 없으면 기존 이미지를 쓴다', () => {
    expect(resolveThumbnailImage('EXPERIENCE_SUMMARY', null)).toBe(
      '/images/challenge-thumbnail-experience-summary.png',
    );
  });

  it('Ver 전용 이미지가 없는 타입은 Ver 가 있어도 기존 이미지를 쓴다', () => {
    expect(
      resolveThumbnailImage('PERSONAL_STATEMENT_LARGE_CORP', '대기업 Ver.'),
    ).toBe('/images/challenge-thumbnail-personal-statement-large-corp.png');
  });

  it('이력서는 Ver 가 있을 때만 생성 대상이다', () => {
    expect(resolveThumbnailImage('CAREER_START', '대학생, 무경력자 Ver')).toBe(
      '/images/challenge-thumbnail-career-start-ver.png',
    );
    expect(resolveThumbnailImage('CAREER_START', null)).toBeNull();
  });

  it('지원하지 않는 타입은 null 이다', () => {
    expect(resolveThumbnailImage('MARKETING', 'Live 세미나 전용')).toBeNull();
    expect(resolveThumbnailImage('MARKETING', null)).toBeNull();
  });
});
