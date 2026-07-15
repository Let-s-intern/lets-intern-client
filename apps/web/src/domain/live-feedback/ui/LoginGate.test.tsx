/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';

const loginMock = jest.fn();
jest.mock('@letscareer/store', () => ({
  useAuthStore: (selector: (s: { login: typeof loginMock }) => unknown) =>
    selector({ login: loginMock }),
}));
jest.mock('@/utils/axios', () => ({
  __esModule: true,
  default: { post: jest.fn() },
}));
jest.mock('@/utils/url', () => ({
  getUniversalBaseUrl: () => 'https://web.test',
}));

import LoginGate from './LoginGate';

describe('LoginGate', () => {
  it('페이지 이동 없이 인라인 로그인 폼을 렌더한다', () => {
    render(<LoginGate feedbackId={42} role="MENTOR" />);
    expect(screen.getByPlaceholderText('이메일')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('비밀번호')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /로그인하고 입장/ }),
    ).toBeInTheDocument();
  });

  it('소셜 로그인은 현재 입장 경로로 복귀하도록 redirect 를 건다', () => {
    process.env.NEXT_PUBLIC_API_BASE_PATH = 'https://api.test';
    render(<LoginGate feedbackId={42} role="MENTOR" />);
    const kakao = screen.getByRole('link', { name: '카카오로 로그인' });
    // redirect_uri(→/login?redirect=<path>)가 이중 인코딩되므로 완전 디코딩 후 검증.
    const href = kakao.getAttribute('href') ?? '';
    expect(decodeURIComponent(decodeURIComponent(href))).toContain(
      '/live-feedback/mentor/42',
    );
  });
});
