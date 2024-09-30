/**
 * Limiter 클래스
 *
 * 이 클래스는 일정 시간 동안의 요청 수를 제한하는 기능을 제공합니다.
 * 주로 API 요청 제한이나 DDoS 공격 방지 등에 사용될 수 있습니다.
 *
 * 동작 방식:
 * - 10초 동안 최대 10개의 요청만을 허용합니다.
 * - 각 요청의 시간을 기록하고, 10초가 지난 요청은 기록에서 제거합니다.
 * - 현재 시점에서 10초 이내의 요청 수가 10개를 초과하면 새로운 요청을 거부합니다.
 *
 * 주의: 이 클래스는 메모리 내에서 동작하므로, 서버 재시작 시 기록이 초기화됩니다.
 *       분산 환경에서는 추가적인 동기화 메커니즘이 필요할 수 있습니다.
 */
export class Limiter {
  private requests: number[] = [];
  private readonly limit: number = 10;
  private readonly timeWindow: number = 10000; // 10초를 밀리초로 표현

  check(): boolean {
    const now = Date.now();
    this.requests = this.requests.filter(
      (time) => now - time < this.timeWindow,
    );
    this.requests.push(now);

    if (this.requests.length > this.limit) {
      this.requests.pop();
      return false;
    }

    return true;
  }
}
