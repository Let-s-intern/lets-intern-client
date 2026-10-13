'use client';

// 올인원패스 랜딩(구매) 페이지. `[id]` = membershipId(어드민에서 개설한 패스).
// 구매 후 대시보드는 하위 `[id]/[applicationId]` 로 이어진다.
//
// ⚠️ 디자인 시안 수신 전 임시 스캐폴드다. 라우팅과 데이터 흐름(useGetAllInOnePassLanding)만
// 검증하는 용도이며, 시안이 오면 이 본문을 섹션 컴포넌트들로 교체한다. 구매 CTA 는 신청
// 생성·신청폼 조회 API 연결 시 결선한다.

import LoadingContainer from '@/common/loading/LoadingContainer';
import { useGetAllInOnePassLanding } from '@/domain/all-in-one-pass/api/landing';
import { useParams } from 'next/navigation';

export default function AllInOnePassLandingPage() {
  const params = useParams<{ id: string }>();
  const { data: pass, isLoading } = useGetAllInOnePassLanding(
    Number(params.id),
  );

  if (isLoading || !pass) {
    return <LoadingContainer />;
  }

  return (
    <main className="mx-auto flex w-full max-w-[1120px] flex-col gap-8 px-5 py-12">
      <header className="flex flex-col gap-2">
        <h1 className="text-small20 md:text-medium24 text-neutral-0 font-bold">
          {pass.title}
        </h1>
        {pass.introduction && (
          <p className="text-xsmall14 md:text-small18 text-neutral-40">
            {pass.introduction}
          </p>
        )}
      </header>

      <section className="flex flex-col gap-4">
        {pass.plans.map((plan) => {
          const finalPrice = plan.price - (plan.discount ?? 0);
          const hasDiscount = plan.discount != null && plan.discount > 0;
          return (
            <div
              key={plan.id}
              className="border-neutral-80 flex flex-col gap-2 rounded-sm border p-5"
            >
              <p className="text-small18 text-neutral-0 font-semibold">
                {plan.title}
              </p>
              {plan.description && (
                <p className="text-xsmall14 text-neutral-40">
                  {plan.description}
                </p>
              )}
              <div className="flex items-baseline gap-2">
                {hasDiscount && (
                  <span className="text-xsmall14 text-neutral-50 line-through">
                    {plan.price.toLocaleString()}원
                  </span>
                )}
                <span className="text-small18 text-primary font-bold">
                  {finalPrice.toLocaleString()}원
                </span>
              </div>
            </div>
          );
        })}
      </section>
    </main>
  );
}
