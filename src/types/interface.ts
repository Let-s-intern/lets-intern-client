import { ProgramAdminListItem } from '@/schema';
import { SerializedEditorState } from 'lexical';
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
  startDate: string;
  endDate: string;
  session: string; // 회차
  title: string;
  content: string; // 내용
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

/** 챌린지 또는 LIVE 클래스의 JSON 버전 (desc에 통쨰로 JSON 형태로 들어감) */
export type ChallengeContent = {
  /** 초기화 여부 알려주는 것 */
  initialized: boolean;
  /** 상세 설명*/
  mainDescription?: SerializedEditorState;
  /** 커리큘럼 */
  curriculum?: ChallengeCurriculum[];
  /** 챌린지 POINT */
  challengePoint: ChallengePoint;
  /** 블로그 후기 */
  blogReview?: ProgramBlogReview;
  /**  후기 */
  challengeReview?: ContentReviewType[];
  /** 프로그램 추천 리스트 */
  programRecommend?: ProgramRecommend;
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
