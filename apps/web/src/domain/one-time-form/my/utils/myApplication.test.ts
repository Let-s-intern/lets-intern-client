import {
  buildStatusNotice,
  calculateBasePrice,
  deriveMyApplicationStatus,
  formatAnswerValue,
  formatDotDateTime,
} from './myApplication';

const base = {
  applicationId: 1042,
  createDate: '2026-11-02T13:24:00',
  isCanceled: false,
  canceledAt: null,
  isCancelable: true,
  cancelDeadline: '2026-11-10T23:59:59',
  name: '김렛커',
  email: 'letscareer@example.com',
  phoneNum: '010-1234-5678',
  selectedOptions: [],
  payment: null,
  answerItems: [],
};

describe('deriveMyApplicationStatus', () => {
  it('신청이 없으면 NONE', () => {
    expect(deriveMyApplicationStatus(null)).toBe('NONE');
  });

  it('마감 전이면 CANCELABLE', () => {
    expect(deriveMyApplicationStatus(base)).toBe('CANCELABLE');
  });

  it('마감이 지났으면 PAST_DEADLINE', () => {
    expect(deriveMyApplicationStatus({ ...base, isCancelable: false })).toBe(
      'PAST_DEADLINE',
    );
  });

  it('취소했으면 isCancelable 과 상관없이 CANCELED', () => {
    expect(
      deriveMyApplicationStatus({
        ...base,
        isCanceled: true,
        isCancelable: false,
        canceledAt: '2026-11-03T14:02:00',
      }),
    ).toBe('CANCELED');
  });
});

describe('calculateBasePrice', () => {
  it('결제액에서 옵션 추가 금액 합을 뺀다(신청 1042: 49000 - 0 - 20000)', () => {
    expect(
      calculateBasePrice(49000, [
        { additionalPrice: 0 },
        { additionalPrice: 20000 },
      ]),
    ).toBe(29000);
  });

  it('옵션이 없으면 결제액 그대로', () => {
    expect(calculateBasePrice(29000, [])).toBe(29000);
  });
});

describe('formatAnswerValue', () => {
  it('문자열은 그대로', () => {
    expect(formatAnswerValue('프론트엔드')).toBe('프론트엔드');
  });

  it('배열은 쉼표로 잇는다', () => {
    expect(formatAnswerValue(['월', '수'])).toBe('월, 수');
  });

  it('숫자는 그대로', () => {
    expect(formatAnswerValue(18)).toBe('18');
  });

  it('첨부는 파일명만', () => {
    expect(
      formatAnswerValue({
        key: 'one-time-form/attachment/7/0b5c.pdf',
        name: '김렛커_이력서_최종.pdf',
      }),
    ).toBe('김렛커_이력서_최종.pdf');
  });
});

describe('formatDotDateTime', () => {
  it('날짜와 시:분', () => {
    expect(formatDotDateTime('2026-11-02T13:24:00')).toBe('2026.11.02 13:24');
  });
});

describe('buildStatusNotice', () => {
  const paid = {
    ...base,
    payment: { paidAmount: 49000, refundAmount: 0, paymentMethod: '카드' },
  };

  it('취소 가능: 마감 일시와 전액 환불 안내', () => {
    expect(buildStatusNotice(paid)).toBe(
      '11.10(화) 23:59까지 취소할 수 있어요. 취소하면 결제 금액 전액을 돌려드려요.',
    );
  });

  it('무료 폼은 환불 문장을 뺀다', () => {
    expect(buildStatusNotice(base)).toBe(
      '11.10(화) 23:59까지 취소할 수 있어요.',
    );
  });

  it('마감 후: 직접 취소 불가 안내', () => {
    expect(buildStatusNotice({ ...paid, isCancelable: false })).toBe(
      '취소 기간(11.10까지)이 지나 직접 취소할 수 없어요. 사정이 있으면 채널톡으로 문의해 주세요.',
    );
  });

  it('취소됨: 취소 일시와 환불 금액(신청 1043)', () => {
    expect(
      buildStatusNotice({
        ...base,
        isCanceled: true,
        isCancelable: false,
        canceledAt: '2026-11-03T14:02:00',
        payment: {
          paidAmount: 39000,
          refundAmount: 39000,
          paymentMethod: '카드',
        },
      }),
    ).toBe(
      '2026.11.03 14:02에 취소했어요. 39,000원을 결제한 수단으로 돌려드려요.',
    );
  });
});
