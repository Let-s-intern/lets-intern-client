import { getPlanVersionNavItem } from './planVersionNavItem';

const onVersionChangeClick = jest.fn();

describe('getPlanVersionNavItem (LC-3247 대시보드 플랜·버전 메뉴)', () => {
  it('둘 다 가능하면 한 메뉴 아래 플랜 업그레이드와 버전 변경을 둔다', () => {
    const item = getPlanVersionNavItem({
      applicationId: '30',
      canUpgradePlan: true,
      canChangeVersion: true,
      onVersionChangeClick,
    });

    expect(item?.label).toBe('플랜 업그레이드 / 버전 변경');
    expect(item?.subItems?.map((child) => child.label)).toEqual([
      '플랜 업그레이드',
      '버전 변경',
    ]);
    // 모바일은 첫 하위 메뉴로 바로 이동하므로 첫 항목에 주소가 있어야 한다
    expect(item?.subItems?.[0].href).toBe('/plan-upgrade/30');
    expect(item?.subItems?.[1].onClick).toBe(onVersionChangeClick);
  });

  it('업그레이드만 가능하면 업그레이드 메뉴 하나만 둔다', () => {
    const item = getPlanVersionNavItem({
      applicationId: '30',
      canUpgradePlan: true,
      canChangeVersion: false,
      onVersionChangeClick,
    });

    expect(item).toEqual({
      id: 'plan-upgrade',
      label: '플랜 업그레이드',
      href: '/plan-upgrade/30',
    });
  });

  it('버전 변경만 가능하면 버전 변경 메뉴 하나만 둔다', () => {
    const item = getPlanVersionNavItem({
      applicationId: '30',
      canUpgradePlan: false,
      canChangeVersion: true,
      onVersionChangeClick,
    });

    expect(item).toEqual({
      id: 'version-change',
      label: '버전 변경',
      onClick: onVersionChangeClick,
    });
  });

  it('둘 다 불가능하면 메뉴를 만들지 않는다', () => {
    expect(
      getPlanVersionNavItem({
        applicationId: '30',
        canUpgradePlan: false,
        canChangeVersion: false,
        onVersionChangeClick,
      }),
    ).toBeNull();
  });
});
