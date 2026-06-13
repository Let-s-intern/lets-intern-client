/**
 * @jest-environment jsdom
 */
import { fireEvent, render, screen } from '@testing-library/react';

const pushMock = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
}));

import LoginGate from './LoginGate';

describe('LoginGate', () => {
  beforeEach(() => pushMock.mockClear());

  it('CTA 클릭 시 sanitize된 redirect로 /login에 라우팅한다', () => {
    render(<LoginGate feedbackId={42} role="MENTOR" />);
    fireEvent.click(screen.getByRole('button', { name: '로그인하고 입장' }));

    expect(pushMock).toHaveBeenCalledWith(
      `/login?redirect=${encodeURIComponent('/live-feedback/mentor/42')}`,
    );
  });
});
