import { BasePage } from './BasePage';
import { waitForAnchor } from '../support/settle';
import { log } from '../support/log';
import { MypagePage } from './MypagePage';

/**
 * 결제 결과 Page Object.
 *
 * 결제 직후 도달 가능 라우트:
 *   - /order/result   (성공 페이지)
 *   - /library        (자동 보관함 진입)
 *   - 기타            (BE 응답에 따라 다양)
 *
 * 본 spec 의 최종 검증은 마이페이지에서 수행하므로,
 * 결제 직후 페이지의 성공 메시지 검증은 soft (없으면 경고만) — 실패 안 시킴.
 */
export class OrderResultPage extends BasePage {
  async waitForLoaded(extraMs = 0): Promise<this> {
    // /order/result, /library 외 다른 경로일 수도 있으므로 url 매칭 soft.
    await this.page
      .waitForURL(/\/order\/result|\/library/, { timeout: 30_000 })
      .catch(() => {
        log(
          `    [OrderResultPage] /order/result 또는 /library 미도달 — 현재 url=${this.page.url()}`,
        );
      });
    // 성공 안내 텍스트 동적 대기 (있으면).
    await waitForAnchor(
      this.page,
      [
        'text=/결제\\s*완료|주문\\s*완료|신청\\s*완료|성공/',
        'text=/내\\s*라이브러리|학습\\s*시작/',
      ],
      8_000,
    );
    if (extraMs > 0) await this.settle(extraMs);
    return this;
  }

  /**
   * 결제 직후 성공 안내 soft 검증.
   * 메시지 보이면 로그, 안 보이면 경고 (실패 X — 마이페이지에서 최종 검증).
   */
  async softCheckSuccess(): Promise<this> {
    const successVisible = await this.page
      .getByText(/결제\s*완료|주문\s*완료|신청\s*완료|성공/i)
      .or(this.page.getByText(/내\s*라이브러리|학습\s*시작/i))
      .first()
      .isVisible({ timeout: 5_000 })
      .catch(() => false);

    if (successVisible) {
      log('    [OrderResultPage] 결제 성공 안내 텍스트 감지 OK');
    } else {
      log(
        `    [OrderResultPage] 성공 안내 텍스트 미감지 (url=${this.page.url()}) — 마이페이지에서 최종 확인`,
      );
    }
    return this;
  }

  /** 마이페이지로 이동 -> 신청 결과 검증을 그쪽으로 위임. */
  async goToMypage(extraMs?: number): Promise<MypagePage> {
    const mypage = new MypagePage(this.page);
    await mypage.goto(extraMs);
    return mypage;
  }
}
