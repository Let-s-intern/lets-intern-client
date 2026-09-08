import type { ApplicationDownloadType } from '@/api/application';
import { MypageApplication } from '@/api/application';
import { membershipGuideUrl } from '@/domain/membership/lib/membershipChallenge';
import { getReportThumbnail } from '@/domain/mypage/credit/ui/CreditListItem';
import dayjs from '@/lib/dayjs';
import {
  challengePricePlanToText,
  newProgramTypeToText,
} from '@/utils/convert';
import { normalizeChatPassword } from './chatLinkProvider';

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
  isHtmlDescription?: boolean;
  isDownloaded?: boolean;
  contentUrl?: string;
  contentFileUrl?: string;
  downloadType?: ApplicationDownloadType;
  purchasePlanText?: string;
  /** 오픈채팅방 입장 버튼. 카드 우측 하단(구매플랜 행)에 별도로 렌더된다. */
  openChat?: {
    link: string;
    password?: string;
  };
  actionButton?: {
    label: string;
    disabled?: boolean;
    href?: string;
    external?: boolean;
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
    chatLink,
    chatPassword,
  } = application;

  const isChallenge = programType === 'CHALLENGE';
  const isLive = programType === 'LIVE';
  const isLiveMentoring = programType === 'LIVE_MENTORING';
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

  const isChallengeDashboardVisible =
    pricePlanType !== 'LIGHT' && programStartDate?.isBefore(dayjs());
  const isDashboardVisible = isChallenge
    ? isChallengeDashboardVisible
    : isLive || isLiveMentoring;

  // [LC-3219-MEMBERSHIP] 멤버십 기수는 대시보드가 아니라 기수별 노션 가이드로 보낸다.
  // programId 는 프로그램 타입마다 별도 채번이라 챌린지일 때만 조회한다.
  const guideUrl = isChallenge ? membershipGuideUrl(programId ?? 0) : undefined;

  const actionButton =
    isDashboardVisible && programType && programId != null && id != null
      ? guideUrl
        ? {
            label: '가이드 확인',
            href: guideUrl,
            external: true,
          }
        : {
            label: isChallenge
              ? '대시보드 입장'
              : isLiveMentoring
                ? '멘토링 입장'
                : '클래스 입장',
            href: isChallenge
              ? `/challenge/${id}/${programId}`
              : isLiveMentoring
                ? `/live-mentoring/${programId}`
                : `/program/live/${programId}`,
          }
      : undefined;

  // 참여종료된 챌린지는 운영이 채팅방을 닫았을 수 있어 노출하지 않는다.
  const openChat =
    isChallenge && chatLink && !isCompleted
      ? { link: chatLink, password: normalizeChatPassword(chatPassword) }
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
    openChat,
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
    contentUrl,
    contentFileUrl,
    isDownloaded,
  } = application;

  const purchaseDateText =
    (createDate ?? programStartDate)?.format('YY.MM.DD') ?? '';

  const programTypeKey = programType ?? '';
  const categoryLabel = programTypeKey
    ? newProgramTypeToText[programTypeKey] || programTypeKey
    : '';

  const thumbnail = programThumbnail ?? '';
  const isUrl = !!contentUrl && !contentFileUrl;

  const urlConfirm = {
    title: '가이드북을 열람하시겠습니까?',
    description:
      '디지털 콘텐츠 특성상 열람 이후에는 단순 변심으로 인한 취소 및 환불이 불가능합니다.',
    confirmText: 'URL 접속하기',
    cancelText: '닫기',
  };

  const pdfConfirm = {
    title: '가이드북을 다운로드하시겠습니까?',
    description:
      '디지털 콘텐츠 특성상 다운로드 이후에는 단순 변심으로 인한 취소 및 환불이 불가능합니다.',
    confirmText: '다운로드',
    cancelText: '닫기',
  };

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
    contentUrl: contentUrl ?? undefined,
    contentFileUrl: contentFileUrl ?? undefined,
    isDownloaded: isDownloaded ?? false,
    actionButton: {
      label: isUrl ? 'URL 접속' : 'PDF 다운로드',
      isDownload: true,
      confirm: isUrl ? urlConfirm : pdfConfirm,
    },
    isCompleted: false,
  };
};

const toVodCardConfig = (
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
    contentUrl,
    contentFileUrl,
    isDownloaded,
  } = application;

  const purchaseDateText =
    (createDate ?? programStartDate)?.format('YY.MM.DD') ?? '';

  const programTypeKey = programType ?? '';
  const categoryLabel = programTypeKey
    ? newProgramTypeToText[programTypeKey] || programTypeKey
    : '';

  return {
    id: id ?? 0,
    programId: programId ?? 0,
    programTypeKey,
    thumbnail: programThumbnail ?? '',
    title: programTitle ?? '',
    description: programShortDesc ?? '',
    statusLabel: '구매완료',
    categoryLabel,
    dateLabel: '구매일자',
    dateText: purchaseDateText,
    contentUrl: contentUrl ?? undefined,
    contentFileUrl: contentFileUrl ?? undefined,
    isDownloaded: isDownloaded ?? false,
    downloadType: 'VOD',
    actionButton: {
      label: 'VOD 시청',
      isDownload: true,
      confirm: {
        title: 'VOD를 시청하시겠습니까?',
        description:
          '디지털 콘텐츠 특성상 시청 이후에는 단순 변심으로 인한 취소 및 환불이 불가능합니다.',
        confirmText: 'VOD 시청',
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
  if (application.programType === 'VOD') {
    return toVodCardConfig(application);
  }

  return toProgramCardConfig(application);
};
