import {
  getContentsAdminSimple,
  Mission,
  MissionTemplateResItem,
  ProgramAdminListItem,
} from '@/schema';
import { SerializedEditorState } from 'lexical';
import { z } from 'zod';
import { TABLE_STATUS } from '../utils/convert';
export * from './Banner.interface';
export * from './Mission.interface';
export * from './Program.interface';

export type StatusKey = keyof typeof TABLE_STATUS;

export interface IApplyDrawerAction {
  type: 'toggle' | 'close' | 'open';
}

export type ChallengePoint = {
  weekText?: string;
  list?: {
    id: string;
    title: string;
    subtitle: string;
  }[];
};

export type ChallengeCurriculum = {
  id: string;
  week?: string; // 주차
  startDate: string;
  endDate: string;
  session: string; // 회차
  title: string;
  content: string; // 내용
  contentImg?: string; // 로고 이미지
  contentHighlightColor?: 'none' | 'gray' | 'accent'; // 내용 강조
};

export type ProgramBlogReview = {
  list: {
    id: number;
    category: string;
    title: string;
    thumbnail: string;
  }[];
};

export type ContentReviewType = {
  name: string;
  programName: string;
  passedState: string;
  title: string;
  content: string;
};

export type ProgramRecommend = {
  list: (ProgramAdminListItem & {
    recommendTitle?: string;
    recommendCTA?: string;
  })[];
};
export interface OperationRecommendMoreButton {
  visible: boolean;
  url?: string;
}

/** 챌린지 또는 LIVE 클래스의 JSON 버전 (desc에 통쨰로 JSON 형태로 들어감) */
export type ChallengeContent = {
  /** 초기화 여부 알려주는 것 */
  initialized: boolean;
  /** 프로그램 최상단 배너 */
  intro?: SerializedEditorState;
  /** 상세 설명*/
  mainDescription?: SerializedEditorState;
  /** 커리큘럼 */
  curriculum?: ChallengeCurriculum[];
  /** 커리큘럼 상세 일정 이미지 */
  curriculumImage?: string;
  /** 챌린지 POINT */
  challengePoint: ChallengePoint;
  /** 주차 설정 사용 여부 */
  useWeekSettings?: boolean;
  /** 주차별 제목 및 날짜 */
  weekTitles?: {
    week: string;
    weekTitle: string;
    startDate?: string;
    endDate?: string;
  }[];
  /** 블로그 후기 */
  blogReview?: ProgramBlogReview;
  /**  후기 */
  challengeReview?: ContentReviewType[];
  /** FAQ 카테고리 순서 */
  faqCategory: string[];
  /** 프로그램 추천 리스트 */
  programRecommend?: ProgramRecommend;
  /** 챌린지 운영: 추천 프로그램 */
  operationRecommendProgram?: ProgramRecommend;
  /** 챌린지 운영: 더보기 버튼 정보 */
  operationRecommendMoreButton?: OperationRecommendMoreButton;
  /** 강의 정보 (HR 챌린지 등) */
  lectures?: {
    topic: string; // 강의 주제
    mentorImage: string; // 멘토 이미지 URL
    mentorName: string; // 멘토명
    schedule: string; // 강의 일정
    companyLogo: string; // 소속 로고 이미지 URL
  }[];
};

export type LiveContent = {
  /** 초기화 여부 알려주는 것 */
  initialized: boolean;
  /* 이런분께 추천드려요 */
  recommend?: string[];
  /* 이번 클래스 꼭 들어야 하는 이유 */
  reason?: {
    title: string;
    content: string;
  }[];
  /* 상세 설명*/
  mainDescription?: SerializedEditorState;
  /* 커리큘럼 추가 입력 */
  additionalCurriculum?: SerializedEditorState;
  /* 커리큘럼 */
  curriculumTitle: string; // 커리큘럼 섹션에 들어가는 제목
  curriculum: {
    id: string;
    time: string; // 시간
    title: string;
    content: string; // 내용
  }[];
  /* 커리큘럼 추가 설명 */
  curriculumDesc?: unknown;
  /* 블로그 후기 */
  blogReview?: ProgramBlogReview;
  liveReview?: ContentReviewType[];
  /** 프로그램 추천 리스트 */
  programRecommend?: ProgramRecommend;
};

export type ReportReviewItem = {
  id: string | number;
  title: string;
  question: string;
  answer: string;
  detail: string;
  profile: string;
  reportName: string;
  job: string;
  name: string;
};

export type ReportReview = {
  list: ReportReviewItem[];
};

export type ReportExampleItem = {
  id: string | number;
  subTitle: string;
  imgUrl: string;
};

export type ReportExample = {
  list: ReportExampleItem[];
};

export type ReportProgramRecommendItem = {
  title: string;
  cta: string;
};

export type ReportProgramRecommend = {
  challengeCareerStart?: ReportProgramRecommendItem;
  challengePortfolio?: ReportProgramRecommendItem;
  challengePersonalStatement?: ReportProgramRecommendItem;
  live?: ReportProgramRecommendItem;
  vod?: ReportProgramRecommendItem;
  reportResume?: ReportProgramRecommendItem;
  reportPersonalStatement?: ReportProgramRecommendItem;
  reportPortfolio?: ReportProgramRecommendItem;
};

export type ReportContent = {
  /** 레포트 예시 */
  reportExample: ReportExample;
  /** 후기 */
  review: ReportReview;
  /** 프로그램 추천 */
  reportProgramRecommend: ReportProgramRecommend;
};

export type ReportColors = {
  primary: {
    DEFAULT: string;
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
  };
  secondary: {
    DEFAULT: string;
    50: string;
  };
  highlight: {
    DEFAULT: string;
    50: string;
    100: string;
  };
};

export interface IPageable {
  page: number;
  size: number;
}
export interface IPageInfo {
  pageNum: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
}

export interface ErrorResonse {
  status: number;
  message: string;
}

export interface ICouponForm {
  id: number | null;
  price: number;
}

export type ReportEditingPrice =
  | {
      type: 'premium';
      premiumPrice: number;
      premiumDiscount: number;
    }
  | {
      type: 'basic';
      basicPrice: number;
      basicDiscount: number;
    }
  | {
      type: 'all';
      basicPrice: number;
      basicDiscount: number;
      premiumPrice: number;
      premiumDiscount: number;
    };

export type ReportEditingFeedbackPrice = {
  type: 'basic';
  price: number;
  discount: number;
};

// 미션 관련 타입
export type Content = z.infer<
  typeof getContentsAdminSimple
>['contentsSimpleList'][number];

export type Row = Mission & {
  mode: 'normal' | 'create';
  additionalContentsOptions: Content[];
  essentialContentsOptions: Content[];
  missionTemplatesOptions: MissionTemplateResItem[];
  challengeOptionId: number | null;
  challengeOptionCode: string | null;
  onAction(params: {
    action: 'create' | 'cancel' | 'edit' | 'delete';
    row: Row;
  }): void;
};
