import {
  affiliationLabel,
  buildMentoringDescription,
  buildMentoringTitle,
  type MentoringSeoInput,
} from './seo';

const input = (overrides: Partial<MentoringSeoInput> = {}): MentoringSeoInput => ({
  title: '현직 마케팅팀장의 1:1 피드백',
  categories: ['PERSONAL_STATEMENT', 'CAREER_COFFEE_CHAT'],
  durations: [30, 60],
  durationPrices: [
    { durationPriceId: 1, duration: 30, price: 39000 },
    { durationPriceId: 2, duration: 60, price: 69000 },
  ],
  price: 39000,
  profile: { nickname: '올리브' },
  template: { intro: { affiliation: 'CJ 올리브영 | 온사이트마케터' } },
  ...overrides,
});

describe('멘토링 상세 메타', () => {
  it('소속 라벨의 구분자를 공백으로 바꾼다', () => {
    expect(affiliationLabel(input())).toBe('CJ 올리브영 온사이트마케터');
  });

  it('title 은 라벨 + 현직자 멘토링 + 제목 + 브랜드 순이다', () => {
    expect(buildMentoringTitle(input())).toBe(
      'CJ 올리브영 온사이트마케터 현직자 1:1 멘토링 – 현직 마케팅팀장의 1:1 피드백 | 렛츠커리어',
    );
  });

  it('description 에 주제·시간·최저가가 들어간다', () => {
    const text = buildMentoringDescription(input());
    expect(text).toContain('자기소개서 첨삭·커리어 커피챗');
    expect(text).toContain('30분/60분, 39,000원부터');
  });

  it('소속이 비면 닉네임으로 대신한다', () => {
    const empty = input({ template: { intro: { affiliation: '' } } });
    expect(buildMentoringTitle(empty)).toMatch(/^올리브 멘토 1:1 멘토링 – /);
    expect(buildMentoringDescription(empty)).toMatch(/^올리브 멘토와 줌에서/);
  });

  it('닉네임도 없으면 현직자로 폴백한다', () => {
    const empty = input({
      profile: { nickname: null },
      template: { intro: { affiliation: '' } },
    });
    expect(buildMentoringTitle(empty)).toMatch(/^현직자 멘토 1:1 멘토링/);
  });

  it('60분만 열었으면 60분 가격을 쓴다', () => {
    const only60 = input({
      durations: [60],
      durationPrices: [{ durationPriceId: 2, duration: 60, price: 69000 }],
      price: 69000,
    });
    expect(buildMentoringDescription(only60)).toContain('60분, 69,000원부터');
  });

  it('가격이 없으면 가격 문구를 뺀다', () => {
    const none = input({ durationPrices: [], price: null });
    expect(buildMentoringDescription(none)).not.toContain('원부터');
  });
});
