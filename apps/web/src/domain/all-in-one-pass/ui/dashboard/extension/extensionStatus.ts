// 패스 연장 상태 — 연장 창(만료 7일 전 ~ 만료 +1일) 판정 · 대시보드 뱃지 · 팝업/모달 헤더 문구.
import dayjs from '@/lib/dayjs';

export interface ExtensionStatus {
  daysLeft: number;
  isEnded: boolean;
  canExtend: boolean;
  badge: '종료 예정' | '오늘까지 연장 가능' | null;
}

export const getExtensionStatus = (endDate: string): ExtensionStatus => {
  const daysLeft = dayjs(endDate)
    .startOf('day')
    .diff(dayjs().startOf('day'), 'day');
  const isEnded = daysLeft < 0;
  const canExtend = daysLeft >= -1 && daysLeft <= 7;
  let badge: ExtensionStatus['badge'] = null;
  if (daysLeft >= 0 && daysLeft <= 7) badge = '종료 예정';
  else if (daysLeft === -1) badge = '오늘까지 연장 가능';
  return { daysLeft, isEnded, canExtend, badge };
};

// 팝업·모달 헤더 문구 — 만료 전 / 종료 후로 분기
export const getExtensionCopy = (passTitle: string, endDate: string) => {
  const { isEnded, daysLeft } = getExtensionStatus(endDate);
  if (isEnded) {
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
