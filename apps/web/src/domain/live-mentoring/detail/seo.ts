import type {
  LiveMentoringCategory,
  LiveMentorDetail,
} from '@/api/live-mentoring/liveMentoringSchema';

import { formatPrice } from '../constants';

/** 메타에 필요한 값만. 상세 응답 전체를 받지 않아 테스트가 가볍다. */
export type MentoringSeoInput = Pick<
  LiveMentorDetail,
  'title' | 'categories' | 'durations' | 'durationPrices' | 'price'
> & {
  profile: Pick<LiveMentorDetail['profile'], 'nickname'>;
  template: { intro: Pick<LiveMentorDetail['template']['intro'], 'affiliation'> };
};

/** 사용자가 검색하는 말로 푼 주제 이름. 화면 라벨(`CATEGORY_LABELS`)과 다르다. */
export const SEARCH_TOPIC_LABELS: Record<LiveMentoringCategory, string> = {
  PERSONAL_STATEMENT: '자기소개서 첨삭',
  RESUME: '이력서 첨삭',
  PORTFOLIO: '포트폴리오 피드백',
  CAREER_COFFEE_CHAT: '커리어 커피챗',
  INTERVIEW: '모의 면접',
  EXPERIENCE: '경험정리 피드백',
};

/**
 * 카드에 보이는 소속 라벨 (예: "CJ 올리브영 온사이트마케터").
 * 서버가 공개 여부를 반영해 만든 `intro.affiliation` 만 쓴다 — 비공개 회사명을
 * 여기서 다시 거르지 않고, 새로 조립하지도 않는다. 비어 있으면 빈 문자열.
 */
export const affiliationLabel = (input: MentoringSeoInput): string =>
  input.template.intro.affiliation
    .split('|')
    .map((part) => part.trim())
    .filter(Boolean)
    .join(' ');

const lowestPrice = (input: MentoringSeoInput): number | null => {
  const prices = input.durationPrices.map((item) => item.price);
  if (prices.length > 0) return Math.min(...prices);
  return input.price;
};

const who = (input: MentoringSeoInput): string =>
  affiliationLabel(input) || `${input.profile.nickname ?? '현직자'} 멘토`;

/** `{소속 라벨} 현직자 1:1 멘토링 – {멘토링 제목} | 렛츠커리어` */
export const buildMentoringTitle = (input: MentoringSeoInput): string => {
  const label = affiliationLabel(input);
  const head = label
    ? `${label} 현직자 1:1 멘토링`
    : `${who(input)} 1:1 멘토링`;
  return `${head} – ${input.title} | 렛츠커리어`;
};

export const buildMentoringDescription = (input: MentoringSeoInput): string => {
  const topics = input.categories.map((c) => SEARCH_TOPIC_LABELS[c]).join('·');
  const durations = input.durations.map((d) => `${d}분`).join('/');
  const price = lowestPrice(input);
  const tail = [durations, price === null ? '' : `${formatPrice(price)}부터`]
    .filter(Boolean)
    .join(', ');
  const body = `${who(input)}${affiliationLabel(input) ? ' 현직자' : ''}와 줌에서 화면을 함께 보며 ${topics} 1:1 실시간 피드백.`;
  return tail ? `${body} ${tail}.` : body;
};
