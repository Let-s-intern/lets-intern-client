// 패스 연장 상태 — 연장 창(만료 7일 전 ~ min(만료+1일, 판매종료일)) 판정 · 뱃지 · 헤더 문구.
// 노출용 계산(실제 연장 차단은 BE POST /extension). 규칙 변경 시 BE 상수와 맞출 것.
import dayjs from '@/lib/dayjs';

const DAYS_BEFORE_END = 7;
const DAYS_AFTER_END = 1;

export interface ExtensionStatus {
  daysLeft: number;
  isEnded: boolean;
  canExtend: boolean;
  badge: '종료 예정' | '오늘까지 연장 가능' | null;
}

const diffDays = (endDate: string) =>
  dayjs(endDate).startOf('day').diff(dayjs().startOf('day'), 'day');

/** 연장 창 = 만료 7일 전 ~ min(만료+1일, 판매종료일). 종료 여부·뱃지도 파생. */
export const getExtensionStatus = (
  endDate: string,
  deadline?: string | null,
): ExtensionStatus => {
  const today = dayjs().startOf('day');
  const end = dayjs(endDate).startOf('day');
  const daysLeft = end.diff(today, 'day');
  const isEnded = daysLeft < 0;

  const windowStart = end.subtract(DAYS_BEFORE_END, 'day');
  const endPlus = end.add(DAYS_AFTER_END, 'day');
  const cap = deadline ? dayjs(deadline).startOf('day') : null;
  const windowEnd = cap && cap.isBefore(endPlus) ? cap : endPlus; // 판매종료일 상한
  const canExtend = !today.isBefore(windowStart) && !today.isAfter(windowEnd);

  const badge: ExtensionStatus['badge'] = canExtend
    ? isEnded
      ? '오늘까지 연장 가능'
      : '종료 예정'
    : null;
  return { daysLeft, isEnded, canExtend, badge };
};

// 팝업·모달 헤더 문구 — 만료 전 / 종료 후로 분기
export const getExtensionCopy = (passTitle: string, endDate: string) => {
  const daysLeft = diffDays(endDate);
  if (daysLeft < 0) {
    return {
      title: `${passTitle} 이용 기간이 종료되었어요.`,
      line1: '계속 이용하고 싶다면,',
      line2: '오늘까지 기간을 연장할 수 있어요.',
    };
  }
  return {
    title: `${passTitle} 이용 기간이 ${daysLeft}일 남았어요.`,
    line1: '아직 준비 중인 과정이 있다면,',
    line2: '패스를 연장하고 계속 이용해 보세요.',
  };
};
