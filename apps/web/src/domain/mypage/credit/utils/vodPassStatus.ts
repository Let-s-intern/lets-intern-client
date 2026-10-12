import type { VodPass } from '@/api/vodPass';
import dayjs from '@/lib/dayjs';

export interface VodPassInfoRow {
  label: string;
  value: string;
}

const formatDate = (date: string) => dayjs(date).format('YYYY.MM.DD');

/**
 * 결제 상세의 프로그램 정보에 그리는 이용권 상태·기간 (LC-3438).
 * 모르는 상태는 빈 목록이라 상태 영역이 그려지지 않는다.
 */
export function getVodPassInfoRows(pass: VodPass): VodPassInfoRow[] {
  switch (pass.status) {
    case 'UNACTIVATED':
      return [
        {
          label: '이용권 상태',
          value: pass.durationDays
            ? `아직 활성화하지 않았습니다. VOD 사이트에서 활성화하면 ${pass.durationDays}일 동안 시청할 수 있습니다`
            : '아직 활성화하지 않았습니다. VOD 사이트에서 활성화하면 시청할 수 있습니다',
        },
      ];
    case 'SCHEDULED':
      return [
        { label: '이용권 상태', value: '이용 시작 예정' },
        ...(pass.startsAt
          ? [{ label: '이용 시작일', value: formatDate(pass.startsAt) }]
          : []),
      ];
    case 'ACTIVE':
      return [
        { label: '이용권 상태', value: '이용 중' },
        ...(pass.endsAt
          ? [{ label: '이용 종료일', value: formatDate(pass.endsAt) }]
          : []),
      ];
    case 'EXPIRED':
      return [{ label: '이용권 상태', value: '이용 기간이 종료되었습니다' }];
    case 'CANCELED':
      return [{ label: '이용권 상태', value: '취소된 이용권입니다' }];
    default:
      return [];
  }
}
