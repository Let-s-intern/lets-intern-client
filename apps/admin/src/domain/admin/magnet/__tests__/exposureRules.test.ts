import { describe, expect, it } from 'vitest';

import {
  isMagnetApplyManageable,
  isMagnetExposureLocked,
  isMagnetMyPageManageable,
} from '../types';

describe('마그넷 노출 체크박스 적용 범위', () => {
  it('신청 가능은 출시알림만 해당 없음이다 — 서버가 출시알림 구독은 늘 받는다', () => {
    expect(isMagnetApplyManageable('LAUNCH_ALERT')).toBe(false);
    expect(isMagnetApplyManageable('EVENT')).toBe(true);
    expect(isMagnetApplyManageable('MATERIAL')).toBe(true);
  });

  it('마이페이지 노출은 이벤트만 해당 없음이다 — 이벤트는 MY 자료집·마이페이지에 나오지 않는다', () => {
    expect(isMagnetMyPageManageable('EVENT')).toBe(false);
    expect(isMagnetMyPageManageable('LAUNCH_ALERT')).toBe(true);
    expect(isMagnetMyPageManageable('VOD')).toBe(true);
  });

  it('상세 접속이 꺼지면 상세로 이어지는 노출을 잠근다. 출시알림은 예외', () => {
    expect(
      isMagnetExposureLocked({ type: 'MATERIAL', isAccessible: false }),
    ).toBe(true);
    expect(
      isMagnetExposureLocked({ type: 'MATERIAL', isAccessible: true }),
    ).toBe(false);
    expect(
      isMagnetExposureLocked({ type: 'LAUNCH_ALERT', isAccessible: false }),
    ).toBe(false);
  });
});
