import { describe, expect, it } from 'vitest';

import { buildRefundConfirmSentence } from '../refundConfirm';

describe('buildRefundConfirmSentence', () => {
  it('전액 + 삭제 끔', () => {
    expect(
      buildRefundConfirmSentence({
        isFullRefund: true,
        refundAmount: 330000,
        hardDelete: false,
      }),
    ).toBe(
      '이 유저를 전체 환불 시킵니다. 이 유저는 대시보드에 입장할 수 없습니다.',
    );
  });

  it('부분 + 삭제 끔', () => {
    expect(
      buildRefundConfirmSentence({
        isFullRefund: false,
        refundAmount: 220000,
        hardDelete: false,
      }),
    ).toBe(
      '이 유저에게 220,000원을 환불합니다. 이 유저는 대시보드에 입장할 수 없습니다.',
    );
  });

  it('전액 + 삭제 켬', () => {
    expect(
      buildRefundConfirmSentence({
        isFullRefund: true,
        refundAmount: 330000,
        hardDelete: true,
      }),
    ).toBe(
      '이 유저를 전체 환불하고 제출한 미션까지 완전히 삭제합니다. 되돌릴 수 없습니다.',
    );
  });

  it('부분 + 삭제 켬', () => {
    expect(
      buildRefundConfirmSentence({
        isFullRefund: false,
        refundAmount: 220000,
        hardDelete: true,
      }),
    ).toBe(
      '이 유저에게 220,000원을 환불하고 제출한 미션까지 완전히 삭제합니다. 되돌릴 수 없습니다.',
    );
  });

  it('네 갈래가 서로 겹치지 않는다', () => {
    // 문구만 바뀌고 입력값이 같으면 습관적으로 통과한다.
    const sentences = [
      { isFullRefund: true, hardDelete: false },
      { isFullRefund: false, hardDelete: false },
      { isFullRefund: true, hardDelete: true },
      { isFullRefund: false, hardDelete: true },
    ].map((input) =>
      buildRefundConfirmSentence({ ...input, refundAmount: 220000 }),
    );

    expect(new Set(sentences).size).toBe(4);
  });

  it('삭제를 끈 두 문장의 뒷부분은 같다', () => {
    // 부분 환불도 참여를 끝낸다.
    const full = buildRefundConfirmSentence({
      isFullRefund: true,
      refundAmount: 330000,
      hardDelete: false,
    });
    const partial = buildRefundConfirmSentence({
      isFullRefund: false,
      refundAmount: 220000,
      hardDelete: false,
    });

    expect(full).toContain('이 유저는 대시보드에 입장할 수 없습니다.');
    expect(partial).toContain('이 유저는 대시보드에 입장할 수 없습니다.');
  });

  it('금액이 바뀌면 문장도 바뀐다', () => {
    const a = buildRefundConfirmSentence({
      isFullRefund: false,
      refundAmount: 220000,
      hardDelete: false,
    });
    const b = buildRefundConfirmSentence({
      isFullRefund: false,
      refundAmount: 100000,
      hardDelete: false,
    });

    expect(a).not.toBe(b);
  });
});
