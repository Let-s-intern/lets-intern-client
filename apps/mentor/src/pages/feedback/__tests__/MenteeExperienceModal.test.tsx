/**
 * Component tests for MenteeExperienceModal.
 *
 * Verifies loading / error / empty / list rendering states. The underlying
 * data query is mocked so we control each state explicitly.
 */

import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';

const useMenteeExperiencesQueryMock = vi.fn();

vi.mock('../hooks/useMenteeExperiencesQuery', () => ({
  useMenteeExperiencesQuery: () => useMenteeExperiencesQueryMock(),
}));

// BaseModal renders into a portal w/ scroll control hooks; stub to plain div.
vi.mock('@/common/modal/BaseModal', () => ({
  default: ({
    isOpen,
    children,
  }: {
    isOpen: boolean;
    children: React.ReactNode;
  }) => (isOpen ? <div>{children}</div> : null),
}));

import MenteeExperienceModal from '../ui/MenteeExperienceModal';

beforeEach(() => {
  useMenteeExperiencesQueryMock.mockReset();
});

const baseProps = {
  isOpen: true,
  onClose: () => {},
  missionId: 1,
  userId: 2,
  menteeName: '홍길동',
};

describe('MenteeExperienceModal', () => {
  it('로딩 상태를 표시한다', () => {
    useMenteeExperiencesQueryMock.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      refetch: vi.fn(),
    });

    render(<MenteeExperienceModal {...baseProps} />);

    expect(screen.getByText(/불러오는 중/)).toBeInTheDocument();
  });

  it('에러 상태를 명시적으로 표시한다 (조용한 실패 금지)', () => {
    useMenteeExperiencesQueryMock.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      refetch: vi.fn(),
    });

    render(<MenteeExperienceModal {...baseProps} />);

    expect(screen.getByText(/불러오지 못했습니다/)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: '다시 시도' }),
    ).toBeInTheDocument();
  });

  it('빈 배열일 때 안내 문구를 표시한다', () => {
    useMenteeExperiencesQueryMock.mockReturnValue({
      data: { userExperiences: [] },
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    });

    render(<MenteeExperienceModal {...baseProps} />);

    expect(screen.getByText(/제출된 경험이 없습니다/)).toBeInTheDocument();
  });

  it('경험 목록을 렌더한다', () => {
    useMenteeExperiencesQueryMock.mockReturnValue({
      data: {
        userExperiences: [
          {
            id: 11,
            title: '동아리 프로젝트',
            experienceCategory: 'CLUB',
            activityType: 'TEAM',
            organ: 'OO대학교',
            role: '리더',
            situation: '상황 설명',
            task: '문제 설명',
            action: '행동 설명',
            result: '결과 설명',
            reflection: '느낀 점',
            coreCompetency: '협업',
            startDate: '2024-01-01',
            endDate: '2024-06-01',
          },
        ],
      },
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    });

    render(<MenteeExperienceModal {...baseProps} />);

    expect(screen.getByText('동아리 프로젝트')).toBeInTheDocument();
    expect(screen.getByText('동아리')).toBeInTheDocument(); // CLUB -> KR
    expect(screen.getByText('팀')).toBeInTheDocument(); // TEAM -> KR
    expect(screen.getByText('상황 설명')).toBeInTheDocument();
    expect(screen.getByText('결과 설명')).toBeInTheDocument();
  });
});
