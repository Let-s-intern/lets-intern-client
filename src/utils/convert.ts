export const challengeTopicToText: Record<string, string> = {
  ALL: '전체',
  MARKETING: '마케팅',
  DEVELOPMENT: '개발',
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
};

export const wishJobToText: any = {
  MARKETING_BRAND: '브랜드 마케팅',
  MARKETING_PERFORMANCE: '퍼포먼스 마케팅',
  MARKETING_CRM: 'CRM 마케팅',
  MARKETING_CONTENTS: '콘텐츠 마케팅',
  MARKETING_PR: '홍보 PR',
  MARKETING_AE: '광고대행사(AE)',
  MARKETING_ALL: '마케팅 직군 기타',

  DEVELOPMENT_FRONTEND: '프론트엔드',
  DEVELOPMENT_BACKEND: '백엔드',
  DEVELOPMENT_APP: '앱개발',
  DEVELOPMENT_DATA: '데이터 분석',
  DEVELOPMENT_AI: '인공지능/머신러닝',
  DEVELOPMENT_ALL: '개발 직군 기타',

  ALL: '기타',
};

export const wishJobToTextForSorting: any = {
  ALL: '전체',

  MARKETING_BRAND: '브랜드 마케팅',
  MARKETING_PERFORMANCE: '퍼포먼스 마케팅',
  MARKETING_CRM: 'CRM 마케팅',
  MARKETING_CONTENTS: '콘텐츠 마케팅',
  MARKETING_PR: '홍보 PR',
  MARKETING_AE: '광고대행사(AE)',
  MARKETING_ALL: '마케팅 직군 전체',

  DEVELOPMENT_FRONTEND: '프론트엔드',
  DEVELOPMENT_BACKEND: '백엔드',
  DEVELOPMENT_APP: '앱개발',
  DEVELOPMENT_DATA: '데이터 분석',
  DEVELOPMENT_AI: '인공지능/머신러닝',
  DEVELOPMENT_ALL: '개발 직군 전체',
};

export const topicRequiredToText: any = {
  EXPERIENCE: '경험정리',
  JOB: '직무탐색',
  CONCEPT: '컨셉잡기',
  DOCUMENT: '서류작성',
  RECRUITMENT: '공고분석',
  APPLY: '지원하기',
};
export const topicToText: any = {
  ...topicRequiredToText,
  NULL: '없음',
};

export const missionTypeToText: any = {
  GENERAL: '일반',
  ADDITIONAL: '제한 컨텐츠',
  REFUND: '보증금',
};

export const contentsTypeToText: any = {
  ESSENTIAL: '필수',
  ADDITIONAL: '추가',
  LIMITED: '제한',
};

export const missionStatusToText: any = {
  WAITING: '대기',
  CHECK_DONE: '확인완료',
  REFUND_DONE: '환급완료',
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
};

export const missionSubmitToBadge = ({
  status,
  result,
  isRefunded,
}: {
  status: string;
  result: string;
  isRefunded: string;
}) => {
  if (status === 'ABSENT') {
    return {
      text: '결석',
      style: 'bg-[#E3E3E3] text-[#9B9B9B]',
    };
  }

  if (result === 'WAITING') {
    return {
      text: '확인중',
      style: 'bg-[#FFFACD] text-[#D3CB00]',
    };
  }

  if (result === 'WRONG') {
    return {
      text: '반려',
      style: 'bg-[#E3E3E3] text-[#9B9B9B]',
    };
  }

  if (status === 'LATE' || (status === 'UPDATED' && result === 'PASS')) {
    return {
      text: '지각',
      style: 'bg-[#E3E3E3] text-[#9B9B9B]',
    };
  }

  if (isRefunded) {
    return {
      text: '환급완료',
      style: 'text-primary bg-[#E7E6FD]',
    };
  }

  return {
    text: '확인완료',
    style: 'text-primary bg-[#E7E6FD]',
  };
};
