import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { OneTimeFormQuestionType } from '@/api/one-time-form/oneTimeFormSchema';
import { AdminSnackbarProvider } from '@/hooks/useAdminSnackbar';

import AnswerValue from './AnswerValue';

const fileUrlQuery = vi.fn();
const getFileUrl = vi.fn();
const openAttachment = vi.fn();

vi.mock('@/api/one-time-form/oneTimeFormQueries', () => ({
  useOneTimeFormFileUrlQuery: (applicationId: number, questionId: number) =>
    fileUrlQuery(applicationId, questionId),
}));

vi.mock('@/api/one-time-form/oneTimeForm', () => ({
  getOneTimeFormFileUrl: (applicationId: number, questionId: number) =>
    getFileUrl(applicationId, questionId),
}));

vi.mock('../utils/openAttachment', () => ({
  openAttachment: (url: string) => openAttachment(url),
}));

const IMAGE_URL = 'data:image/svg+xml;charset=utf-8,mock';
const FILE_URL = 'https://bucket.example.com/a.pdf?X-Amz-Signature=x';

const renderAnswer = (
  type: OneTimeFormQuestionType,
  value: unknown,
  questionId = 101,
) =>
  render(
    <AdminSnackbarProvider>
      <AnswerValue
        applicationId={1043}
        question={{ questionId, type }}
        value={value}
      />
    </AdminSnackbarProvider>,
  );

beforeEach(() => {
  fileUrlQuery.mockReset();
  fileUrlQuery.mockReturnValue({ data: { url: IMAGE_URL }, isError: false });
  getFileUrl.mockReset();
  getFileUrl.mockResolvedValue({ url: FILE_URL });
  openAttachment.mockReset();
});

describe('AnswerValue', () => {
  it('체크박스는 고른 값을 쉼표로 이어 보여준다', () => {
    renderAnswer('CHECKBOX', ['월', '수']);

    expect(screen.getByText('월, 수')).toBeInTheDocument();
  });

  it('날짜는 YYYY-MM-DD, 숫자는 숫자로 보여준다', () => {
    const { unmount } = renderAnswer('DATE', '2027-02-20');
    expect(screen.getByText('2027-02-20')).toBeInTheDocument();
    unmount();

    renderAnswer('NUMBER', 18);
    expect(screen.getByText('18')).toBeInTheDocument();
  });

  it('URL 은 새 창으로 여는 외부 링크다', () => {
    renderAnswer('URL', 'https://portfolio.example.com/kim');

    const link = screen.getByRole('link', {
      name: 'https://portfolio.example.com/kim',
    });
    expect(link).toHaveAttribute('href', 'https://portfolio.example.com/kim');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('장문은 줄바꿈을 살린다', () => {
    renderAnswer('LONG_TEXT', '첫 줄\n둘째 줄');

    expect(screen.getByText(/첫 줄/)).toHaveClass('whitespace-pre-wrap');
  });

  it('미응답은 - 로 보여준다', () => {
    renderAnswer('SHORT_TEXT', undefined);

    expect(screen.getByText('-')).toBeInTheDocument();
  });

  it('형식과 다른 모양의 값도 문자열로 보여준다', () => {
    renderAnswer('IMAGE', '프로필.png');

    expect(screen.getByText('프로필.png')).toBeInTheDocument();
    expect(fileUrlQuery).not.toHaveBeenCalled();
  });

  it('이미지는 신청·질문 ID 로 받은 URL 로 미리보기를 그리고 파일명을 붙인다', () => {
    renderAnswer('IMAGE', { key: 'k.png', name: '프로필.png' }, 109);

    expect(fileUrlQuery).toHaveBeenCalledWith(1043, 109);
    expect(screen.getByRole('img', { name: '프로필.png' })).toHaveAttribute(
      'src',
      IMAGE_URL,
    );
    expect(screen.getByText('프로필.png')).toBeInTheDocument();
  });

  it('이미지 URL 을 받지 못하면 안내 문구를 보여준다', () => {
    fileUrlQuery.mockReturnValue({ data: undefined, isError: true });
    renderAnswer('IMAGE', { key: 'k.png', name: '프로필.png' }, 109);

    expect(
      screen.getByText('미리보기를 불러오지 못했습니다.'),
    ).toBeInTheDocument();
  });

  it('파일은 열기를 누르면 그때 A10 으로 받은 URL 을 연다', async () => {
    const user = userEvent.setup();
    renderAnswer('FILE', { key: 'k.pdf', name: '박서현_이력서.pdf' }, 110);

    expect(screen.getByText('박서현_이력서.pdf')).toBeInTheDocument();
    expect(getFileUrl).not.toHaveBeenCalled();

    await user.click(
      screen.getByRole('button', { name: '박서현_이력서.pdf 열기' }),
    );

    expect(getFileUrl).toHaveBeenCalledWith(1043, 110);
    expect(openAttachment).toHaveBeenCalledWith(FILE_URL);
  });

  it('파일 URL 을 받지 못하면 알리고 열지 않는다', async () => {
    getFileUrl.mockRejectedValue(new Error('404'));
    const user = userEvent.setup();
    renderAnswer('FILE', { key: 'k.pdf', name: '박서현_이력서.pdf' }, 110);

    await user.click(
      screen.getByRole('button', { name: '박서현_이력서.pdf 열기' }),
    );

    expect(
      await screen.findByText('파일을 열지 못했습니다.'),
    ).toBeInTheDocument();
    expect(openAttachment).not.toHaveBeenCalled();
  });
});
