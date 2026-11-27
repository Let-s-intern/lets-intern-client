import type { UserAdminDetail, UserLiveMentoringSubmission } from '@/schema';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import MentoringSubmissionSection from '../MentoringSubmissionSection';
import PurchaseHistorySection from '../PurchaseHistorySection';

vi.mock('@/utils/axios', () => ({ default: {} }));
vi.mock('@/utils/axiosV2', () => ({ default: {} }));
vi.mock('@/api/adminRefund', () => ({
  useAdminRefundMutation: () => ({ mutate: vi.fn(), isPending: false }),
}));

const base: UserLiveMentoringSubmission = {
  applicationId: 1,
  productNameSnapshot: '자소서 첨삭',
  durationMinutesSnapshot: 60,
  mentoringCategory: 'PERSONAL_STATEMENT',
  contactEmail: 'contact@test.com',
  reservationStartAt: '2026-12-01T14:00:00',
  reservationEndAt: '2026-12-01T15:00:00',
  status: 'CONFIRMED',
};

describe('멘토링 제출 탭', () => {
  it('제출 내역이 없으면 빈 상태를 보인다', () => {
    render(<MentoringSubmissionSection list={undefined} />);
    expect(
      screen.getByText('1:1 멘토링 제출 내역이 없습니다.'),
    ).toBeInTheDocument();
  });

  it('신청 요약을 보인다', () => {
    render(<MentoringSubmissionSection list={[base]} />);

    expect(screen.getByText('자기소개서')).toBeInTheDocument();
    expect(screen.getByText('자소서 첨삭 · 60분')).toBeInTheDocument();
    expect(screen.getByText('contact@test.com')).toBeInTheDocument();
    expect(
      screen.getByText('2026-12-01 14:00 ~ 2026-12-01 15:00'),
    ).toBeInTheDocument();
    expect(screen.getByText('결제 완료')).toBeInTheDocument();
  });

  it('질문이 있으면 내용을, 미뤘으면 미룬 문구를 보인다', () => {
    render(
      <MentoringSubmissionSection
        list={[
          {
            ...base,
            applicationId: 1,
            questionContent: '지원 동기가 궁금해요',
          },
          { ...base, applicationId: 2, questionDeferred: true },
        ]}
      />,
    );

    expect(screen.getByText('지원 동기가 궁금해요')).toBeInTheDocument();
    expect(
      screen.getByText('멘티가 사전 질문을 나중에 보내겠다고 선택했습니다.'),
    ).toBeInTheDocument();
  });

  it('첨부 없음, 파일 여러 개, URL 을 각각 보이고 공유 비동의여도 첨부를 본다', () => {
    render(
      <MentoringSubmissionSection
        list={[
          {
            ...base,
            applicationId: 1,
            attachmentType: 'NONE',
            mentorShareAgreed: true,
          },
          {
            ...base,
            applicationId: 2,
            attachmentType: 'FILE',
            attachmentFileList: [
              { fileId: 1, fileName: '이력서.pdf', url: 'https://f/1' },
              { fileId: 2, fileName: '포트폴리오.pdf', url: 'https://f/2' },
            ],
            mentorShareAgreed: false,
          },
          {
            ...base,
            applicationId: 3,
            attachmentType: 'URL',
            attachmentUrl: 'https://notion.so/my',
            mentorShareAgreed: true,
          },
        ]}
      />,
    );

    expect(screen.getByText('첨부한 자료가 없습니다.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '이력서.pdf' })).toHaveAttribute(
      'href',
      'https://f/1',
    );
    expect(
      screen.getByRole('link', { name: '포트폴리오.pdf' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText('동의 안 함 (멘토에게 첨부가 보이지 않습니다)'),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'https://notion.so/my' }),
    ).toHaveAttribute('href', 'https://notion.so/my');
  });
});

describe('구매·참여 이력의 제출 내역 보기', () => {
  const data = {
    userInfo: { id: '7', name: '김유저', email: 'u@test.com', phoneNum: '010' },
    applicationInfo: [],
    applicationDetailInfo: [
      {
        applicationId: 1,
        programType: 'LIVE_MENTORING',
        programTitle: '자소서 첨삭 멘토링',
        programEndDate: '2999-01-01T00:00:00',
        finalPrice: 50000,
      },
      {
        applicationId: 2,
        programType: 'CHALLENGE',
        programTitle: '챌린지',
        programEndDate: '2999-01-01T00:00:00',
        finalPrice: 50000,
      },
    ],
    liveMentoringSubmissionList: [
      { ...base, questionContent: '이력서 방향이 궁금해요' },
    ],
  } as unknown as UserAdminDetail;

  const rowOf = (title: string) =>
    screen.getByRole('heading', { name: title }).closest('li') as HTMLElement;

  it('제출 내역이 있는 멘토링 행에만 버튼이 있고 누르면 내용이 열린다', () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <PurchaseHistorySection data={data} />
      </QueryClientProvider>,
    );

    expect(
      within(rowOf('챌린지')).queryByRole('button', { name: '제출 내역 보기' }),
    ).not.toBeInTheDocument();

    fireEvent.click(
      within(rowOf('자소서 첨삭 멘토링')).getByRole('button', {
        name: '제출 내역 보기',
      }),
    );

    const dialog = screen.getByRole('dialog');
    expect(
      within(dialog).getByText('이력서 방향이 궁금해요'),
    ).toBeInTheDocument();
    expect(within(dialog).getByText('contact@test.com')).toBeInTheDocument();
  });
});
