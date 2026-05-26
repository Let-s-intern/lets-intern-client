import {
  BLOG_POPUP_HIDE_UNTIL,
  BLOG_POPUP_SHOWN,
  POPUP_HIDE_DURATION_MS,
} from './data/newsletter';
import { canShowPopup, hidePopupForDay, markPopupShown } from './popupGate';

describe('popupGate', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
  });

  describe('canShowPopup', () => {
    it('깨끗한 상태면 노출 허용', () => {
      expect(canShowPopup()).toBe(true);
    });

    it('세션에 SHOWN 기록이 있으면 미노출 (세션당 1회)', () => {
      window.sessionStorage.setItem(BLOG_POPUP_SHOWN, 'true');
      expect(canShowPopup()).toBe(false);
    });

    it('HIDE_UNTIL이 미래면 미노출 (하루 동안 보지 않기 유효)', () => {
      window.localStorage.setItem(
        BLOG_POPUP_HIDE_UNTIL,
        String(Date.now() + 10_000),
      );
      expect(canShowPopup()).toBe(false);
    });

    it('HIDE_UNTIL이 과거면 다시 노출 허용', () => {
      window.localStorage.setItem(
        BLOG_POPUP_HIDE_UNTIL,
        String(Date.now() - 10_000),
      );
      expect(canShowPopup()).toBe(true);
    });
  });

  describe('markPopupShown', () => {
    it('SHOWN 플래그를 기록하고 이후 노출을 차단한다', () => {
      markPopupShown();
      expect(window.sessionStorage.getItem(BLOG_POPUP_SHOWN)).toBe('true');
      expect(canShowPopup()).toBe(false);
    });
  });

  describe('hidePopupForDay', () => {
    it('약 24시간 뒤 타임스탬프를 기록하고 이후 노출을 차단한다', () => {
      const before = Date.now();
      hidePopupForDay();

      const stored = Number(
        window.localStorage.getItem(BLOG_POPUP_HIDE_UNTIL),
      );
      expect(stored).toBeGreaterThanOrEqual(before + POPUP_HIDE_DURATION_MS);
      expect(canShowPopup()).toBe(false);
    });
  });
});
