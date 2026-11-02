const toId = (value: string | undefined) => {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
};

// ID 는 환경마다 다르다. 값이 없으면 null 이고 해당 신청은 불가 상태가 된다
export const LETSCON_OFFLINE_LIVE_ID = toId(
  process.env.NEXT_PUBLIC_LETSCON_OFFLINE_LIVE_ID,
);

/** 온라인 신청은 모두 이 마그넷에 저장한다 */
export const LETSCON_MAGNET_ID = toId(
  process.env.NEXT_PUBLIC_LETSCON_MAGNET_ID,
);
