import { ApplicationCategory } from '@/domain/mypage/application/constants';
import { PROGRAM_TYPE } from '@/utils/programConst';
import type { CareerGrowthItem } from './careerGrowth';
import { downloadGuidebookAndTrack } from './guidebookDownload';

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
  purchasePlanText?: string;
  actionButton?: {
    label: string;
    disabled?: boolean;
    href?: string;
    onClick?: () => void;
  };
}

/** 프로그램 탭용 카드 */
export const toProgramCardConfig = (
  item: CareerGrowthItem,
): CareerGrowthCardConfig => {
  const isChallenge = item.programTypeKey === PROGRAM_TYPE.CHALLENGE;
  const period = `${item.startDate} ~ ${item.endDate}`;
  const isDashboardDisabled = item.programStatusType === 'PREV';

  return {
    id: item.id,
    programId: item.programId,
    thumbnail: item.thumbnail,
    title: item.title,
    description: item.description,
    statusLabel: item.status,
    categoryLabel: item.programType,
    dateLabel: '진행기간',
    dateText: period,
    purchasePlanText:
      isChallenge && item.purchasePlan ? item.purchasePlan : undefined,
    actionButton: isChallenge
      ? {
          label: '대시보드 입장',
          disabled: isDashboardDisabled,
          href: `/challenge/${item.id}/${item.programId}`,
        }
      : undefined,
  };
};

/** 가이드북 탭용 카드 */
export const toGuidebookCardConfig = (
  item: CareerGrowthItem,
): CareerGrowthCardConfig => {
  const purchaseDateText = item.createDate || item.startDate;

  return {
    id: item.id,
    programId: item.programId,
    thumbnail: item.thumbnail,
    title: item.title,
    description: item.description,
    statusLabel: '구매 완료',
    categoryLabel: item.programType,
    dateLabel: '구매일자',
    dateText: purchaseDateText,
    actionButton: {
      label: 'PDF 다운로드',
      onClick: () => downloadGuidebookAndTrack(item.id, item.programId),
    },
  };
};

/** 탭별 카드 설정 매핑 */
export const toCareerGrowthCardConfigs = (
  items: CareerGrowthItem[],
  category: ApplicationCategory,
): CareerGrowthCardConfig[] => {
  if (category === 'PROGRAM') {
    return items.map((p) => toProgramCardConfig(p));
  }
  if (category === 'GUIDEBOOK') {
    return items.map((p) => toGuidebookCardConfig(p));
  }
  return [];
};
