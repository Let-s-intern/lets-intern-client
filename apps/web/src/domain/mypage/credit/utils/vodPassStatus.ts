import type { VodPass } from '@/api/vodPass';
import dayjs from '@/lib/dayjs';

export interface VodPassInfoRow {
  label: string;
  value: string;
}

const formatDate = (date: string) => dayjs(date).format('YYYY.MM.DD');

/** 이용 기간. 시작·종료 시각이 모두 있어야 보여준다. */
const getPeriodRows = (pass: VodPass): VodPassInfoRow[] =>
  pass.startsAt && pass.endsAt
    ? [
        {
          label: '이용 기간',
          value: `${formatDate(pass.startsAt)} ~ ${formatDate(pass.endsAt)}`,
        },
      ]
    : [];

/** 구매한 기간. 개월 수가 없던 시절의 구매는 일수만 보여준다. */
const getPurchasedRows = (pass: VodPass): VodPassInfoRow[] => {
  if (pass.purchasedMonths && pass.durationDays) {
    return [
      {
        label: '구매 기간',
        value: `${pass.purchasedMonths}개월 (${pass.durationDays}일)`,
      },
    ];
  }
  if (pass.durationDays) {
    return [{ label: '구매 기간', value: `${pass.durationDays}일` }];
  }
  return [];
};

/**
 * 결제 상세의 프로그램 정보에 그리는 이용권 상태·기간 (LC-3438).
 * 상태는 서버가 조회 시각 기준으로 계산해 준다. 모르는 상태는 빈 목록이라 상태 영역이 그려지지 않는다.
 */
export function getVodPassInfoRows(pass: VodPass): VodPassInfoRow[] {
  switch (pass.status) {
    case 'UNACTIVATED':
      return [
        { label: '이용권 상태', value: '이용 시작 전' },
        ...getPurchasedRows(pass),
      ];
    case 'SCHEDULED':
      return [
        { label: '이용권 상태', value: '이용 시작 예정' },
        ...getPeriodRows(pass),
        ...getPurchasedRows(pass),
      ];
    case 'ACTIVE':
      return [
        { label: '이용권 상태', value: '이용 중' },
        ...getPeriodRows(pass),
        ...getPurchasedRows(pass),
      ];
    case 'EXPIRED':
      return [
        { label: '이용권 상태', value: '이용 기간이 종료되었습니다' },
        ...getPeriodRows(pass),
        ...getPurchasedRows(pass),
      ];
    case 'CANCELED':
      return [{ label: '이용권 상태', value: '취소된 이용권입니다' }];
    default:
      return [];
  }
}
