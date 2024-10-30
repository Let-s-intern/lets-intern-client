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
  challengeReview: unknown;
};

export type LiveContent = {
  /* 상세 설명*/
  mainDescription?: SerializedEditorState;
  /* 커리큘럼 */
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
