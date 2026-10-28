jest.mock('@/utils/axios', () => ({
  __esModule: true,
  default: { post: jest.fn() },
}));

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';

import { metadata } from '@/app/(user)/mentor-apply/page';
import MentorApplyPage from './MentorApplyPage';

describe('MentorApplyPage', () => {
  it('제목과 신청서 섹션, 제출 버튼을 그린다', () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <MentorApplyPage />
      </QueryClientProvider>,
    );

    expect(
      screen.getByRole('heading', { level: 1, name: '멘토 신청서' }),
    ).toBeInTheDocument();
    for (const section of [
      '기본 정보',
      '멘토링 분야',
      /추가 정보 \(선택\)/,
      '첨부 (선택)',
      '개인정보 수집·이용 동의',
    ]) {
      expect(screen.getByRole('group', { name: section })).toBeInTheDocument();
    }
    expect(
      screen.getByRole('button', { name: '신청서 제출하기' }),
    ).toBeInTheDocument();
  });

  it('라우트 metadata 에 canonical 과 OG 를 둔다', () => {
    expect(metadata.alternates?.canonical).toBe('/mentor-apply');
    expect(metadata.openGraph?.url).toBe('/mentor-apply');
    expect(metadata.description).toBe(
      '취업준비생과 함께할 현직자 멘토를 모집합니다.',
    );
  });
});
