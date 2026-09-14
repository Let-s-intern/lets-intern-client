import { fireEvent, render, screen } from '@testing-library/react';
import PlanVersionBanner from './PlanVersionBanner';

describe('PlanVersionBanner (LC-3247 대시보드 사이드바 배너)', () => {
  it('둘 다 가능하면 업그레이드 링크와 버전 변경 버튼을 모두 보인다', () => {
    const onVersionChangeClick = jest.fn();
    render(
      <PlanVersionBanner
        planUpgradeHref="/plan-upgrade/31"
        onVersionChangeClick={onVersionChangeClick}
      />,
    );

    expect(
      screen.getByRole('link', { name: '플랜 업그레이드하기' }),
    ).toHaveAttribute('href', '/plan-upgrade/31');
    fireEvent.click(screen.getByRole('button', { name: '버전 변경하기' }));
    expect(onVersionChangeClick).toHaveBeenCalledTimes(1);
  });

  it('할 수 없는 쪽은 그리지 않는다', () => {
    render(<PlanVersionBanner planUpgradeHref="/plan-upgrade/31" />);

    expect(
      screen.queryByRole('button', { name: '버전 변경하기' }),
    ).not.toBeInTheDocument();
  });

  it('둘 다 불가능하면 아무것도 그리지 않는다', () => {
    const { container } = render(<PlanVersionBanner />);
    expect(container).toBeEmptyDOMElement();
  });
});
