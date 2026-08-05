import { describe, expect, it } from 'vitest';

import { buildRefundConfirmSentence } from '../refundConfirm';

describe('buildRefundConfirmSentence', () => {
  it('전액이면 금액을 적지 않는다', () => {
    expect(
      buildRefundConfirmSentence({ isFullRefund: true, refundAmount: 330000 }),
    ).toBe(
      '이 유저를 전체 환불 시킵니다. 이 유저는 대시보드에 입장할 수 없습니다.',
    );
  });

  it('부분이면 금액을 문장에 넣는다', () => {
    expect(
      buildRefundConfirmSentence({ isFullRefund: false, refundAmount: 220000 }),
    ).toBe(
      '이 유저에게 220,000원을 환불합니다. 이 유저는 대시보드에 입장할 수 없습니다.',
    );
  });

  it('부분 환불도 참여를 끝내므로 뒷문장이 같다', () => {
    const full = buildRefundConfirmSentence({
      isFullRefund: true,
      refundAmount: 330000,
    });
    const partial = buildRefundConfirmSentence({
      isFullRefund: false,
      refundAmount: 220000,
    });

    expect(full).toContain('이 유저는 대시보드에 입장할 수 없습니다.');
    expect(partial).toContain('이 유저는 대시보드에 입장할 수 없습니다.');
  });

  it('금액이 바뀌면 문장도 바뀐다', () => {
    const a = buildRefundConfirmSentence({
      isFullRefund: false,
      refundAmount: 220000,
    });
    const b = buildRefundConfirmSentence({
      isFullRefund: false,
      refundAmount: 100000,
    });

    expect(a).not.toBe(b);
  });
});
