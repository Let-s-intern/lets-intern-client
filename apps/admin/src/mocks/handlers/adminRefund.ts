import { http, HttpResponse } from 'msw';

import type { AdminRefundLog } from '@/api/adminRefund';
import { seedRefundLogs, seedUserRefunds } from '../seed/adminRefund';

/**
 * 어드민 환불 MSW 핸들러.
 *
 * axios 응답 본문이 `{ data: <payload> }` 엔벨로프(`res.data.data`)이므로 모두 `{ data }` 로 감싼다.
 * 경로는 `VITE_SERVER_API` 와 프록시를 고려해 와일드카드로 매칭한다.
 *
 * 실행 결과가 다음 조회에 반영되도록 시드를 mutable 로 둔다. 환불 버튼을 누른 뒤
 * 히스토리에 새 줄이 생기고 참여자 목록 라벨이 `어드민 전체 환불` 또는 `어드민 부분 환불` 로
 * 바뀌는 흐름을 재현한다.
 */

const BASE = '*/api/v1';

let refundLogs: AdminRefundLog[] = [...seedRefundLogs];

/** 이미 환불된 신청서를 다시 누르면 서버가 409 를 준다. 그 동작도 재현한다. */
const alreadyRefunded = (applicationId: number) =>
  refundLogs.some((log) => log.applicationId === applicationId);

/**
 * 참여자 목록 목.
 *
 * 환불여부 라벨 다섯 갈래와 버튼 비활성 두 갈래를 한 화면에서 확인할 수 있게 구성한다.
 * 서버는 취소 건도 함께 내려주므로(어드민 조회에는 isCanceled 필터가 없다) 여기서도 섞어 둔다.
 */
const mockApplication = (over: Record<string, unknown>) => ({
  id: 0,
  paymentId: 1,
  name: '홍길동',
  email: 'hong@example.com',
  phoneNum: '010-0000-0000',
  couponName: null,
  couponDiscount: null,
  isCanceled: false,
  createDate: '2026-07-20T10:00:00',
  orderId: 'letsMOCK0001',
  finalPrice: 330000,
  programDiscount: 15000,
  programPrice: 345000,
  refundPrice: 30000,
  challengePricePlanType: 'BASIC',
  originalPrice: null,
  ...over,
});

const mockApplications = [
  // 정상 — 환불 버튼 활성
  mockApplication({ id: 5001, name: '박서현', orderId: 'letsBX385104' }),
  mockApplication({ id: 5009, name: '이전액', orderId: 'letsQW771208' }),
  // 100% 할인 쿠폰 — 0원 결제. 전체 환불만 되고 부분 환불은 비활성이다
  mockApplication({
    id: 5002,
    name: '안한나',
    orderId: 'letsip113875',
    couponName: '렛츠커리어 2026 하반기 멤버십 구매자 전용 쿠폰',
    couponDiscount: -1,
    finalPrice: 0,
  }),
  // 어드민 전체 환불 — 히스토리 로그에 applicationId 5003 이 있다
  mockApplication({
    id: 5003,
    name: '김채원',
    isCanceled: true,
    finalPrice: 330000,
    originalPrice: 330000,
  }),
  // 유저 전체 환불 — 로그 없음 + 환불액 === 원 결제액
  mockApplication({
    id: 5004,
    name: '이유저',
    isCanceled: true,
    finalPrice: 330000,
    originalPrice: 330000,
  }),
  // 유저 부분 환불 — 환불액 < 원 결제액
  mockApplication({
    id: 5005,
    name: '최부분',
    isCanceled: true,
    finalPrice: 220000,
    originalPrice: 330000,
  }),
  // 어드민 테스트 참여 — 0원 결제라 전체 환불로 취소할 수 있다
  mockApplication({
    id: 5006,
    name: '테스트참여',
    orderId: 'TEST_CHALLENGE_5006',
    finalPrice: 0,
  }),
  // 고아 신청서 — 이름이 비어 버튼 비활성
  mockApplication({
    id: 5007,
    name: null,
    email: null,
    phoneNum: null,
    orderId: null,
    finalPrice: null,
    challengePricePlanType: null,
  }),
  // 어드민 부분 환불 — 히스토리 로그에 applicationId 5008 이 있다
  mockApplication({
    id: 5008,
    name: '정부분',
    isCanceled: true,
    finalPrice: 220000,
    originalPrice: 330000,
  }),
];

/** 상한 검증에 쓰는 실결제액. 서버는 payment.finalPrice 로 같은 검증을 한다. */
const finalPriceOf = (applicationId: number) =>
  mockApplications.find((application) => application.id === applicationId)
    ?.finalPrice ?? null;

export const adminRefundHandlers = [
  http.post(
    `${BASE}/admin/application/:applicationId/refund`,
    async ({ params, request }) => {
      const applicationId = Number(params.applicationId);
      const body = (await request.json().catch(() => null)) as {
        managerName?: string;
        reason?: string;
        refundAmount?: number;
      } | null;

      // 서버도 공백을 거절한다. 프론트 검증에만 맡기면 빈 이력이 쌓인다.
      if (!body?.managerName?.trim()) {
        return HttpResponse.json(
          { message: '담당자 이름을 입력해주세요.' },
          { status: 400 },
        );
      }
      if (!body?.reason?.trim()) {
        return HttpResponse.json(
          { message: '환불 사유를 입력해주세요.' },
          { status: 400 },
        );
      }

      // 금액은 요청 바디로 들어오므로 조작할 수 있다. 서버 재검증이 방어의 전부다.
      // 금액이 없으면 전체 환불이고 서버가 payment.finalPrice 를 쓴다. 실결제액이 0원인
      // 결제는 이 경로로만 취소되며 PG 호출 없이 참여만 취소된다.
      const limit = finalPriceOf(applicationId);
      const requested = body.refundAmount;
      let refundAmount: number;

      if (requested == null) {
        refundAmount = limit ?? 0;
      } else if (!Number.isInteger(requested) || requested <= 0) {
        return HttpResponse.json(
          {
            message:
              '환불 금액은 1원 이상의 정수여야 합니다. 전액 환불은 금액 없이 요청하세요.',
          },
          { status: 400 },
        );
      } else if (limit != null && requested > limit) {
        return HttpResponse.json(
          { message: `환불 금액이 실결제액 ${limit}원을 초과합니다.` },
          { status: 400 },
        );
      } else if (limit != null && requested === limit) {
        // 구제책이 다르다. 초과는 숫자를 고치는 것이고 동일은 다른 버튼을 누르는 것이다.
        return HttpResponse.json(
          {
            message:
              '환불 금액이 실결제액과 같습니다. 전액 환불로 요청해주세요.',
          },
          { status: 400 },
        );
      } else {
        refundAmount = requested;
      }

      if (alreadyRefunded(applicationId)) {
        return HttpResponse.json(
          { message: '이미 취소된 신청 내역입니다.' },
          { status: 409 },
        );
      }

      const now = new Date().toISOString();

      refundLogs = [
        {
          id: Math.max(0, ...refundLogs.map((log) => log.id)) + 1,
          refundedAt: now,
          programType: 'CHALLENGE',
          programId: 319,
          programTitle: '[스타트업 Ver.] 면접 준비 7일 끝장 챌린지 7기',
          userId: null,
          userName: '목 참여자',
          userEmail: 'mock@example.com',
          managerName: body.managerName.trim(),
          refundedAmount: refundAmount,
          reason: body.reason.trim(),
          status: 'SUCCESS',
          failureMessage: null,
          applicationId,
          orderId: `letsMOCK${applicationId}`,
          paymentKey: `mock_payment_${applicationId}`,
          originalAmount: limit,
          paidAt: '2026-07-20T10:00:00',
          couponName: null,
          couponDiscount: null,
        },
        ...refundLogs,
      ];

      return HttpResponse.json({
        data: {
          refundedAmount: refundAmount,
          canceledAt: now,
          paymentKey: `mock_payment_${applicationId}`,
        },
      });
    },
  ),

  http.get(`${BASE}/admin/refund-history`, ({ request }) => {
    const url = new URL(request.url);
    const programId = url.searchParams.get('programId');
    const programType = url.searchParams.get('programType');
    const managerName = url.searchParams.get('managerName');
    const keyword = url.searchParams.get('keyword');
    const status = url.searchParams.get('status');
    const page = Number(url.searchParams.get('page') ?? 0);
    const size = Number(url.searchParams.get('size') ?? 20);

    const filtered = refundLogs.filter((log) => {
      if (programId && log.programId !== Number(programId)) return false;
      if (programType && log.programType !== programType) return false;
      if (managerName && !log.managerName?.includes(managerName)) return false;
      if (status && log.status !== status) return false;
      if (keyword) {
        const matched =
          log.userName?.includes(keyword) || log.userEmail?.includes(keyword);
        if (!matched) return false;
      }
      return true;
    });

    const start = page * size;

    return HttpResponse.json({
      data: {
        refundLogList: filtered.slice(start, start + size),
        pageInfo: {
          pageNum: page,
          pageSize: size,
          totalElements: filtered.length,
          totalPages: Math.max(1, Math.ceil(filtered.length / size)),
        },
      },
    });
  }),

  /**
   * 유저 환불 조회.
   *
   * refundScope·refundSource 는 서버가 계산해 내려주는 값이라 시드에 그대로 들어 있다.
   * 처리경로는 필터로 쓰지 않는다 — 애플리케이션 레벨 판별이라 걸러 내면 페이지마다
   * 개수가 달라지고 totalElements 가 실제와 어긋난다.
   */
  http.get(`${BASE}/admin/refund-history/user`, ({ request }) => {
    const url = new URL(request.url);
    const programId = url.searchParams.get('programId');
    const programType = url.searchParams.get('programType');
    const keyword = url.searchParams.get('keyword');
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');
    const page = Number(url.searchParams.get('page') ?? 0);
    const size = Number(url.searchParams.get('size') ?? 20);

    // 어드민 환불을 실행한 신청서는 어드민 탭으로 옮겨간다. 서버는 NOT EXISTS 로 뺀다.
    const adminRefundedIds = new Set(
      refundLogs
        .filter((log) => log.status === 'SUCCESS')
        .map((log) => log.applicationId),
    );

    const filtered = seedUserRefunds.filter((refund) => {
      if (adminRefundedIds.has(refund.applicationId)) return false;
      if (programId && refund.programId !== Number(programId)) return false;
      if (programType && refund.programType !== programType) return false;
      if (keyword) {
        const matched =
          refund.userName?.includes(keyword) ||
          refund.userEmail?.includes(keyword);
        if (!matched) return false;
      }
      if (startDate && (refund.refundedAt ?? '') < startDate) return false;
      if (endDate && (refund.refundedAt ?? '') > endDate) return false;
      return true;
    });

    const start = page * size;

    return HttpResponse.json({
      data: {
        refundList: filtered.slice(start, start + size),
        pageInfo: {
          pageNum: page,
          pageSize: size,
          totalElements: filtered.length,
          totalPages: Math.max(1, Math.ceil(filtered.length / size)),
        },
      },
    });
  }),
];

export const adminParticipantHandlers = [
  http.get(`${BASE}/challenge/:challengeId/applications`, () =>
    HttpResponse.json({
      data: {
        applicationList: mockApplications.map((application) => ({
          application,
          optionPriceSum: 0,
          optionDiscountPriceSum: 0,
        })),
      },
    }),
  ),

  http.get(`${BASE}/challenge/:challengeId/title`, () =>
    HttpResponse.json({
      data: { title: '[스타트업 Ver.] 면접 준비 7일 끝장 챌린지 7기' },
    }),
  ),
];
