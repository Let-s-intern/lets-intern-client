import { render, screen } from '@testing-library/react';
import MembershipNavLabel from './MembershipNavLabel';
import SideNavItem from './SideNavItem';

describe('MembershipNavLabel (올인원패스 진입 메뉴)', () => {
  it('전달받은 문구를 그대로 렌더한다', () => {
    render(<MembershipNavLabel title="마케팅 취준 올인원 패스" />);
    expect(screen.getByText('마케팅 취준 올인원 패스')).toBeInTheDocument();
  });

  it('네비 항목에 담기면 전달받은 href 로 링크된다', () => {
    // 라벨만 살아 있고 링크가 빠지면 메뉴가 보이는데 눌러도 아무 일이 없다.
    // 실제로 확인해야 하는 것은 문구가 아니라 이 이동 경로다.
    render(
      <SideNavItem href="/all-in-one-pass/123" isNew>
        <MembershipNavLabel title="올인원패스" />
      </SideNavItem>,
    );

    const link = screen.getByRole('link', { name: '올인원패스' });
    expect(link).toHaveAttribute('href', '/all-in-one-pass/123');
  });
});
