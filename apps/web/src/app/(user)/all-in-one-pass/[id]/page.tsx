'use client';

// 올인원패스 랜딩(임시 스캐폴드, 시안 수신 후 교체). [id]=membershipId. 구매 → 플랜 바텀시트.

import LoadingContainer from '@/common/loading/LoadingContainer';
import { useGetAllInOnePassLanding } from '@/domain/all-in-one-pass/api/landing';
import MembershipPlanBottomSheet from '@/domain/all-in-one-pass/ui/MembershipPlanBottomSheet';
import { useParams } from 'next/navigation';
import { useState } from 'react';

export default function AllInOnePassLandingPage() {
  const params = useParams<{ id: string }>();
  const membershipId = Number(params.id);
  const [sheetOpen, setSheetOpen] = useState(false);
  const { data: pass, isLoading } = useGetAllInOnePassLanding(membershipId);

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

      <button
        type="button"
        onClick={() => setSheetOpen(true)}
        className="bg-primary text-small16 w-full rounded-md px-6 py-3 text-center font-medium text-neutral-100"
      >
        구매하기
      </button>

      <MembershipPlanBottomSheet
        membershipId={membershipId}
        isOpen={sheetOpen}
        onClose={() => setSheetOpen(false)}
      />
    </main>
  );
}
