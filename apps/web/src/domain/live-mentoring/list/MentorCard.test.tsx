import { render, screen } from '@testing-library/react';

import type { LiveMentorCard } from '@/api/live-mentoring/liveMentoringSchema';
import MentorCard from './MentorCard';

function makeCard(overrides: Partial<LiveMentorCard> = {}): LiveMentorCard {
  return {
    mentorId: 1,
    nickname: '자소서장인',
    profileImage: 'https://example.com/p.png',
    profileVisible: true,
    mosaicEnabled: false,
    mosaicBlur: 0,
    headline: '네이버 · 기획 7년',
    mentoringPoints: '두괄식 구조로 첨삭',
    categories: ['PERSONAL_STATEMENT'],
    durations: [50],
    price: 60000,
    rating: 4.9,
    reviewCount: 182,
    feedbackStartDate: '2026-07-14',
    feedbackEndDate: '2026-07-28',
    ...overrides,
  };
}

describe('MentorCard', () => {
  it('가격은 원화 포맷, 카테고리 라벨·진행시간·피드백 기간을 노출한다', () => {
    render(<MentorCard mentor={makeCard()} />);
    expect(screen.getByText('60,000원')).toBeInTheDocument();
    expect(screen.getByText('자기소개서')).toBeInTheDocument();
    expect(screen.getByText('50분')).toBeInTheDocument();
    expect(screen.getByText('★ 4.9')).toBeInTheDocument();
    expect(screen.getByText('07.14 ~ 07.28')).toBeInTheDocument();
  });

  it('타입·진행시간 다중이면 라벨을 합치고 최저가로 노출한다', () => {
    render(
      <MentorCard
        mentor={makeCard({
          categories: ['PERSONAL_STATEMENT', 'RESUME'],
          durations: [30, 50],
          price: 35000,
        })}
      />,
    );
    expect(screen.getByText('자기소개서 · 이력서')).toBeInTheDocument();
    expect(screen.getByText('30분·50분')).toBeInTheDocument();
    expect(screen.getByText('최저 35,000원')).toBeInTheDocument();
  });

  it('모자이크 on 이면 프로필 이미지에 blur 필터를 적용한다', () => {
    render(
      <MentorCard mentor={makeCard({ mosaicEnabled: true, mosaicBlur: 6 })} />,
    );
    const img = screen.getByAltText('자소서장인') as HTMLImageElement;
    expect(img.style.filter).toBe('blur(6px)');
  });

  it('프로필 비노출이면 이미지 대신 익명 타이틀을 노출한다', () => {
    render(<MentorCard mentor={makeCard({ profileVisible: false })} />);
    expect(screen.queryByAltText('자소서장인')).not.toBeInTheDocument();
    expect(
      screen.getAllByText('자소서장인의 1대1 라이브 멘토링').length,
    ).toBeGreaterThan(0);
  });

  it('상세 페이지로 링크된다', () => {
    render(<MentorCard mentor={makeCard({ mentorId: 42 })} />);
    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      '/live-mentoring/42',
    );
  });
});
