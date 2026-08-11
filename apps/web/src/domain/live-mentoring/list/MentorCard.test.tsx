import { render, screen } from '@testing-library/react';

import type { LiveMentoringOpening } from '@/api/live-mentoring/liveMentoringSchema';
import MentorCard from './MentorCard';

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
    title: '비전공자에서 PM인턴 - 신입 공채까지 직무 전환 전략은?',
    categories: ['PERSONAL_STATEMENT'],
    durations: [60],
    minimumPrice: 60000,
    feedbackStartDate: '2026-07-14',
    feedbackEndDate: '2026-07-28',
    ...overrides,
  };
}

describe('MentorCard', () => {
  it('멘토링 제목·진행시간·가격·진행기간·타입 태그를 노출한다', () => {
    render(<MentorCard opening={makeOpening()} />);
    expect(
      screen.getByText('비전공자에서 PM인턴 - 신입 공채까지 직무 전환 전략은?'),
    ).toBeInTheDocument();
    expect(screen.getByText('60분')).toBeInTheDocument();
    expect(screen.getByText('60,000원')).toBeInTheDocument();
    expect(screen.getByText('26.07.14 ~ 26.07.28')).toBeInTheDocument();
    expect(screen.getByText('자기소개서')).toBeInTheDocument();
  });

  it('진행시간이 여럿이면 "/"로 잇고 가격에 최저가 물결을 붙인다', () => {
    render(
      <MentorCard
        opening={makeOpening({
          categories: ['PERSONAL_STATEMENT', 'RESUME'],
          durations: [30, 60],
          minimumPrice: 30000,
        })}
      />,
    );
    expect(screen.getByText('30분 / 60분')).toBeInTheDocument();
    expect(screen.getByText('30,000원~')).toBeInTheDocument();
    // 타입 태그는 카테고리마다 하나씩
    expect(screen.getByText('자기소개서')).toBeInTheDocument();
    expect(screen.getByText('이력서')).toBeInTheDocument();
  });

  it('대표 경력의 회사명 · 직무를 배지로 노출한다(연차는 표기하지 않는다)', () => {
    render(<MentorCard opening={makeOpening()} />);
    expect(screen.getByText('네이버 · 서비스 기획')).toBeInTheDocument();
    expect(screen.queryByText(/년\+/)).not.toBeInTheDocument();
  });

  it('직무가 없으면 직책으로 대체한다', () => {
    render(
      <MentorCard
        opening={makeOpening({
          representativeCareer: {
            id: 7,
            company: '네이버',
            field: 'IT',
            job: null,
            position: '리드',
            department: '기획팀',
            startDate: '2020-01',
            endDate: null,
          },
        })}
      />,
    );
    expect(screen.getByText('네이버 · 리드')).toBeInTheDocument();
  });

  it('대표 경력이 없으면(null) 배지를 렌더하지 않는다', () => {
    render(
      <MentorCard opening={makeOpening({ representativeCareer: null })} />,
    );
    expect(screen.queryByText(/서비스 기획/)).not.toBeInTheDocument();
    // 나머지 정보는 정상 노출
    expect(screen.getByText('60,000원')).toBeInTheDocument();
  });

  it('프로필 이미지가 있으면 흰 배경 위에 이미지만 두고 제목 텍스트를 겹치지 않는다', () => {
    const { container } = render(<MentorCard opening={makeOpening()} />);
    expect(screen.getByAltText('자소서장인').parentElement).toHaveClass(
      'bg-white',
    );
    expect(container.querySelector('.bg-primary')).toBeNull();
    // 제목은 썸네일이 아니라 카드 하단 한 곳에만 노출
    expect(
      screen.getAllByText(
        '비전공자에서 PM인턴 - 신입 공채까지 직무 전환 전략은?',
      ),
    ).toHaveLength(1);
  });

  it('프로필 이미지가 없으면 브랜드 컬러 배경에 제목 텍스트를 노출한다', () => {
    const { container } = render(
      <MentorCard opening={makeOpening({ mentorProfileImage: null })} />,
    );
    expect(screen.queryByAltText('자소서장인')).not.toBeInTheDocument();
    expect(container.querySelector('.bg-primary')).not.toBeNull();
    expect(
      screen.getAllByText(
        '비전공자에서 PM인턴 - 신입 공채까지 직무 전환 전략은?',
      ),
    ).toHaveLength(2);
  });

  it('타이틀이 null이면 닉네임 기반 문구로 대체한다', () => {
    render(<MentorCard opening={makeOpening({ title: null })} />);
    expect(screen.getByText('자소서장인의 1:1 멘토링')).toBeInTheDocument();
  });

  it('타이틀·이미지가 모두 null이면 썸네일은 멘토링 안내 문구로 대체한다', () => {
    render(
      <MentorCard
        opening={makeOpening({ title: null, mentorProfileImage: null })}
      />,
    );
    expect(screen.getByText('자소서장인 멘토님의 멘토링')).toBeInTheDocument();
    expect(screen.getByText('자소서장인의 1:1 멘토링')).toBeInTheDocument();
  });

  it('닉네임이 null이면 "멘토"로 대체한다', () => {
    render(
      <MentorCard
        opening={makeOpening({ mentorNickname: null, title: null })}
      />,
    );
    expect(screen.getByText('멘토의 1:1 멘토링')).toBeInTheDocument();
  });

  it('멘토 상세 페이지로 링크된다', () => {
    render(<MentorCard opening={makeOpening({ mentorId: 42 })} />);
    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      '/live-mentoring/42',
    );
  });
});
