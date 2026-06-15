'use client';
import { useProgramApplicationQuery } from '@/api/application';
import { getPayInfo, generateOrderId } from '@/lib/order';
import useAuthStore from '@/store/useAuthStore';
import useProgramStore from '@/store/useProgramStore';
import { useRouter } from 'next/navigation';
import {
  MEMBERSHIP_CHALLENGE_ID,
  MEMBERSHIP_PLANS,
  type MembershipPlanKey,
} from '../constants';

export function useMembershipApply() {
  const { setProgramApplicationForm } = useProgramStore();
  const { isLoggedIn } = useAuthStore();
  const router = useRouter();

  // 기존 챌린지 신청 API 그대로 사용 — application에 유저 정보 + priceList 포함
  const { data: application } = useProgramApplicationQuery(
    'challenge',
    MEMBERSHIP_CHALLENGE_ID,
  );

  const handleApply = (planKey: MembershipPlanKey) => {
    if (!isLoggedIn) {
      router.push(`/login?redirect=${encodeURIComponent('/membership')}`);
      return;
    }

    if (!MEMBERSHIP_CHALLENGE_ID) {
      alert('준비 중입니다. 잠시만 기다려주세요.');
      return;
    }

    if (application?.applied) {
      alert('이미 이용 중인 멤버십입니다.');
      return;
    }

    const plan = MEMBERSHIP_PLANS[planKey];
    const payInfo = application
      ? getPayInfo(application, plan.pricePlan)
      : null;

    if (!payInfo) {
      alert('정보를 불러오는 중입니다. 잠시만 기다려주세요.');
      return;
    }

    // 어드민이 설정한 가격(priceList)을 우선 사용 — 미설정 시 constants 폴백
    const priceItem = application?.priceList?.find(
      (item) => item.challengePricePlanType === plan.pricePlan,
    );
    const priceId = priceItem?.priceId;
    const originalPrice = priceItem?.price ?? plan.originalPrice;
    const discount = priceItem?.discount ?? plan.originalPrice - plan.price;

    const totalPrice = Math.max(originalPrice - discount, 0);
    const isFree = totalPrice === 0;

    setProgramApplicationForm({
      priceId,
      price: originalPrice,
      discount,
      couponId: '',
      couponPrice: 0,
      totalPrice,
      contactEmail: application?.contactEmail ?? '',
      question: '',
      email: application?.email ?? '',
      phone: application?.phoneNumber ?? '',
      name: application?.name ?? '',
      programTitle: `렛츠커리어 하반기 멤버십 (${plan.label})`,
      programType: 'challenge',
      progressType: 'none',
      programId: MEMBERSHIP_CHALLENGE_ID,
      programOrderId: generateOrderId(),
      isFree,
      deposit: 0,
    });

    router.push('/payment-input');
  };

  return { handleApply };
}
