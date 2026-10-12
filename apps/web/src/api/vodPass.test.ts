/*
  `@/utils/axios` 는 jest 가 파싱하지 못하는 모듈을 끌고 오므로 네트워크 계층은 목으로 막는다.
  검사 대상은 응답 파싱과 요청 경로다.
*/
jest.mock('@/utils/axios', () => ({
  __esModule: true,
  default: { get: jest.fn() },
}));

import axios from '@/utils/axios';
import {
  UseVodPassQueryKey,
  vodPassListQueryOptions,
  vodPassListSchema,
} from './vodPass';

const basePass = {
  applicationId: 31,
  paymentId: 901,
  startsAt: null,
  endsAt: null,
  status: 'UNACTIVATED',
  paidAmount: 29000,
  refundable: true,
  durationDays: 30,
};

describe('vodPassListSchema (LC-3438)', () => {
  it.each(['UNACTIVATED', 'SCHEDULED', 'ACTIVE', 'EXPIRED', 'CANCELED'])(
    '상태 %s 를 그대로 파싱한다',
    (status) => {
      const parsed = vodPassListSchema.parse({
        passes: [{ ...basePass, status }],
      });

      expect(parsed.passes[0].status).toBe(status);
    },
  );

  it('활성화 전 이용권은 startsAt, endsAt 이 null 이어도 파싱한다', () => {
    const parsed = vodPassListSchema.parse({ passes: [basePass] });

    expect(parsed.passes[0].startsAt).toBeNull();
    expect(parsed.passes[0].endsAt).toBeNull();
    expect(parsed.passes[0].refundable).toBe(true);
  });

  it('활성화된 이용권은 기간을 문자열로 받는다', () => {
    const parsed = vodPassListSchema.parse({
      passes: [
        {
          ...basePass,
          status: 'ACTIVE',
          startsAt: '2026-10-12T10:00:00',
          endsAt: '2026-11-11T10:00:00',
          refundable: false,
        },
      ],
    });

    expect(parsed.passes[0].endsAt).toBe('2026-11-11T10:00:00');
    expect(parsed.passes[0].refundable).toBe(false);
  });

  it('모르는 상태가 있어도 목록 전체가 실패하지 않고 UNKNOWN 이 된다', () => {
    const parsed = vodPassListSchema.parse({
      passes: [basePass, { ...basePass, applicationId: 32, status: 'PAUSED' }],
    });

    expect(parsed.passes.map((pass) => pass.status)).toEqual([
      'UNACTIVATED',
      'UNKNOWN',
    ]);
  });

  it('refundable 이 없으면 환불할 수 없는 것으로 본다', () => {
    const { refundable: _refundable, ...withoutRefundable } = basePass;

    const parsed = vodPassListSchema.parse({ passes: [withoutRefundable] });

    expect(parsed.passes[0].refundable).toBe(false);
  });
});

describe('vodPassListQueryOptions (LC-3438)', () => {
  it('GET /vod-pass 응답의 data 를 파싱한다', async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: { data: { passes: [basePass] } },
    });

    const result = await vodPassListQueryOptions.queryFn();

    expect(axios.get).toHaveBeenCalledWith('/vod-pass');
    expect(result.passes).toHaveLength(1);
    expect(vodPassListQueryOptions.queryKey).toEqual([UseVodPassQueryKey]);
  });
});
