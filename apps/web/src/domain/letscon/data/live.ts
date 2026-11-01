export type LetsconLiveKind = 'online' | 'offline';

const toLiveId = (value: string | undefined) => {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
};

// 라이브 ID 는 환경마다 다르다. 값이 없으면 null 이고 해당 버튼은 신청 불가 상태가 된다
export const LETSCON_LIVE_IDS: Record<LetsconLiveKind, number | null> = {
  online: toLiveId(process.env.NEXT_PUBLIC_LETSCON_ONLINE_LIVE_ID),
  offline: toLiveId(process.env.NEXT_PUBLIC_LETSCON_OFFLINE_LIVE_ID),
};
