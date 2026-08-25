import { render, screen } from '@testing-library/react';
import MembershipNavLabel from './MembershipNavLabel';
import SideNavItem from './SideNavItem';

describe('MembershipNavLabel (LC-3219 멤버십 랜딩 진입 메뉴)', () => {
  it('GNB 문구를 그대로 렌더한다', () => {
    render(<MembershipNavLabel />);
    expect(screen.getByText('2026년 하반기 공채 멤버십')).toBeInTheDocument();
  });

  it('네비 항목에 담기면 /membership 으로 링크된다', () => {
    // 라벨만 살아 있고 링크가 빠지면 메뉴가 보이는데 눌러도 아무 일이 없다.
    // 모집 재개에서 실제로 확인해야 하는 것은 문구가 아니라 이 이동 경로다.
    render(
      <SideNavItem href="/membership" isNew>
        <MembershipNavLabel />
      </SideNavItem>,
    );

    const link = screen.getByRole('link', {
      name: '2026년 하반기 공채 멤버십',
    });
    expect(link).toHaveAttribute('href', '/membership');
  });
});
