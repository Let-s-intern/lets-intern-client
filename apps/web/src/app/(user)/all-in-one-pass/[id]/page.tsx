'use client';

// 올인원패스 랜딩. [id]=membershipId. 구매 → 플랜 바텀시트. 섹션은 landing/ 에서 조립.

import LoadingContainer from '@/common/loading/LoadingContainer';
import { useGetAllInOnePassLanding } from '@/domain/all-in-one-pass/api/landing';
import { useGetMembershipApplicationForm } from '@/domain/all-in-one-pass/api/purchase';
import BenefitDetailSection from '@/domain/all-in-one-pass/landing/BenefitDetailSection';
import BenefitSummarySection from '@/domain/all-in-one-pass/landing/BenefitSummarySection';
import FaqSection from '@/domain/all-in-one-pass/landing/FaqSection';
import FinalCtaSection from '@/domain/all-in-one-pass/landing/FinalCtaSection';
import HeroSection from '@/domain/all-in-one-pass/landing/HeroSection';
import IntroSection from '@/domain/all-in-one-pass/landing/IntroSection';
import LandingApplyBar from '@/domain/all-in-one-pass/landing/LandingApplyBar';
import LandingLexicalSection from '@/domain/all-in-one-pass/landing/LandingLexicalSection';
import LandingNav from '@/domain/all-in-one-pass/landing/LandingNav';
import PriceSection from '@/domain/all-in-one-pass/landing/PriceSection';
import ReviewsSection from '@/domain/all-in-one-pass/landing/ReviewsSection';
import { parseLandingDescription } from '@/domain/all-in-one-pass/landing/landingContent';
import { useCtaState } from '@/domain/all-in-one-pass/landing/useCtaState';
import MembershipPlanBottomSheet from '@/domain/all-in-one-pass/ui/MembershipPlanBottomSheet';
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

  const { ctaText, barCtaText, ctaDisabled } = useCtaState(
    applicationForm,
    landing.displayDeadline,
  );

  if (isLoading || !pass) {
    return <LoadingContainer />;
  }

  const vodOptionOnSale = applicationForm?.vodPassProduct != null;

  // 노출용 종료일이 있으면 카운트다운·마감도 그 값 기준(없으면 실제 판매 deadline).
  const effectiveDeadline = landing.displayDeadline ?? pass.deadline;

  return (
    <main>
      <HeroSection
        passTitle={pass.title}
        hero={landing.hero}
        periodDays={pass.periodDays}
        deadline={effectiveDeadline}
        ctaText={ctaText}
        ctaDisabled={ctaDisabled}
        onStart={handleBuyClick}
        onScrollToBenefit={scrollToBenefit}
      />
      <LandingNav isReady={!isLoading} />

      <IntroSection introLexical={landing.lexical.introSection} />
      <BenefitSummarySection
        passTitle={pass.title}
        periodDays={pass.periodDays}
        benefitsSummary={landing.benefitsSummary}
        vodCount={landing.vodCount}
        vodOptionOnSale={vodOptionOnSale}
        onBenefitClick={scrollToBenefit}
      />
      <BenefitDetailSection
        passTitle={pass.title}
        plans={pass.plans}
        vods={landing.vods}
        vodCount={landing.vodCount}
        playbookLexical={landing.lexical.playbookSection}
        benefitLexical={landing.lexical.benefitSection}
        vodOptionOnSale={vodOptionOnSale}
      />
      <ReviewsSection reviews={landing.reviews} />
      <LandingLexicalSection lexical={landing.lexical.reviewSection} />
      <PriceSection
        passTitle={pass.title}
        plans={pass.plans}
        periodDays={pass.periodDays}
        specialBenefitTitles={landing.specialBenefitTitles}
        ctaText={ctaText}
        ctaDisabled={ctaDisabled}
        onStart={handleBuyClick}
      />
      <FaqSection faqs={pass.faqs} />
      <FinalCtaSection
        passTitle={pass.title}
        finalCta={landing.finalCta}
        deadline={effectiveDeadline}
        ctaText={ctaText}
        ctaDisabled={ctaDisabled}
        onStart={handleBuyClick}
      />

      {!sheetOpen && (
        <LandingApplyBar
          passTitle={pass.title}
          periodDays={pass.periodDays}
          deadline={effectiveDeadline}
          ctaText={barCtaText}
          ctaDisabled={ctaDisabled}
          onStart={handleBuyClick}
        />
      )}

      <MembershipPlanBottomSheet
        membershipId={membershipId}
        isOpen={sheetOpen}
        onClose={() => setSheetOpen(false)}
      />
    </main>
  );
}
