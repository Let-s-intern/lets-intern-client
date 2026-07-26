import { render, screen } from '@testing-library/react';

import type { LiveMentoringOpening } from '@/api/live-mentoring/liveMentoringSchema';
import MentorCard from './MentorCard';

function makeOpening(
  overrides: Partial<LiveMentoringOpening> = {},
): LiveMentoringOpening {
  return {
    id: 100,
    mentorId: 1,
    mentorNickname: '자소서장인',
    mentorProfileImage: 'https://example.com/p.png',
    mentorIntroduction: '두괄식 구조로 첨삭',
    representativeCareer: {
      id: 7,
      company: '네이버',
      field: 'IT',
      job: '서비스 기획',
      position: '리드',
      department: '기획팀',
      startDate: '2020-01',
      endDate: null,
    },
    title: '자소서장인 멘토의 1대1 라이브 멘토링',
    categories: ['PERSONAL_STATEMENT'],
    durations: [60],
    minimumPrice: 60000,
    feedbackStartDate: '2026-07-14',
    feedbackEndDate: '2026-07-28',
    ...overrides,
  };
}

describe('MentorCard', () => {
  it('가격은 원화 포맷, 카테고리 라벨·진행시간·피드백 기간을 노출한다', () => {
    render(<MentorCard opening={makeOpening()} />);
    expect(screen.getByText('60,000원')).toBeInTheDocument();
    expect(screen.getByText('자기소개서')).toBeInTheDocument();
    expect(screen.getByText('60분')).toBeInTheDocument();
    expect(screen.getByText('07.14 ~ 07.28')).toBeInTheDocument();
  });

  it('타입·진행시간 다중이면 라벨을 합치고 최저가로 노출한다', () => {
    render(
      <MentorCard
        opening={makeOpening({
          categories: ['PERSONAL_STATEMENT', 'RESUME'],
          durations: [30, 60],
          minimumPrice: 35000,
        })}
      />,
    );
    expect(screen.getByText('자기소개서 · 이력서')).toBeInTheDocument();
    expect(screen.getByText('30분·60분')).toBeInTheDocument();
    expect(screen.getByText('최저 35,000원')).toBeInTheDocument();
  });

  it('대표 경력을 "회사 · 직무 · 기간"으로 노출하고 종료일이 없으면 재직중으로 표시한다', () => {
    render(<MentorCard opening={makeOpening()} />);
    expect(
      screen.getByText('네이버 · 서비스 기획 · 2020.01 ~ 재직중'),
    ).toBeInTheDocument();
  });

  it('대표 경력이 없으면(null) 경력 줄을 렌더하지 않는다', () => {
    render(
      <MentorCard opening={makeOpening({ representativeCareer: null })} />,
    );
    expect(screen.queryByText(/네이버/)).not.toBeInTheDocument();
    // 나머지 정보는 정상 노출
    expect(screen.getByText('자소서장인')).toBeInTheDocument();
    expect(screen.getByText('60,000원')).toBeInTheDocument();
  });

  it('프로필 이미지가 없으면 이미지 대신 "○○ 멘토님의 멘토링" 문구를 노출하고 닉네임은 유지한다', () => {
    render(<MentorCard opening={makeOpening({ mentorProfileImage: null })} />);
    expect(screen.queryByAltText('자소서장인')).not.toBeInTheDocument();
    expect(screen.getByText('자소서장인 멘토님의 멘토링')).toBeInTheDocument();
    // 본문 닉네임은 그대로 노출(익명화 아님)
    expect(screen.getByText('자소서장인')).toBeInTheDocument();
  });

  it('닉네임이 null이면 "멘토"로 대체한다', () => {
    render(
      <MentorCard
        opening={makeOpening({
          mentorNickname: null,
          mentorProfileImage: null,
        })}
      />,
    );
    expect(screen.getByText('멘토 멘토님의 멘토링')).toBeInTheDocument();
  });

  it('타이틀·소개가 null이면 해당 줄을 렌더하지 않는다', () => {
    render(
      <MentorCard
        opening={makeOpening({ title: null, mentorIntroduction: null })}
      />,
    );
    expect(
      screen.queryByText('자소서장인 멘토의 1대1 라이브 멘토링'),
    ).not.toBeInTheDocument();
    expect(screen.queryByText('두괄식 구조로 첨삭')).not.toBeInTheDocument();
  });

  it('멘토 상세 페이지로 링크된다', () => {
    render(<MentorCard opening={makeOpening({ mentorId: 42 })} />);
    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      '/live-mentoring/42',
    );
  });
});
