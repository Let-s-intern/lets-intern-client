'use client';

// 올인원패스 랜딩. [id]=membershipId. 구매 → 플랜 바텀시트. 섹션은 landing/ 에서 조립.

import LoadingContainer from '@/common/loading/LoadingContainer';
import { useGetAllInOnePassLanding } from '@/domain/all-in-one-pass/api/landing';
import { useGetMembershipApplicationForm } from '@/domain/all-in-one-pass/api/purchase';
import HeroSection from '@/domain/all-in-one-pass/landing/HeroSection';
import { parseLandingDescription } from '@/domain/all-in-one-pass/landing/landingContent';
import MembershipPlanBottomSheet from '@/domain/all-in-one-pass/ui/MembershipPlanBottomSheet';
import dayjs from '@/lib/dayjs';
import useAuthStore from '@/store/useAuthStore';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

export default function AllInOnePassLandingPage() {
  const params = useParams<{ id: string }>();
  const membershipId = Number(params.id);
  const [sheetOpen, setSheetOpen] = useState(false);
  const { data: pass, isLoading } = useGetAllInOnePassLanding(membershipId);
  const { data: applicationForm, refetch } =
    useGetMembershipApplicationForm(membershipId);
  const { isLoggedIn } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (isLoggedIn) refetch();
  }, [isLoggedIn, refetch]);

  const landing = useMemo(
    () => parseLandingDescription(pass?.landingDescription),
    [pass?.landingDescription],
  );

  const handleBuyClick = () => {
    if (!isLoggedIn) {
      const path = window.location.pathname;
      const search = searchParams.toString();
      const redirect = search ? `${path}?${search}` : path;
      router.push(`/login?redirect=${encodeURIComponent(redirect)}`);
      return;
    }
    setSheetOpen(true);
  };

  const scrollToBenefit = () =>
    document.getElementById('benefit')?.scrollIntoView({ behavior: 'smooth' });

  const isApplied = applicationForm?.applied ?? false;
  const now = dayjs();
  const beginning = applicationForm?.beginning
    ? dayjs(applicationForm.beginning)
    : null;
  const deadline = applicationForm?.deadline
    ? dayjs(applicationForm.deadline)
    : null;
  const isBeforeSale = !!beginning && now.isBefore(beginning);
  const isClosed = !!deadline && now.isAfter(deadline);
  const ctaDisabled = isApplied || isBeforeSale || isClosed;
  const ctaText = isApplied
    ? '이미 이용 중'
    : isBeforeSale
      ? '판매 예정'
      : isClosed
        ? '판매 종료'
        : '지금 바로 시작하기';

  if (isLoading || !pass) {
    return <LoadingContainer />;
  }

  return (
    <main>
      <HeroSection
        hero={landing.hero}
        periodDays={pass.periodDays}
        deadline={pass.deadline}
        ctaText={ctaText}
        ctaDisabled={ctaDisabled}
        onStart={handleBuyClick}
        onScrollToBenefit={scrollToBenefit}
      />

      <MembershipPlanBottomSheet
        membershipId={membershipId}
        isOpen={sheetOpen}
        onClose={() => setSheetOpen(false)}
      />
    </main>
  );
}
