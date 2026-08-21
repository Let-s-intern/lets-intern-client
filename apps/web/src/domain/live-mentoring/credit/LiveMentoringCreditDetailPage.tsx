'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useUserQuery } from '@/api/user/user';
import { formatPrice } from '../constants';
import { formatReservationPeriod } from '../mypage/MentoringApplicationCard';
import { useLiveMentoringRefund } from './hooks/useLiveMentoringRefund';

const Row = ({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) => (
  <div className="flex w-full items-center justify-between gap-4 text-sm">
    <span className={strong ? 'text-neutral-0 font-semibold' : 'text-neutral-30'}>
      {label}
    </span>
    <span className={strong ? 'text-neutral-0 font-semibold' : 'text-neutral-0'}>
      {value}
    </span>
  </div>
);

interface LiveMentoringCreditDetailPageProps {
  applicationId: number;
}

/**
 * 1대1 라이브 멘토링 결제 상세 (시안 `4-0` 윗부분).
 *
 * 기존 `CreditDetailPage` 를 확장하지 않고 전용 라우트를 팠다. 그쪽은 `paymentId` 로
 * 돌고 취소 규칙이 다르며, 분기를 넣으면 프로그램·리포트 결제가 함께 흔들린다.
 * `report/[paymentId]` 가 이미 같은 방식으로 갈라져 있어 이 레포의 관례이기도 하다.
 *
 * 금액은 전부 서버 `refund-preview` 가 준 **결제 시점 스냅샷**이다. 화면에서 다시
 * 계산하지 않는다.
 */
const LiveMentoringCreditDetailPage = ({
  applicationId,
}: LiveMentoringCreditDetailPageProps) => {
  const router = useRouter();
  const { application, refundPreview, isLoading, error } =
    useLiveMentoringRefund(applicationId);
  const { data: user } = useUserQuery();

  return (
    <section className="flex w-full flex-col px-5 md:px-0">
      <div className="flex items-center justify-start gap-x-2">
        <img
          src="/icons/Arrow_Left_MD.svg"
          alt="이전"
          className="h-6 w-6 cursor-pointer"
          onClick={() => router.push('/mypage/credit')}
        />
        <h1 className="text-neutral-0 text-lg font-medium">결제상세</h1>
      </div>

      {isLoading ? (
        <p className="text-neutral-0 py-8">결제내역을 불러오는 중입니다.</p>
      ) : error ? (
        <p className="text-neutral-0 py-8">{error.message}</p>
      ) : (
        <section className="flex w-full flex-col gap-y-10 py-8">
          {/* 프로그램 정보 */}
          <div className="flex w-full flex-col items-start gap-y-6">
            <div className="text-neutral-0 font-semibold">프로그램 정보</div>
            <div className="flex w-full items-start gap-x-4">
              {application?.thumbnail ? (
                <img
                  src={application.thumbnail}
                  alt=""
                  aria-hidden="true"
                  className="h-[97px] w-[137px] rounded-sm object-cover"
                />
              ) : (
                <div
                  aria-hidden="true"
                  className="bg-neutral-90 h-[97px] w-[137px] rounded-sm"
                />
              )}
              <div className="flex grow flex-col gap-y-3">
                <div className="font-semibold">
                  {application?.productName ?? '1:1 LIVE 멘토링'}
                </div>
                <div className="flex w-full flex-col gap-y-1 text-xs font-medium">
                  <div className="flex items-center gap-x-4">
                    <div className="text-neutral-30 shrink-0">예약 일시</div>
                    <div className="text-primary-dark">
                      {application
                        ? formatReservationPeriod(
                            application.reservationStartAt,
                            application.reservationEndAt,
                          )
                        : '-'}
                    </div>
                  </div>
                  <div className="flex items-center gap-x-4">
                    <div className="text-neutral-30 shrink-0">구매 플랜</div>
                    <div className="text-primary-dark">
                      {application ? `${application.durationMinutes}분` : '-'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 참여자 정보 */}
          <div className="flex w-full flex-col items-start gap-y-6">
            <div className="text-neutral-0 font-semibold">참여자 정보</div>
            <div className="flex w-full flex-col gap-y-3">
              <Row label="이름" value={user?.name ?? '-'} />
              <Row label="휴대폰 번호" value={user?.phoneNum ?? '-'} />
              <Row label="이메일" value={user?.contactEmail ?? user?.email ?? '-'} />
            </div>
          </div>

          {/* 결제 정보 — 서버가 준 결제 시점 스냅샷 */}
          {refundPreview && (
            <div className="flex w-full flex-col items-start gap-y-6">
              <div className="text-neutral-0 font-semibold">결제 정보</div>
              <div className="flex w-full flex-col gap-y-3">
                <Row
                  label="결제 상품"
                  value={formatPrice(refundPreview.originalPrice)}
                />
                {refundPreview.productDiscount > 0 && (
                  <Row
                    label="할인 금액"
                    value={`-${formatPrice(refundPreview.productDiscount)}`}
                  />
                )}
                {refundPreview.couponDiscount > 0 && (
                  <Row
                    label="쿠폰 할인 금액"
                    value={`-${formatPrice(refundPreview.couponDiscount)}`}
                  />
                )}
                <div className="border-neutral-85 w-full border-t pt-3">
                  <Row
                    label="총 결제금액"
                    value={formatPrice(refundPreview.paidAmount)}
                    strong
                  />
                </div>
                <Row label="주문번호" value={refundPreview.orderId} />
              </div>
            </div>
          )}

          {/*
            취소 가능 여부는 서버 `cancelable` 을 그대로 쓴다. 24시간 이내처럼 돌려줄
            돈이 없는 구간은 서버가 false 를 주고, 화면이 경계를 다시 계산하면 어긋난다.
          */}
          {refundPreview?.cancelable ? (
            <Link
              href={`/mypage/credit/live-mentoring/${applicationId}/delete`}
              className="border-neutral-80 text-neutral-20 w-full rounded-sm border py-3 text-center text-sm font-medium"
            >
              결제 취소하기
            </Link>
          ) : (
            <p className="text-neutral-45 text-xs">
              예약 시간이 가까워 결제를 취소할 수 없습니다.
            </p>
          )}
        </section>
      )}
    </section>
  );
};

export default LiveMentoringCreditDetailPage;
