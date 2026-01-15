import { CurationLocationType, CurationType } from '@/api/curation';
import { QuestionType } from '@/api/review/review';
import dayjs from '@/lib/dayjs';
import { Dayjs } from 'dayjs';
import {
  AttendanceResult,
  AttendanceStatus,
  ChallengePricePlan,
  ChallengeType,
  ChallengeUserType,
  LiveProgressType,
  ProgramClassification,
} from '../schema';

export const newProgramTypeToText: Record<string, string> = {
  CHALLENGE: '챌린지',
  LIVE: 'LIVE 클래스',
  VOD: 'VOD 클래스',
  REPORT: '서류 진단',
};
export const newProgramFeeTypeToText: Record<string, string> = {
  FREE: '무료',
  CHARGE: '이용료',
  REFUND: '보증금',
};

/** @deprecated use programClassificationToText instead */
export const newProgramTypeDetailToText: Record<string, string> = {
  CAREER_SEARCH: '커리어 탐색',
  DOCUMENT_PREPARATION: '서류 준비',
  MEETING_PREPARATION: '면접 준비',
  PASS: '합격 후 성장',
};

export const questionTypeToText: Record<QuestionType, string> = {
  GOOD_POINT: '좋았던 점',
  BAD_POINT: '아쉬웠던 점',
  GOAL: '프로그램 참여 전 목표',
  GOAL_RESULT: '목표 달성 여부',
  WORRY: '서류 작성 고민', // report
  WORRY_RESULT: '고민 해결 여부', // report
};

export const programClassificationToText: Record<
  ProgramClassification,
  string
> = {
  CAREER_SEARCH: '커리어 탐색',
  DOCUMENT_PREPARATION: '서류 준비',
  MEETING_PREPARATION: '면접 준비',
  PASS: '합격 후 성장',
};

export const challengeTypeToText: Record<ChallengeType, string> = {
  CAREER_START: '커리어 시작',
  DOCUMENT_PREPARATION: '서류 준비',
  MEETING_PREPARATION: '면접 준비',
  ETC: '기타',
  PERSONAL_STATEMENT: '자기소개서',
  PORTFOLIO: '포트폴리오',
  PERSONAL_STATEMENT_LARGE_CORP: '대기업 자소서',
  MARKETING: '마케팅',
  EXPERIENCE_SUMMARY: '경험 정리',
};

export const challengeTypeToDisplay: Record<ChallengeType, string> = {
  CAREER_START: '취준 기필코 시작 챌린지',
  DOCUMENT_PREPARATION: '서류 완성 챌린지',
  MEETING_PREPARATION: '면접 완성 챌린지',
  ETC: '기타',
  PERSONAL_STATEMENT: '자기소개서 완성 챌린지',
  PORTFOLIO: '포트폴리오 완성 챌린지',
  PERSONAL_STATEMENT_LARGE_CORP: '대기업 공채 자소서 완성 챌린지',
  MARKETING: '마케팅',
  EXPERIENCE_SUMMARY: '경험 정리 챌린지',
};

export const challengeTypes: ChallengeType[] = [
  'CAREER_START',
  'DOCUMENT_PREPARATION',
  'MEETING_PREPARATION',
  'ETC',
  'PERSONAL_STATEMENT',
  'PORTFOLIO',
  'PERSONAL_STATEMENT_LARGE_CORP',
  'MARKETING',
  'EXPERIENCE_SUMMARY',
];

export const programStatusToText: Record<string, string> = {
  PREV: '모집 전',
  PROCEEDING: '모집 중',
  POST: '모집 마감',
};

export const programPriceTypeToText: Record<ChallengeUserType | 'ALL', string> =
  {
    ALL: '전체',
    BASIC: '베이직',
    PREMIUM: '프리미엄',
  };

export const programPriceTypes: (ChallengeUserType | 'ALL')[] = [
  'ALL',
  'BASIC',
  'PREMIUM',
];

export const programParticipationTypeToText: Record<string, string> = {
  LIVE: 'LIVE',
  FREE: '자율일정',
};

export const feeTypeToText: Record<string, string> = {
  FREE: '무료',
  CHARGE: '이용료',
  REFUND: '보증금',
};

export const bankTypeToText: Record<string, string> = {
  KB: 'KB국민은행',
  HANA: '하나은행',
  WOORI: '우리은행',
  SHINHAN: '신한은행',
  NH: 'NH농협은행',
  SH: 'SH수협은행',
  IBK: 'IBK기업은행',
  MG: '새마을금고',
  KAKAO: '카카오뱅크',
  TOSS: '토스뱅크',
  KBANK: '케이뱅크',
  SC: 'SC제일은행',
};

export const gradeToText: Record<string, string> = {
  FIRST: '1학년',
  SECOND: '2학년',
  THIRD: '3학년',
  FOURTH: '4학년',
  ETC: '5학년 이상',
  GRADUATE: '졸업생',
};

export const liveProgressTypeToText: Record<LiveProgressType, string> = {
  ALL: '온오프라인 병행',
  ONLINE: '온라인',
  OFFLINE: '오프라인',
};

export const wishJobToText: any = {
  ALL: '전체',

  MANAGEMENT_ALL: '경영관리 전반',
  MANAGEMENT_HR: '인사(HRD, HRM)',
  MANAGEMENT_GENERAL: '총무',
  MANAGEMENT_FINANCE: '회계/재무/자금',

  FINANCE_ALL: '금융 전반',

  MARKETING_ALL: '마케팅 전반',
  MARKETING_BRAND: '브랜드 마케팅',
  MARKETING_PERFORMANCE: '퍼포먼스 마케팅',
  MARKETING_CRM: 'CRM 마케팅',
  MARKETING_CONTENTS: '콘텐츠 마케팅',

  AD_ALL: '광고 전반',
  AD_PR: '홍보 PR',
  AD_AE: '광고대행사 (AE)',

  DESIGN_ALL: '디자인 전반',
  DESIGN_GRAPHIC: '그래픽 디자인',
  DESIGN_UIUX: 'UI/UX 디자인',

  BROADCASTING_ALL: '방송 전반',
  BROADCASTING_PD: 'PD',
  BROADCASTING_WRITER: '작가',
  BROADCASTING_PRESS: '언론(아나운서, 기자)',

  DEVELOPMENT_ALL: '개발 전반',
  DEVELOPMENT_FRONTEND: '프론트엔드 개발',
  DEVELOPMENT_BACKEND: '백엔드 개발',
  DEVELOPMENT_APP: '앱개발',
  DEVELOPMENT_DATA: '데이터 분석',
  DEVELOPMENT_AI: '인공지능/머신러닝',

  SALES_ALL: '영업 전반',
  SALES_MANAGEMENT: '영업관리',
  SALES_OVERSEA: '해외영업',

  SERVICE_PLANNING_ALL: '서비스 기획 전반',
  SERVICE_PLANNING_PM: 'PM',
  SERVICE_PLANNING_PO: 'PO',

  BUSINESS_ALL: '사업/전략 전반',
  BUSINESS_DEVELOPMENT: '사업개발',
  BUSINESS_STRATEGY: '전략기획',

  CONSULTING_ALL: '컨설팅 전반',

  DISTRIBUTION_ALL: '유통 전반',
  DISTRIBUTION_MD: '상품 기획',
  DISTRIBUTION_MANAGEMENT: '물류관리(구매, 유통)',

  RESEARCH_ALL: '공정 및 연구 전반',
  RESEARCH_PROCESS: '공정 관리(생산, 품질)',
  RESEARCH_ELEC: '엔지니어(전기/전자, 반도체)',
  RESEARCH_MACHINE: '엔지니어(기계)',
  RESEARCH_BIO: '엔지니어(화학, 바이오)',
  RESEARCH_RND: 'R&D 연구원',
};

export const missionStatusToText: any = {
  WAITING: '대기',
  CHECK_DONE: '확인완료',
  REFUND_DONE: '환급완료',
};

export const newMissionStatusToText: Record<string, string> = {
  WAITING: '대기',
  CHECK_DONE: '확인완료',
};

export const missionStatusToBadge: any = {
  WAITING: { text: '대기', style: 'bg-[#E3E3E3] text-[#9B9B9B]' },
  CHECK_DONE: { text: '확인완료', style: 'text-primary bg-[#E7E6FD]' },
  REFUND_DONE: { text: '환급완료', style: 'text-primary bg-[#E7E6FD]' },
};

export const attendanceStatusToText: any = {
  PRESENT: '정상 제출',
  UPDATED: '다시 제출',
  LATE: '지각 제출',
  ABSENT: '미제출',
};

export const attendanceResultToText: any = {
  WAITING: '확인중',
  PASS: '확인 완료',
  WRONG: '반려',
  FINAL_WRONG: '최종 반려',
};

export const couponTypeToText: Record<string, string> = {
  PARTNERSHIP: '제휴',
  EVENT: '이벤트',
  GRADE: '등급별 할인',
};

export const couponTypeEnum = {
  PARTNERSHIP: {
    id: 1,
    text: '제휴',
  },
  EVENT: {
    id: 2,
    text: '이벤트',
  },
  GRADE: {
    id: 3,
    text: '등급별 할인',
  },
};

export const couponProgramTypeEnum = {
  ALL: {
    id: 1,
    text: '전체',
  },
  CHALLENGE: {
    id: 2,
    text: '챌린지',
  },
  BOOTCAMP: {
    id: 3,
    text: '부트캠프',
  },
  SESSION: {
    id: 4,
    text: '렛츠챗',
  },
};

export const absent = {
  text: '미제출',
  icon: '/icons/submit_absent.svg',
  style: 'text-system-error text-[13px]',
};

export const missionSubmitToBadge = ({
  status,
  result,
  challengeEndDate,
}: {
  status?: AttendanceStatus | null;
  result?: AttendanceResult | null;
  challengeEndDate?: Dayjs | null;
}) => {
  const isChallengePeriodOver = challengeEndDate
    ?.add(2, 'day')
    .isBefore(dayjs());

  if (result === 'WAITING') {
    return {
      text: '확인중',
      icon: '/icons/submit_waiting.svg',
      style: 'text-primary-90 text-sm',
    };
  }

  if (status === null) {
    return {
      text: '진행중',
      style: 'text-primary-90 text-sm',
      icon: '/icons/submit_waiting.svg',
    };
  }

  // 반려 AND (챌린지 종료 + 2일) 지나면면
  if (
    result === 'FINAL_WRONG' ||
    (result === 'WRONG' && isChallengePeriodOver)
  ) {
    return {
      text: '최종 반려',
      icon: '/icons/submit_absent.svg',
      style: 'text-neutral-30 text-[13px]',
    };
  }

  if (result === 'WRONG') {
    return {
      text: '제출 반려',
      icon: '/icons/submit_absent.svg',
      style: 'text-neutral-30 text-[13px]',
    };
  }

  if ((status === 'UPDATED' && result === 'PASS') || status === 'LATE') {
    return {
      text: '지각 제출',
      style: 'text-neutral-30 text-[13px]',
      icon: '/icons/submit_late.svg',
    };
  }

  if (status === 'ABSENT') {
    return absent;
  }

  return {
    text: '제출 성공',
    icon: '/icons/submit_success.svg',
    style: 'text-primary-90 text-sm',
  };
};

// 테이블 컴포넌트에 사용 (SAVE: 1번 이상 저장한 행, INSERT: 새로 추가한 행)
export const TABLE_STATUS = {
  SAVE: 0,
  INSERT: 1,
} as const;

export const TABLE_CONTENT = {
  INPUT: 0,
  DROPDOWN: 1,
  DATE: 2,
  DATETIME: 3,
} as const;

export const getKeyByValue = (obj: any, value: string) => {
  return Object.keys(obj).find((key) => obj[key] === value);
};

export const blogCategory: Record<string, string> = {
  JOB_PREPARATION_TIPS: '취준 TIP ',
  PROGRAM_REVIEWS: '프로그램 후기',
  LETSCAREER_NEWS: '렛츠커리어 소식',
  CAREER_STORIES: '취뽀 & 근무 후기',
};

export const convertCurationLocationTypeToText = (
  locationType: CurationLocationType,
) => {
  switch (locationType) {
    case 'UNDER_BANNER':
      return '배너 하단';
    case 'UNDER_REVIEW':
      return '리뷰 하단';
    case 'UNDER_BLOG':
      return '블로그 하단';
    default:
      return '-';
  }
};

export const convertCurationTypeToText = (type: CurationType | null) => {
  switch (type) {
    case 'CHALLENGE':
      return '챌린지';
    case 'LIVE':
      return '라이브';
    case 'VOD':
      return 'VOD';
    case 'REPORT':
      return '서류 진단';
    case 'BLOG':
      return '블로그';
    case 'ETC':
      return '기타';
    default:
      return '';
  }
};

export const challengePricePlanToText: Record<ChallengePricePlan, string> = {
  BASIC: '베이직',
  STANDARD: '스탠다드',
  PREMIUM: '프리미엄',
};
