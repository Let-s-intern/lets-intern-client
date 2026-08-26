import { fireEvent, render, screen } from '@testing-library/react';

import { useMyLiveMentoringApplicationsQuery } from '@/api/live-mentoring/liveMentoring';
import type { MyLiveMentoringApplication } from '@/api/live-mentoring/liveMentoringSchema';
import MentoringSection, { resolvePhase } from './MentoringSection';
import {
  APPLICATION_CATEGORY_OPTIONS,
  type ApplicationCategory,
} from '../constants';

jest.mock('@/api/live-mentoring/liveMentoring', () => ({
  __esModule: true,
  useMyLiveMentoringApplicationsQuery: jest.fn(),
  useLiveMentoringQuestionQuery: () => ({ data: undefined, isLoading: true }),
  useUpdateLiveMentoringQuestionMutation: () => ({
    mutate: jest.fn(),
    isPending: false,
  }),
}));

jest.mock('@/api/file', () => ({
  __esModule: true,
  uploadFileForId: jest.fn(),
}));

const useApplicationsMock = useMyLiveMentoringApplicationsQuery as jest.Mock;

function makeApplication(
  overrides: Partial<MyLiveMentoringApplication> = {},
): MyLiveMentoringApplication {
  return {
    applicationId: 10,
    paymentId: null,
    mentorName: '어드어드민닉네임',
    thumbnail: 'https://example.test/t.png',
    productName: '어드민 1대1 라이브 멘토링',
    durationMinutes: 60,
    reservationStartAt: '2026-09-13T10:00:00',
    reservationEndAt: '2026-09-13T11:00:00',
    status: 'CONFIRMED',
    questionWritten: true,
    questionEditable: true,
    entryLink: null,
    ...overrides,
  };
}

function mockApplications(list: MyLiveMentoringApplication[]) {
  useApplicationsMock.mockReturnValue({
    data: { applicationList: list },
    isLoading: false,
  });
}

beforeEach(() => useApplicationsMock.mockReset());

/*
  서버는 신청 상태만 주고 참여 단계는 주지 않는다. 시각 비교는 타임존 없는
  LocalDateTime 문자열끼리 한다 — Date 로 파싱하면 브라우저 타임존이 끼어든다.
*/
describe('resolvePhase', () => {
  const application = makeApplication();

  it('예약 시작 전이면 참여 예정이다', () => {
    expect(resolvePhase(application, new Date(2026, 8, 13, 9, 59, 0))).toBe(
      'upcoming',
    );
  });

  it('예약 구간 안이면 참여 중이다', () => {
    expect(resolvePhase(application, new Date(2026, 8, 13, 10, 30, 0))).toBe(
      'ongoing',
    );
  });

  it('예약 종료 뒤면 참여 종료다', () => {
    expect(resolvePhase(application, new Date(2026, 8, 13, 11, 0, 1))).toBe(
      'ended',
    );
  });

  /* 경계 — 시작 정각은 참여 중, 종료 정각은 종료다. */
  it('시작 정각은 참여 중, 종료 정각은 종료로 본다', () => {
    expect(resolvePhase(application, new Date(2026, 8, 13, 10, 0, 0))).toBe(
      'ongoing',
    );
    expect(resolvePhase(application, new Date(2026, 8, 13, 11, 0, 0))).toBe(
      'ended',
    );
  });
});

describe('MentoringSection 구간 분류', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2026, 8, 13, 10, 30, 0));
  });
  afterEach(() => jest.useRealTimers());

  it('예약 시각에 따라 세 구간에 나눠 담는다', () => {
    mockApplications([
      makeApplication({
        applicationId: 1,
        reservationStartAt: '2026-09-20T10:00:00',
        reservationEndAt: '2026-09-20T11:00:00',
      }),
      makeApplication({ applicationId: 2 }),
      makeApplication({
        applicationId: 3,
        reservationStartAt: '2026-09-01T10:00:00',
        reservationEndAt: '2026-09-01T11:00:00',
      }),
    ]);
    render(<MentoringSection />);

    expect(screen.getByText('참여 예정')).toBeInTheDocument();
    expect(screen.getByText('참여 중')).toBeInTheDocument();
    expect(screen.getByText('참여 종료')).toBeInTheDocument();
  });

  /*
    시안에는 세 제목이 다 있지만 실제로는 대부분 "참여 예정" 하나만 찬다.
    빈 제목 두 개가 남으면 뭔가 사라진 것처럼 보인다.
  */
  it('비어 있는 구간은 제목까지 감춘다', () => {
    mockApplications([
      makeApplication({
        reservationStartAt: '2026-09-20T10:00:00',
        reservationEndAt: '2026-09-20T11:00:00',
      }),
    ]);
    render(<MentoringSection />);

    expect(screen.getByText('참여 예정')).toBeInTheDocument();
    expect(screen.queryByText('참여 중')).not.toBeInTheDocument();
    expect(screen.queryByText('참여 종료')).not.toBeInTheDocument();
  });

  it('신청이 없으면 빈 상태를 보여준다', () => {
    mockApplications([]);
    render(<MentoringSection />);

    expect(
      screen.getByText('아직 신청한 1:1 멘토링이 없어요'),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: '1:1 멘토링 둘러보기' }),
    ).toHaveAttribute('href', '/live-mentoring');
  });

  it('질문 버튼을 누르면 모달이 열린다', () => {
    mockApplications([
      makeApplication({
        reservationStartAt: '2026-09-20T10:00:00',
        reservationEndAt: '2026-09-20T11:00:00',
      }),
    ]);
    render(<MentoringSection />);

    fireEvent.click(screen.getByRole('button', { name: '멘토링 질문 수정' }));

    expect(
      screen.getByRole('dialog', {
        name: '멘토에게 궁금한 점을 작성해 주세요.',
      }),
    ).toBeInTheDocument();
  });
});

/*
  ApplicationCategory 는 커리어 성장 위젯도 함께 쓴다. 탭 순서는 시안 3-0 이고,
  기존 탭을 지우면 그쪽이 회귀한다.
*/
describe('신청현황 탭 구성', () => {
  it('멘토링 탭은 없다 — 프로그램 탭에서 함께 보여준다', () => {
    const values = APPLICATION_CATEGORY_OPTIONS.map((option) => option.value);
    expect(values.slice(0, 3)).toEqual([
      'PROGRAM',
      'LIBRARY',
      'GUIDEBOOK',
    ] satisfies ApplicationCategory[]);
    expect(values).not.toContain('MENTORING');
  });

  it('기존 탭을 지우지 않는다', () => {
    const values = APPLICATION_CATEGORY_OPTIONS.map((option) => option.value);
    expect(values).toContain('VOD');
    expect(values).toContain('LAUNCH_ALERT');
  });
});
