import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/utils/axios', () => ({ default: {} }));

// 두 표 모두 네트워크 의존이라 목으로 대체한다. 이 테스트가 보는 것은 탭 전환이다.
vi.mock('@/domain/live-mentoring/AdminLiveMentoringTable', () => ({
  default: ({
    onSelectMentor,
    onSelectMentorReviews,
    onEditMentor,
  }: {
    onSelectMentor?: (id: number) => void;
    onSelectMentorReviews?: (id: number) => void;
    onEditMentor?: (id: number) => void;
  }) => (
    <div>
      <button type="button" onClick={() => onSelectMentor?.(21)}>
        상품표목
      </button>
      <button type="button" onClick={() => onSelectMentorReviews?.(21)}>
        후기목
      </button>
      <button type="button" onClick={() => onEditMentor?.(21)}>
        멘토수정목
      </button>
    </div>
  ),
}));
// 섹션 자체는 MentorReviewExposureSection.test.tsx 에서 본다. 여기서는 연결만 확인한다
vi.mock(
  '@/domain/mentor/review-exposure/ui/MentorReviewExposureSection',
  () => ({
    default: ({ mentorId }: { mentorId: number }) => (
      <span>후기섹션 {mentorId}</span>
    ),
  }),
);
vi.mock('@/domain/live-mentoring/AdminLiveMentoringParticipantTable', () => ({
  default: ({
    mentorId,
    onClearMentor,
  }: {
    mentorId?: number;
    onClearMentor?: () => void;
  }) => (
    <div>
      <span>참여자표목 {mentorId ?? '전체'}</span>
      <button type="button" onClick={onClearMentor}>
        멘토해제
      </button>
    </div>
  ),
}));

vi.mock('@/domain/live-mentoring/ui/ReviewMentorBar', () => ({
  default: ({
    mentorId,
    onChangeMentor,
  }: {
    mentorId: number;
    onChangeMentor: () => void;
  }) => (
    <button type="button" onClick={onChangeMentor}>
      멘토바 {mentorId}
    </button>
  ),
}));
vi.mock('@/domain/admin/user/mentor-detail/ui/MentorDetailEditor', () => ({
  default: ({ mentorId }: { mentorId: number }) => (
    <span>멘토편집 {mentorId}</span>
  ),
}));

import AdminLiveMentoringPage from './AdminLiveMentoringPage';

const renderPage = (initialEntry = '/live-mentoring') =>
  render(
    <QueryClientProvider client={new QueryClient()}>
      <MemoryRouter initialEntries={[initialEntry]}>
        <AdminLiveMentoringPage />
      </MemoryRouter>
    </QueryClientProvider>,
  );

describe('AdminLiveMentoringPage', () => {
  it('기본 탭은 상품 관리다', () => {
    renderPage();
    expect(screen.getByText('상품표목')).toBeInTheDocument();
    expect(screen.queryByText('참여자표목')).not.toBeInTheDocument();
  });

  it('참여자 탭으로 전환하면 참여자 표를 보여 준다', () => {
    renderPage();
    fireEvent.click(screen.getByRole('button', { name: '참여자' }));
    expect(screen.getByText('참여자표목 전체')).toBeInTheDocument();
    expect(screen.queryByText('상품표목')).not.toBeInTheDocument();
  });

  it('탭마다 설명 문구가 바뀐다', () => {
    renderPage();
    expect(
      screen.getByText(/개설은 멘토가 직접 열고 닫으며/),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: '참여자' }));
    expect(screen.getByText(/조작은 환불뿐입니다/)).toBeInTheDocument();
  });

  // 새로고침해도 보던 탭이 유지되어야 한다.
  it('URL 의 tab 파라미터로 탭을 복원한다', () => {
    renderPage('/live-mentoring?tab=participants');
    expect(screen.getByText('참여자표목 전체')).toBeInTheDocument();
  });

  it('상품 표에서 멘토를 고르면 그 멘토의 참여자만 보러 간다', () => {
    renderPage();
    fireEvent.click(screen.getByRole('button', { name: '상품표목' }));
    expect(screen.getByText('참여자표목 21')).toBeInTheDocument();
  });

  it('멘토 필터를 풀면 전체 참여자로 돌아간다', () => {
    renderPage('/live-mentoring?tab=participants&mentorId=21');
    expect(screen.getByText('참여자표목 21')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: '멘토해제' }));
    expect(screen.getByText('참여자표목 전체')).toBeInTheDocument();
  });

  it('mentorId 가 숫자가 아니면 전체로 본다', () => {
    renderPage('/live-mentoring?tab=participants&mentorId=abc');
    expect(screen.getByText('참여자표목 전체')).toBeInTheDocument();
  });

  it('알 수 없는 tab 값은 상품 관리로 되돌린다', () => {
    renderPage('/live-mentoring?tab=unknown');
    expect(screen.getByText('상품표목')).toBeInTheDocument();
  });

  it('상품 표에서 후기 관리를 누르면 그 멘토의 후기 탭으로 간다', () => {
    renderPage();
    fireEvent.click(screen.getByRole('button', { name: '후기목' }));
    expect(screen.getByText('후기섹션 21')).toBeInTheDocument();
    // 어느 멘토의 후기인지 위에 알린다
    expect(screen.getByText('멘토바 21')).toBeInTheDocument();
    expect(screen.getByText(/원본 후기는 바뀌지 않습니다/)).toBeInTheDocument();
  });

  it('후기 탭에 멘토가 없으면 상품 관리에서 고르라고 안내한다', () => {
    renderPage('/live-mentoring?tab=reviews');
    expect(
      screen.getByText('상품 관리 탭에서 멘토의 후기 관리 버튼을 눌러 주세요.'),
    ).toBeInTheDocument();
    expect(screen.queryByText(/후기섹션/)).not.toBeInTheDocument();
  });

  it('후기 탭에서 다른 멘토 고르기를 누르면 상품 관리로 돌아간다', () => {
    renderPage('/live-mentoring?tab=reviews&mentorId=21');
    fireEvent.click(screen.getByRole('button', { name: '멘토바 21' }));
    expect(screen.getByText('상품표목')).toBeInTheDocument();
  });

  it('상품 표에서 멘토 수정을 누르면 그 멘토의 편집 모달을 띄우고, 닫으면 내린다', () => {
    renderPage();
    expect(screen.queryByText(/멘토편집/)).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: '멘토수정목' }));
    expect(screen.getByText('멘토편집 21')).toBeInTheDocument();
    expect(screen.getByText('멘토 수정')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: '닫기' }));
    expect(screen.queryByText('멘토편집 21')).not.toBeInTheDocument();
  });
});
