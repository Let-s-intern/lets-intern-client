import { render, screen } from '@testing-library/react';

import type { MyLiveMentoringApplication } from '@/api/live-mentoring/liveMentoringSchema';
import ApplySection from './ApplySection';
import CompleteSection from './CompleteSection';
import ParticipateSection from './ParticipateSection';

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

/*
  프로그램 카드는 `@letscareer/api` 를 끌어와 jest 가 `import.meta` 에서 멈춘다
  (.claude/troubleshooting 의 build-jest-import-meta-파싱-실패). 여기서는 멘토링 카드만
  보므로 프로그램 카드는 비워 둔다.
*/
jest.mock('../../ui/card/NewApplicationCard', () => ({
  __esModule: true,
  default: () => null,
}));

// 데스크톱 폭으로 고정한다. 한 구간에 3장까지 보이고 넘치면 `더보기` 가 뜬다.
jest.mock('@mui/material', () => ({
  __esModule: true,
  useMediaQuery: () => true,
}));

function makeMentoring(
  overrides: Partial<MyLiveMentoringApplication> = {},
): MyLiveMentoringApplication {
  return {
    applicationId: 10,
    paymentId: null,
    mentorName: '멘토',
    thumbnail: null,
    productName: 'QA 멘토링',
    durationMinutes: 30,
    reservationStartAt: '2026-09-20T10:00:00',
    reservationEndAt: '2026-09-20T10:30:00',
    status: 'CONFIRMED',
    questionWritten: false,
    questionEditable: false,
    entryLink: null,
    ...overrides,
  };
}

/*
  LC-3301 — 멘토링이 프로그램 세 구간 아래에 따로 붙지 않고, 같은 구간 안에 함께 보인다.
*/
describe('프로그램 탭 구간에 멘토링을 함께 담는다', () => {
  it('참여 예정 — 프로그램이 없어도 멘토링이 있으면 빈 안내 대신 카드를 보인다', () => {
    render(
      <ApplySection
        applicationList={[]}
        mentoringList={[makeMentoring({ productName: '예정 멘토링' })]}
        onMentoringQuestionClick={jest.fn()}
        hasInProgress={false}
        hasCompleted={false}
      />,
    );

    expect(screen.getAllByText('참여 예정')).toHaveLength(1);
    expect(screen.getByText('예정 멘토링')).toBeInTheDocument();
    expect(screen.getByText('참여예정')).toBeInTheDocument();
    expect(
      screen.queryByText('참여 예정인 프로그램이 없어요'),
    ).not.toBeInTheDocument();
  });

  it('참여 중 — 멘토링 카드를 참여중으로 보인다', () => {
    render(
      <ParticipateSection
        applicationList={[]}
        mentoringList={[makeMentoring({ productName: '진행 멘토링' })]}
        onMentoringQuestionClick={jest.fn()}
      />,
    );

    expect(screen.getByText('진행 멘토링')).toBeInTheDocument();
    expect(screen.getByText('참여중')).toBeInTheDocument();
    expect(
      screen.queryByText('참여 중인 프로그램이 아직 없어요.'),
    ).not.toBeInTheDocument();
  });

  it('참여 완료 — 멘토링 카드를 참여완료로 보인다', () => {
    render(
      <CompleteSection
        applicationList={[]}
        mentoringList={[makeMentoring({ productName: '끝난 멘토링' })]}
        onMentoringQuestionClick={jest.fn()}
      />,
    );

    expect(screen.getByText('끝난 멘토링')).toBeInTheDocument();
    expect(screen.getByText('참여완료')).toBeInTheDocument();
  });

  it('더보기 기준은 프로그램과 멘토링을 합친 건수다', () => {
    render(
      <ApplySection
        applicationList={[]}
        mentoringList={[1, 2, 3, 4].map((id) =>
          makeMentoring({ applicationId: id, productName: `멘토링 ${id}` }),
        )}
        onMentoringQuestionClick={jest.fn()}
        hasInProgress={false}
        hasCompleted={false}
      />,
    );

    expect(screen.getAllByText(/^멘토링 \d$/)).toHaveLength(3);
    expect(screen.getByText('더보기')).toBeInTheDocument();
  });

  it('비어 있으면 기존 빈 안내를 그대로 보인다', () => {
    render(
      <ApplySection
        applicationList={[]}
        mentoringList={[]}
        onMentoringQuestionClick={jest.fn()}
        hasInProgress={false}
        hasCompleted={false}
      />,
    );

    expect(
      screen.getByText('참여 예정인 프로그램이 없어요'),
    ).toBeInTheDocument();
  });
});
