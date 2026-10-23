import { render, screen } from '@testing-library/react';

import type { LiveMentoringOpening } from '@/api/live-mentoring/liveMentoringSchema';
import MentorLiveMentoringItem from './MentorLiveMentoringItem';

function makeOpening(
  overrides: Partial<LiveMentoringOpening> = {},
): LiveMentoringOpening {
  return {
    liveMentoringId: 100,
    openingId: 500,
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
      endDate: '2025-01',
    },
    title: '비전공자에서 PM인턴까지 직무 전환 전략',
    categories: ['PERSONAL_STATEMENT', 'RESUME'],
    durations: [30, 60],
    minimumPrice: 39000,
    ...overrides,
  };
}

describe('MentorLiveMentoringItem', () => {
  it('목록 카드와 같은 직무 배지·진행시간·가격·타입 태그를 노출한다', () => {
    render(<MentorLiveMentoringItem opening={makeOpening()} />);

    expect(screen.getByText('네이버 · 서비스 기획')).toBeInTheDocument();
    expect(screen.getByText('30분 / 60분')).toBeInTheDocument();
    expect(screen.getByText('39,000원~')).toBeInTheDocument();
    expect(screen.getByText('자기소개서')).toBeInTheDocument();
    expect(screen.getByText('이력서')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
      '비전공자에서 PM인턴까지 직무 전환 전략',
    );
  });

  it('진행시간이 하나면 가격에 ~ 를 붙이지 않는다', () => {
    render(
      <MentorLiveMentoringItem
        opening={makeOpening({ durations: [60], minimumPrice: 69000 })}
      />,
    );

    expect(screen.getByText('60분')).toBeInTheDocument();
    expect(screen.getByText('69,000원')).toBeInTheDocument();
  });

  it('멘토의 1:1 멘토링 상세로 연결한다', () => {
    render(<MentorLiveMentoringItem opening={makeOpening()} />);

    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      '/live-mentoring/1',
    );
  });

  it('제목이 없으면 닉네임으로 제목을 만든다', () => {
    render(<MentorLiveMentoringItem opening={makeOpening({ title: null })} />);

    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
      '자소서장인의 1:1 멘토링',
    );
  });

  it('프로필 이미지가 없으면 이미지 대신 대체 제목을 그린다', () => {
    render(
      <MentorLiveMentoringItem
        opening={makeOpening({ mentorProfileImage: null, title: null })}
      />,
    );

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.getByText('자소서장인 멘토님의 멘토링')).toBeInTheDocument();
  });
});
