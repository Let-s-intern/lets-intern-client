import { MypageApplication } from '@/api/application';
import { getReportThumbnail } from '@/domain/mypage/credit/CreditListItem';
import {
  challengePricePlanToText,
  newProgramTypeToText,
} from '@/utils/convert';

export interface MypageApplicationCardConfig {
  id: number;
  programId: number;
  programTypeKey: string;
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
  isCompleted: boolean;
}

const toProgramCardConfig = (
  application: MypageApplication,
): MypageApplicationCardConfig => {
  const {
    id,
    programId,
    programStatusType,
    programType,
    programThumbnail,
    reportType,
    programTitle,
    programShortDesc,
    programStartDate,
    programEndDate,
    createDate,
    pricePlanType,
  } = application;

  const isChallenge = programType === 'CHALLENGE';
  const isLive = programType === 'LIVE';
  const isReport = programType === 'REPORT';

  const statusLabel =
    programStatusType === 'PROCEEDING'
      ? '참여중'
      : programStatusType === 'PREV'
        ? '참여예정'
        : '참여종료';

  const isCompleted = statusLabel === '참여종료';

  const programTypeKey = programType ?? '';
  const categoryLabel = programTypeKey
    ? newProgramTypeToText[programTypeKey] || programTypeKey
    : '';

  let dateLabel = '진행기간';
  let dateText = '';

  if (isReport) {
    dateLabel = '신청일자';
    dateText = createDate?.format('YY.MM.DD') ?? '';
  } else if (programStartDate && programEndDate) {
    dateText = `${programStartDate.format('YY.MM.DD')} ~ ${programEndDate.format(
      'YY.MM.DD',
    )}`;
  }

  const purchasePlanText =
    isChallenge && pricePlanType
      ? challengePricePlanToText[pricePlanType] || pricePlanType
      : undefined;

  const thumbnail =
    isReport && reportType
      ? getReportThumbnail(reportType)
      : (programThumbnail ?? '');

  const isDashboardDisabled = programStatusType !== 'PROCEEDING';

  const actionButton =
    (isChallenge || isLive) && programType && programId != null && id != null
      ? {
          label: isChallenge ? '대시보드 입장' : '클래스 입장',
          disabled: isDashboardDisabled,
          href: isChallenge
            ? `/challenge/${id}/${programId}`
            : `/program/live/${programId}`,
        }
      : undefined;

  return {
    id: id ?? 0,
    programId: programId ?? 0,
    programTypeKey,
    thumbnail,
    title: programTitle ?? '',
    description: programShortDesc ?? '',
    statusLabel,
    categoryLabel,
    dateLabel,
    dateText,
    purchasePlanText,
    actionButton,
    isCompleted,
  };
};

const toGuidebookCardConfig = (
  application: MypageApplication,
): MypageApplicationCardConfig => {
  const {
    id,
    programId,
    programThumbnail,
    programTitle,
    programShortDesc,
    programType,
    createDate,
    programStartDate,
  } = application;

  const purchaseDateText =
    (createDate ?? programStartDate)?.format('YY.MM.DD') ?? '';

  const programTypeKey = programType ?? '';
  const categoryLabel = programTypeKey
    ? newProgramTypeToText[programTypeKey] || programTypeKey
    : '';

  const thumbnail = programThumbnail ?? '';

  return {
    id: id ?? 0,
    programId: programId ?? 0,
    programTypeKey,
    thumbnail,
    title: programTitle ?? '',
    description: programShortDesc ?? '',
    statusLabel: '구매완료',
    categoryLabel,
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
    },
    isCompleted: false,
  };
};

export const toMypageApplicationCardConfig = (
  application: MypageApplication,
): MypageApplicationCardConfig => {
  if (application.programType === 'GUIDEBOOK') {
    return toGuidebookCardConfig(application);
  }

  return toProgramCardConfig(application);
};
