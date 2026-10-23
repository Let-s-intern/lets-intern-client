import type { SearchEntry } from './searchEntries';

/** 공백을 빼고 소문자로. 「렛커 픽」 과 「렛커픽」 을 같게 본다 */
const normalize = (text: string) => text.replace(/\s+/g, '').toLowerCase();

const includes = (text: string, query: string) =>
  normalize(text).includes(query);

/** 낮을수록 위. label 시작 일치 > label 포함 > keywords > parents. 안 맞으면 null */
const rankOf = (entry: SearchEntry, query: string): number | null => {
  const label = normalize(entry.label);
  if (label.startsWith(query)) return 0;
  if (label.includes(query)) return 1;
  if (entry.keywords.some((keyword) => includes(keyword, query))) return 2;
  if (entry.parents.some((parent) => includes(parent, query))) return 3;
  return null;
};

/** 검색어에 맞는 항목. 같은 순위끼리는 원래 순서(사이드바 순서)를 지킨다 */
export const matchEntries = (
  entries: SearchEntry[],
  rawQuery: string,
): SearchEntry[] => {
  const query = normalize(rawQuery);
  if (!query) return [];
  return entries
    .map((entry, index) => ({ entry, index, rank: rankOf(entry, query) }))
    .filter(
      (item): item is { entry: SearchEntry; index: number; rank: number } =>
        item.rank !== null,
    )
    .sort((a, b) => a.rank - b.rank || a.index - b.index)
    .map((item) => item.entry);
};

/**
 * 강조할 구간으로 나눈다. 공백을 무시하고 찾으므로, 원문의 공백은 그대로 둔 채 맞는 글자 범위를 잡는다.
 * 예) 「렛커 픽」 에서 「커픽」 → [렛][커 픽(강조)]
 */
export const splitHighlight = (
  text: string,
  rawQuery: string,
): { text: string; isMatch: boolean }[] => {
  const query = normalize(rawQuery);
  // 공백이 아닌 글자들의 원문 위치
  const positions = text
    .split('')
    .flatMap((char, index) => (/\s/.test(char) ? [] : [index]));
  const compact = positions.map((index) => text[index].toLowerCase()).join('');
  const found = query ? compact.indexOf(query) : -1;
  if (found < 0) return [{ text, isMatch: false }];

  const start = positions[found];
  const end = positions[found + query.length - 1] + 1;
  return [
    { text: text.slice(0, start), isMatch: false },
    { text: text.slice(start, end), isMatch: true },
    { text: text.slice(end), isMatch: false },
  ].filter((part) => part.text);
};
