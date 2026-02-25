/** 마그넷 타입 상수 */
export const MAGNET_TYPE = {
  RESOURCE: '자료집',
  VOD: 'VOD',
  FREE_TEMPLATE: '무료 템플릿',
  LAUNCH_ALERT: '출시알림',
  EVENT: '이벤트',
} as const;

export type MagnetTypeKey = keyof typeof MAGNET_TYPE;
export type MagnetTypeLabel = (typeof MAGNET_TYPE)[MagnetTypeKey];

/** 자료집/VOD/무료 템플릿 — 노출여부, 신청자 관리, 관리 버튼을 보여주는 타입 */
export const MANAGEABLE_MAGNET_TYPES: MagnetTypeKey[] = [
  'RESOURCE',
  'VOD',
  'FREE_TEMPLATE',
];

export const isMagnetManageable = (type: MagnetTypeKey): boolean =>
  MANAGEABLE_MAGNET_TYPES.includes(type);

/** 마그넷 목록 아이템 */
export interface MagnetListItem {
  id: number;
  type: MagnetTypeKey;
  title: string;
  programType: string | null;
  challengeType: string | null;
  displayDate: string | null;
  endDate: string | null;
  isVisible: boolean;
  applicantCount: number;
}

/** 마그넷 등록 요청 바디 */
export interface CreateMagnetReqBody {
  type: MagnetTypeKey;
  title: string;
}

/** 필터 상태 */
export interface MagnetFilterValues {
  magnetId: string;
  type: string;
  titleKeyword: string;
}

// --- 마그넷 글 관리 (포스트) ---

/** 프로그램 추천 슬롯 */
export interface MagnetProgramRecommendItem {
  id: string | null;
  ctaTitle?: string;
  ctaLink?: string;
}

/** 마그넷 콘텐츠 (JSON으로 직렬화하여 저장) */
export interface MagnetPostContent {
  programRecommend: MagnetProgramRecommendItem[];
  magnetRecommend: (number | null)[];
  lexicalBefore?: string;
  lexicalAfter?: string;
}

/** 마그넷 포스트 상세 (단건 조회) */
export interface MagnetPostDetail {
  magnetId: number;
  type: MagnetTypeKey;
  title: string;
  metaDescription: string;
  thumbnail: string;
  displayDate: string | null;
  endDate: string | null;
  hasCommonForm: boolean;
  content: string;
  isVisible: boolean;
}

/** 마그넷 포스트 저장 요청 */
export interface MagnetPostReqBody {
  magnetId: number;
  metaDescription: string;
  thumbnail: string;
  displayDate: string | null;
  endDate: string | null;
  hasCommonForm: boolean;
  content: string;
  isVisible: boolean;
}
