import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import { challengeListSchema } from '@/schema';

// 같은 챌린지(7)의 버전 행 2개와 버전 없는 챌린지(8)
const challengeList = challengeListSchema.parse({
  programList: [
    {
      id: 7,
      challengeVersionId: 70,
      title: '대학생 챌린지',
      challengeTitle: '취업 챌린지',
      createDate: '2026-10-01T00:00:00',
    },
    {
      id: 7,
      challengeVersionId: 71,
      title: '직장인 챌린지',
      challengeTitle: '취업 챌린지',
      createDate: '2026-10-01T00:00:00',
    },
    {
      id: 8,
      challengeVersionId: null,
      title: '버전 없는 챌린지',
      createDate: '2026-10-01T00:00:00',
    },
  ],
  pageInfo: { pageNum: 0, pageSize: 1000, totalElements: 3, totalPages: 1 },
});

vi.mock('@/api/challenge/challenge', () => ({
  useGetChallengeList: () => ({ data: challengeList }),
  getClickCopy: vi.fn(),
  usePostTestParticipation: () => ({ mutate: vi.fn(), isPending: false }),
}));
vi.mock('@/api/user/user', () => ({
  useIsAdminQuery: () => ({ data: true }),
}));
vi.mock('@/context/CurrentAdminChallengeProvider', () => ({
  // 시작 전 챌린지라 대시보드 복제 버튼이 열린다
  useAdminCurrentChallenge: () => ({
    currentChallenge: { title: '현재 챌린지', startDate: '2099-01-01' },
  }),
}));
vi.mock('@/hooks/useMentorAccessControl', () => ({ default: () => false }));

import ChallengeAdminLayout from './ChallengeOperationAdminLayout';

const renderLayout = () =>
  render(
    <MemoryRouter>
      <ChallengeAdminLayout>
        <div />
      </ChallengeAdminLayout>
    </MemoryRouter>,
  );

describe('ChallengeOperationAdminLayout 버전 행 중복 제거', () => {
  it('챌린지 선택 옵션에 같은 챌린지가 한 번만 나온다', () => {
    renderLayout();

    const options = within(screen.getByRole('combobox')).getAllByRole('option');
    expect(options.map((option) => option.getAttribute('value'))).toEqual([
      '',
      '7',
      '8',
    ]);
  });

  it('챌린지 선택 옵션은 버전 제목 대신 챌린지 제목을, 없으면 title 을 보인다', () => {
    renderLayout();

    const options = within(screen.getByRole('combobox')).getAllByRole('option');
    expect(options.map((option) => option.textContent)).toEqual([
      '챌린지 변경',
      '취업 챌린지',
      '버전 없는 챌린지',
    ]);
  });

  it('대시보드 복제 모달 목록에 같은 챌린지가 한 번만 나온다', () => {
    renderLayout();

    fireEvent.click(screen.getByRole('button', { name: '대시보드 복제' }));

    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getAllByRole('listitem')).toHaveLength(2);
    expect(within(dialog).getByText('[7] 취업 챌린지')).toBeInTheDocument();
    expect(
      within(dialog).getByText('[8] 버전 없는 챌린지'),
    ).toBeInTheDocument();
  });
});
