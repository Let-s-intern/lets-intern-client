import { render, screen } from '@testing-library/react';
import BottomNavBar from './BottomNavBar';

describe('BottomNavBar', () => {
  it('플랜 업그레이드 화면에서는 숨긴다 (하단 고정 결제 버튼을 가리지 않게)', () => {
    render(<BottomNavBar pathname="/plan-upgrade/29" />);
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
  });

  it('마이페이지에서는 보인다', () => {
    render(<BottomNavBar pathname="/mypage/application" />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });
});
