import { render, screen } from '@testing-library/react';
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
}));
vi.mock('@/api/challenge-mentor-guide/challengeMentorGuide', () => ({
  AdminChallengeMentorGuideQueryKey: 'adminChallengeMentorGuide',
  useAdminChallengeMentorGuideAllQuery: () => ({
    data: { challengeMentorGuideList: [] },
    isLoading: false,
  }),
  usePostAdminChallengeMentorGuide: () => ({ mutateAsync: vi.fn() }),
  usePatchAdminChallengeMentorGuide: () => ({ mutateAsync: vi.fn() }),
  useDeleteAdminChallengeMentorGuide: () => ({ mutateAsync: vi.fn() }),
}));
vi.mock('@/api/mentor/mentor', () => ({
  useAdminChallengeMentorListQuery: () => ({ data: { mentorList: [] } }),
}));
vi.mock('@tanstack/react-query', () => ({
  useQueryClient: () => ({ invalidateQueries: vi.fn() }),
}));
vi.mock('@mui/x-data-grid', () => ({ DataGrid: () => null }));
// 모달에 넘어가는 챌린지 목록만 본다
vi.mock('./mentor-notice/modals/NoticeFormModal', () => ({
  NoticeFormModal: ({
    challengeList,
  }: {
    challengeList: Array<{ id: number; title?: string | null }>;
  }) => (
    <ul>
      {challengeList.map((p) => (
        <li key={p.id}>{`[${p.id}] ${p.title}`}</li>
      ))}
    </ul>
  ),
}));

import MentorNoticeManagement from './MentorNoticeManagement';

describe('MentorNoticeManagement 챌린지 선택 제목', () => {
  it('챌린지는 한 번만, 버전 제목 대신 챌린지 제목으로, 없으면 title 로 보인다', () => {
    render(<MentorNoticeManagement />);

    expect(
      screen.getAllByRole('listitem').map((item) => item.textContent),
    ).toEqual(['[7] 취업 챌린지', '[8] 버전 없는 챌린지']);
  });
});
