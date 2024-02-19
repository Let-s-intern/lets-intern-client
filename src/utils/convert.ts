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
  ADDITIONAL: '추가 컨텐츠',
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

export const missionSubmitToBadge = (mission: any) => {
  const {
    attendanceStatus: status,
    attendanceResult: result,
    missionType,
  } = mission;
  const isRefundMission = missionType === 'REFUND';

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

  if (result === 'PASS' && status === 'CREATED') {
    return {
      text: isRefundMission ? '환급완료' : '확인완료',
      style: 'text-primary bg-[#E7E6FD]',
    };
  }

  return {
    text: '반려',
    style: 'bg-[#E3E3E3] text-[#9B9B9B]',
  };
};
