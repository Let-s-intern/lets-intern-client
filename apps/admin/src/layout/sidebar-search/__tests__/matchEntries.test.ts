import { describe, expect, it } from 'vitest';

import { matchEntries, splitHighlight } from '../matchEntries';
import type { SearchEntry } from '../searchEntries';

const entry = (
  label: string,
  parents: string[] = ['그룹'],
  keywords: string[] = [],
): SearchEntry => ({ label, path: `/${label}`, parents, keywords });

describe('matchEntries', () => {
  it('공백·대소문자를 무시하고 부분 일치로 찾는다', () => {
    const entries = [entry('렛커 픽'), entry('VOD 이용권')];
    expect(matchEntries(entries, '렛커픽').map((e) => e.label)).toEqual([
      '렛커 픽',
    ]);
    expect(matchEntries(entries, 'vod').map((e) => e.label)).toEqual([
      'VOD 이용권',
    ]);
  });

  it('label 시작 > label 포함 > keywords > parents 순서로 정렬한다', () => {
    const entries = [
      entry('그룹 안의 메뉴', ['로고 관리']),
      entry('대표 로고', ['그룹']),
      entry('파비콘', ['그룹'], ['로고 후보']),
      entry('로고 라이브러리'),
    ];
    expect(matchEntries(entries, '로고').map((e) => e.label)).toEqual([
      '로고 라이브러리',
      '대표 로고',
      '파비콘',
      '그룹 안의 메뉴',
    ]);
  });

  it('빈 검색어면 아무것도 돌려주지 않는다', () => {
    expect(matchEntries([entry('멘토 목록')], '   ')).toEqual([]);
  });
});

describe('splitHighlight', () => {
  it('맞는 부분만 강조한다', () => {
    expect(splitHighlight('회사 로고', '로고')).toEqual([
      { text: '회사 ', isMatch: false },
      { text: '로고', isMatch: true },
    ]);
  });

  it('공백을 건너 맞은 범위는 원문 공백을 포함해 강조한다', () => {
    expect(splitHighlight('렛커 픽', '커픽')).toEqual([
      { text: '렛', isMatch: false },
      { text: '커 픽', isMatch: true },
    ]);
  });

  it('맞지 않으면 통째로 둔다', () => {
    expect(splitHighlight('멘토 목록', '로고')).toEqual([
      { text: '멘토 목록', isMatch: false },
    ]);
  });
});
