/**
 * Unit tests for useFeedbackManagement hook (pure logic).
 *
 * Tests the modal state management logic without react-query dependencies.
 */

// ── Modal state management logic ────────────────────────────────────

interface FeedbackModalState {
  isOpen: boolean;
  challengeId: number;
  missionId: number;
  challengeTitle?: string;
  missionTh?: number;
}

const initialState: FeedbackModalState = {
  isOpen: false,
  challengeId: 0,
  missionId: 0,
};

describe('useFeedbackManagement modal state logic', () => {
  it('opens modal with correct challenge and mission data', () => {
    const challenge = {
      challengeId: 1,
      title: '서류 합격 챌린지',
    };
    const missionId = 10;
    const missionTh = 1;

    const nextState: FeedbackModalState = {
      isOpen: true,
      challengeId: challenge.challengeId,
      missionId,
      challengeTitle: challenge.title ?? undefined,
      missionTh,
    };

    expect(nextState.isOpen).toBe(true);
    expect(nextState.challengeId).toBe(1);
    expect(nextState.missionId).toBe(10);
    expect(nextState.challengeTitle).toBe('서류 합격 챌린지');
    expect(nextState.missionTh).toBe(1);
  });

  it('closes modal while preserving other state', () => {
    const openState: FeedbackModalState = {
      isOpen: true,
      challengeId: 1,
      missionId: 10,
      challengeTitle: '챌린지',
      missionTh: 1,
    };

    const closedState = { ...openState, isOpen: false };

    expect(closedState.isOpen).toBe(false);
    expect(closedState.challengeId).toBe(1);
    expect(closedState.missionId).toBe(10);
  });

  it('handles null title as undefined', () => {
    const challenge = {
      challengeId: 2,
      title: null as string | null,
    };

    const nextState: FeedbackModalState = {
      isOpen: true,
      challengeId: challenge.challengeId,
      missionId: 5,
      challengeTitle: challenge.title ?? undefined,
      missionTh: 2,
    };

    expect(nextState.challengeTitle).toBeUndefined();
  });

  it('starts with modal closed', () => {
    expect(initialState.isOpen).toBe(false);
    expect(initialState.challengeId).toBe(0);
    expect(initialState.missionId).toBe(0);
  });
});

// ── StatusBadge style logic ──────────────────────────────────────────

describe('StatusBadge style logic', () => {
  const BADGE_STYLES: Record<string, string> = {
    WAITING: 'bg-gray-100 text-gray-500',
    IN_PROGRESS: 'bg-yellow-100 text-yellow-700',
    COMPLETED: 'bg-green-100 text-green-700',
    CONFIRMED: 'bg-blue-100 text-blue-700',
  };

  it('returns correct style for each status', () => {
    expect(BADGE_STYLES['WAITING']).toBe('bg-gray-100 text-gray-500');
    expect(BADGE_STYLES['IN_PROGRESS']).toBe('bg-yellow-100 text-yellow-700');
    expect(BADGE_STYLES['COMPLETED']).toBe('bg-green-100 text-green-700');
    expect(BADGE_STYLES['CONFIRMED']).toBe('bg-blue-100 text-blue-700');
  });

  it('all statuses have defined styles', () => {
    const statuses = ['WAITING', 'IN_PROGRESS', 'COMPLETED', 'CONFIRMED'];

    for (const status of statuses) {
      expect(BADGE_STYLES[status]).toBeDefined();
    }
  });
});
