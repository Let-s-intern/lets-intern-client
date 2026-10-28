import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

const get = vi.fn();

vi.mock('@/utils/axios', () => ({
  default: { get: (...args: unknown[]) => get(...args) },
}));

import MentorApplicationDialog from '../MentorApplicationDialog';

const detail = {
  id: 7,
  submittedAt: '2026-10-28T14:02:00',
  name: '김하늘',
  company: '예시테크',
  jobTitle: '프로덕트 매니저',
  phoneNum: '01012345678',
  email: 'haneul.kim@example.com',
  preferredContactMethods: ['EMAIL'],
  status: 'REVIEWING',
  hasAttachment: true,
  yearsOfExperience: 7,
  jobFields: ['SERVICE_PLANNING_PM', 'DATA_AI'],
  mentoringTypes: ['DOCUMENT_REVIEW', 'JOB_QNA'],
  introduction: 'B2C 서비스 PM 7년',
  motivation: '경험을 나누고 싶습니다',
  snsLinks: ['https://example.com/portfolio'],
  attachmentUrl: 'https://cdn.example.com/resume.pdf',
  attachmentName: 'resume.pdf',
  privacyAgreedAt: '2026-10-28T14:02:00',
  userId: null,
  expectedReplyDate: '2026-11-04',
  adminMemo: null,
};

const renderDialog = (response: object) => {
  get.mockResolvedValue({ data: { data: response } });
  return render(
    <QueryClientProvider
      client={
        new QueryClient({ defaultOptions: { queries: { retry: false } } })
      }
    >
      <MentorApplicationDialog applicationId={7} onClose={vi.fn()} />
    </QueryClientProvider>,
  );
};

afterEach(() => vi.clearAllMocks());

describe('MentorApplicationDialog', () => {
  it('신청서 상세를 불러와 전체 항목을 보여준다', async () => {
    renderDialog(detail);

    expect(await screen.findByText('김하늘님 신청서')).toBeInTheDocument();
    expect(get).toHaveBeenCalledWith('/admin/mentor-application/7');
    expect(
      screen.getByText('예시테크 · 프로덕트 매니저 · 7년차'),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        '010-1234-5678 · haneul.kim@example.com · 2026.10.28 14:02 신청',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText('신청 현황 검토 중 · 예상 회신일 2026.11.04'),
    ).toBeInTheDocument();
    expect(screen.getByText('이메일')).toBeInTheDocument();
    expect(screen.getByText('서비스기획·PM')).toBeInTheDocument();
    expect(screen.getByText('데이터·AI')).toBeInTheDocument();
    expect(screen.getByText('서류 첨삭')).toBeInTheDocument();
    expect(screen.getByText('직무 Q&A')).toBeInTheDocument();
    expect(screen.getByText('B2C 서비스 PM 7년')).toBeInTheDocument();
    expect(screen.getByText('경험을 나누고 싶습니다')).toBeInTheDocument();
    expect(screen.getByText('비회원 신청')).toBeInTheDocument();

    const pdf = screen.getByRole('link', { name: 'resume.pdf PDF 열기' });
    expect(pdf).toHaveAttribute('href', 'https://cdn.example.com/resume.pdf');
    expect(pdf).toHaveAttribute('target', '_blank');
    expect(
      screen.getByRole('link', { name: 'https://example.com/portfolio' }),
    ).toHaveAttribute('target', '_blank');
  });

  it('첨부가 없으면 링크 대신 첨부 없음을 보여준다', async () => {
    renderDialog({
      ...detail,
      hasAttachment: false,
      attachmentUrl: null,
      attachmentName: null,
      snsLinks: [],
    });

    expect(await screen.findByText('첨부 없음')).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });
});
