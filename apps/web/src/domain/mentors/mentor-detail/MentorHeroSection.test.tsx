import { render, screen } from '@testing-library/react';

import type {
  MentorCareerItem,
  MentorDetailData,
} from '@/api/mentor/mentorSchema';

import MentorHeroSection from './MentorHeroSection';

const career = (overrides: Partial<MentorCareerItem>): MentorCareerItem => ({
  id: 1,
  company: '회사',
  field: null,
  job: '직무',
  position: null,
  department: null,
  employmentType: null,
  startDate: '2020-01',
  endDate: '2021-01',
  isAddedByAdmin: false,
  isRepresentative: false,
  ...overrides,
});

const renderHero = (careerList: MentorCareerItem[]) => {
  const mentor: MentorDetailData = {
    mentorInfo: {
      mentorId: 3,
      nickname: '멘토',
      description: null,
      profileImgUrl: null,
      corpImgUrl: 'https://cdn.test/corp.png',
      company: '대표회사',
      job: '대표직무',
    },
    careerList,
    proceedingProgramList: [],
    postProgramList: [],
    reviewList: [],
  };
  const { container } = render(
    <MentorHeroSection
      mentor={mentor}
      stats={{ feedbackMenteeCount: 0, reviewCount: 0, averageScore: 0 }}
    />,
  );
  const iconOf = (company: string) =>
    screen
      .getByText((text) => text.startsWith(`${company} |`))
      .closest('div')
      ?.querySelector('img')
      ?.getAttribute('src');
  return { container, iconOf };
};

describe('MentorHeroSection 경력 로고 (LC-3499)', () => {
  it('경력 로고가 있으면 경력 줄 앞에 그 로고를 쓴다', () => {
    const { iconOf } = renderHero([
      career({
        id: 1,
        company: '로고회사',
        logoImgUrl: 'https://cdn.test/a.png',
      }),
    ]);
    expect(iconOf('로고회사')).toBe('https://cdn.test/a.png');
  });

  it('경력 로고가 없으면 지금처럼 대표 경력은 대표 로고, 나머지는 기본 아이콘', () => {
    const { iconOf } = renderHero([
      career({ id: 1, company: '대표', isRepresentative: true }),
      career({ id: 2, company: '이전', logoImgUrl: null }),
    ]);
    expect(iconOf('대표')).toBe('https://cdn.test/corp.png');
    expect(iconOf('이전')).toBe('/icons/company.svg');
  });

  it('대표 경력이라도 경력 로고가 있으면 경력 로고가 먼저다', () => {
    const { iconOf } = renderHero([
      career({
        id: 1,
        company: '대표',
        isRepresentative: true,
        logoImgUrl: 'https://cdn.test/own.png',
      }),
    ]);
    expect(iconOf('대표')).toBe('https://cdn.test/own.png');
  });
});
