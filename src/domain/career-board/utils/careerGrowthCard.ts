import { MypageMagnetListItem } from '@/api/magnet/magnetSchema';
import { ApplicationCategory } from '@/domain/mypage/application/constants';
import dayjs from '@/lib/dayjs';
import { PROGRAM_TYPE } from '@/utils/programConst';
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
  isHtmlDescription?: boolean;
  purchasePlanText?: string;
  contentUrl?: string;
  contentFileUrl?: string;
  isDownloaded?: boolean;
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
    contentUrl: item.contentUrl,
    contentFileUrl: item.contentFileUrl,
    isDownloaded: item.isDownloaded,
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
    },
  };
};

const MAGNET_TYPE_LABEL: Record<string, string> = {
  MATERIAL: '자료집',
  VOD: '무료 VOD',
  FREE_TEMPLATE: '무료 템플릿',
  LAUNCH_ALERT: '출시 알림',
  EVENT: '이벤트',
};

/** 무료 자료집(마그넷) 카드 */
const toLibraryCardConfig = (
  magnet: MypageMagnetListItem,
): CareerGrowthCardConfig => {
  const dateText = magnet.applicationCreateDate
    ? dayjs(magnet.applicationCreateDate).format('YY.MM.DD')
    : '';

  const slug = encodeURIComponent(magnet.title.replace(/\s+/g, '-'));

  return {
    id: magnet.magnetId,
    programId: magnet.magnetId,
    thumbnail: magnet.desktopThumbnail ?? '',
    title: magnet.title,
    description: (() => {
      try {
        const parsed = JSON.parse(magnet.description ?? '');
        return parsed.metaDescription ?? '';
      } catch {
        return magnet.description ?? '';
      }
    })(),
    statusLabel: '신청완료',
    categoryLabel: MAGNET_TYPE_LABEL[magnet.type] ?? magnet.type,
    dateLabel: '신청일자',
    dateText,
    isHtmlDescription: true,
    actionButton: {
      label: '확인하기',
      href: `/library/${magnet.magnetId}/${slug}`,
    },
  };
};

/** 무료 자료집 목록 → 카드 설정 */
export const toLibraryCardConfigs = (
  magnetList: MypageMagnetListItem[],
): CareerGrowthCardConfig[] => {
  return magnetList.map(toLibraryCardConfig);
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
