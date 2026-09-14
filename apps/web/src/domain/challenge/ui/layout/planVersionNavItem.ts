export type NavItem = {
  id: string;
  label: string;
  href?: string;
  /** 주소 대신 모달을 여는 메뉴 */
  onClick?: () => void;
  subItems?: NavItem[];
};

interface PlanVersionNavItemParams {
  applicationId: string;
  canUpgradePlan: boolean;
  canChangeVersion: boolean;
  onVersionChangeClick: () => void;
}

/**
 * 대시보드 사이드 메뉴의 플랜 업그레이드·버전 변경 (LC-3247).
 * 둘 다 되면 `미션 피드백` 처럼 한 메뉴 아래 두고, 하나만 되면 그 메뉴만, 둘 다 안 되면 숨긴다.
 */
export const getPlanVersionNavItem = ({
  applicationId,
  canUpgradePlan,
  canChangeVersion,
  onVersionChangeClick,
}: PlanVersionNavItemParams): NavItem | null => {
  const upgrade: NavItem | null = canUpgradePlan
    ? {
        id: 'plan-upgrade',
        label: '플랜 업그레이드',
        href: `/plan-upgrade/${applicationId}`,
      }
    : null;
  const version: NavItem | null = canChangeVersion
    ? {
        id: 'version-change',
        label: '버전 변경',
        onClick: onVersionChangeClick,
      }
    : null;

  if (upgrade && version) {
    return {
      id: 'plan-version',
      label: '플랜 업그레이드 / 버전 변경',
      subItems: [upgrade, version],
    };
  }
  return upgrade ?? version;
};
