import { render } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { ChallengePeriod } from '../live-availability/utils/challengePeriod';

/**
 * 챌린지 기간 음영이 그리드를 쓰는 **세 화면 모두**에 붙는지 고정한다.
 *
 * 한 곳만 빠지면 같은 슬롯이 화면에 따라 다르게 보인다 — 멘토는 어느 쪽이 맞는지
 * 알 수 없다. 음영 렌더 자체는 `live-availability/__tests__` 에서 검증하므로,
 * 여기서는 prop 이 실제로 전달되는지만 본다.
 */
const gridProps: Array<Record<string, unknown>> = [];
vi.mock('@/pages/schedule/live-availability/LiveAvailabilityContent', () => ({
  default: (props: Record<string, unknown>) => {
    gridProps.push(props);
    return null;
  },
}));

const ACTIVE: ChallengePeriod[] = [
  {
    challengeId: 1,
    title: '자소서 챌린지',
    startDate: '2026-09-01T00:00:00',
    endDate: '2026-09-21T23:59:59',
  },
];

vi.mock('@/pages/schedule/hooks/useChallengePeriods', () => ({
  useChallengePeriods: () => ACTIVE,
}));

vi.mock('@/pages/schedule/hooks/useLiveFeedbackData', () => ({
  useLiveFeedbackData: () => ({ bars: [], slotOpenWindow: null }),
}));

vi.mock('@/api/feedback/feedback', () => ({
  useFeedbackMentorSlotsQuery: () => ({
    data: { feedbackSlotList: [] },
    isPending: false,
    isError: false,
    refetch: vi.fn(),
  }),
  useCreateFeedbackMentorSlotsMutation: () => ({
    mutateAsync: vi.fn(),
    isPending: false,
  }),
  useDeleteFeedbackMentorSlotsMutation: () => ({
    mutateAsync: vi.fn(),
    isPending: false,
  }),
}));

vi.mock('react-router-dom', async () => {
  const actual =
    await vi.importActual<typeof import('react-router-dom')>(
      'react-router-dom',
    );
  return { ...actual, useNavigate: () => vi.fn() };
});

import FeedbackAvailabilityModal from '@/pages/feedback-live-availability/FeedbackAvailabilityModal';
import FeedbackLiveAvailabilityPage from '@/pages/feedback-live-availability/FeedbackLiveAvailabilityPage';
import LiveMentoringSlotModal from '@/pages/live-mentoring/open-settings/ui/LiveMentoringSlotModal';

beforeEach(() => {
  gridProps.length = 0;
});

describe('챌린지 기간 음영 — 그리드를 쓰는 화면 전부에 전달된다', () => {
  it('라이브 피드백 일정 페이지', () => {
    render(<FeedbackLiveAvailabilityPage />);
    expect(gridProps.at(-1)?.challengePeriods).toEqual(ACTIVE);
  });

  it('라이브 피드백 일정 모달', () => {
    render(<FeedbackAvailabilityModal isOpen onClose={vi.fn()} />);
    expect(gridProps.at(-1)?.challengePeriods).toEqual(ACTIVE);
  });

  it('1대1 오픈 설정의 일정 모달', () => {
    render(<LiveMentoringSlotModal isOpen onClose={vi.fn()} />);
    expect(gridProps.at(-1)?.challengePeriods).toEqual(ACTIVE);
  });
});
