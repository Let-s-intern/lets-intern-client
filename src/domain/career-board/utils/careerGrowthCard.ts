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
    confirm?: {
      title: string;
      description: string;
      confirmText?: string;
      cancelText?: string;
    };
    isDownload?: boolean;
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
      isDownload: true,
      confirm: {
        title: '가이드북을 다운로드하시겠습니까?',
        description:
          '디지털 콘텐츠 특성상 다운로드 이후에는 단순 변심으로 인한 취소 및 환불이 불가능합니다.',
        confirmText: '다운로드',
        cancelText: '닫기',
      },
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
