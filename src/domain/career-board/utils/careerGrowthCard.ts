import { ApplicationCategory } from '@/domain/mypage/application/constants';
import type { CareerGrowthItem } from './careerGrowth';

/** 탭(프로그램/가이드북/자료집) 공통 레이아웃용 카드 뷰모델 */
export interface CareerGrowthCardConfig {
  id: number;
  programId: number;
  thumbnail: string;
  title: string;
  description: string;
  statusLabel: string;
  categoryLabel: string;
  dateLabel: string;
  dateText: string;
  showPurchasePlan: boolean;
  purchasePlanText?: string;
  actionButton: {
    label: string;
    disabled?: boolean;
    href?: string;
    onClick?: () => void;
  };
}

/** 프로그램 탭용 카드 */
export const toProgramCardConfig = (
  program: CareerGrowthItem,
): CareerGrowthCardConfig => {
  const period = `${program.startDate} ~ ${program.endDate}`;
  const isDashboardDisabled = program.programStatusType === 'PREV';

  return {
    id: program.id,
    programId: program.programId,
    thumbnail: program.thumbnail,
    title: program.title,
    description: program.description,
    statusLabel: program.status,
    categoryLabel: program.programType,
    dateLabel: '진행기간',
    dateText: period,
    showPurchasePlan: true,
    purchasePlanText: program.purchasePlan,
    actionButton: {
      label: '대시보드 입장',
      disabled: isDashboardDisabled,
      href: `/challenge/${program.id}/${program.programId}`,
    },
  };
};

/** 탭별 카드 설정 매핑 */
export const toCareerGrowthCardConfigs = (
  programs: CareerGrowthItem[],
  category: ApplicationCategory,
): CareerGrowthCardConfig[] => {
  if (category === 'PROGRAM') {
    return programs.map((p) => toProgramCardConfig(p));
  }
  return [];
};
