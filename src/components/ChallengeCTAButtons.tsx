'use client';

import { ProgramApplicationFormInfo } from '@/api/application';
import dayjs from '@/lib/dayjs';
import { generateOrderId, getPayInfo, UserInfo } from '@/lib/order';
import { ChallengeIdPrimitive } from '@/schema';
import useAuthStore from '@/store/useAuthStore';
import useProgramStore from '@/store/useProgramStore';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { DesktopApplyCTA, MobileApplyCTA } from './common/ApplyCTA';

const ChallengeCTAButtons = ({
  application,
  challenge,
  challengeId,
}: {
  application: ProgramApplicationFormInfo;
  challenge: ChallengeIdPrimitive;
  challengeId: string;
}) => {
  const { isLoggedIn } = useAuthStore();
  const router = useRouter();

  const { setProgramApplicationForm } = useProgramStore();

  /** 이미 신청했는지 체크하는 정보 */
  const isAlreadyApplied = application?.applied ?? false;

  const onApplyClick = useCallback(() => {
    if (!isLoggedIn) {
      const parts = window.location.pathname.split('/');
      const isServerRendered = isNaN(Number(parts[parts.length - 1]));
      const redirectPath = isServerRendered
        ? parts.slice(0, -1).join('/')
        : window.location.pathname;
      const href = `/login?redirect=${encodeURIComponent(redirectPath)}`;
      router.push(href);
      // navigate(`/login?redirect=${redirectPath}`);
      return;
    }

    const payInfo = application ? getPayInfo(application) : null;
    if (!payInfo) {
      window.alert('정보를 불러오는 중입니다. 잠시만 기다려주세요.');
      return;
    }

    // TODO: 라이브는 직접 받아와야 함. 챌린지는 none임.

    const progressType: 'none' | 'ALL' | 'ONLINE' | 'OFFLINE' = 'none';

    const userInfo: UserInfo = {
      name: application?.name ?? '',
      email: application?.email ?? '',
      phoneNumber: application?.phoneNumber ?? '',
      contactEmail: application?.contactEmail ?? '',
      question: '',
      initialized: true,
    };

    const priceId =
      application?.priceList?.[0]?.priceId ?? application?.price?.priceId ?? -1;

    const orderId = generateOrderId();
    const totalPrice = Math.max(payInfo.price - payInfo.discount, 0);

    const isFree =
      payInfo.challengePriceType === 'FREE' ||
      payInfo.livePriceType === 'FREE' ||
      payInfo.price === 0 ||
      totalPrice === 0;

    setProgramApplicationForm({
      priceId,
      price: payInfo.price,
      discount: payInfo.discount,
      couponId: '',
      couponPrice: 0,
      totalPrice,
      contactEmail: userInfo.contactEmail,
      question: userInfo.question,
      email: userInfo.email,
      phone: userInfo.phoneNumber,
      name: userInfo.name,
      programTitle: challenge.title,
      programType: 'challenge',
      progressType,
      programId: Number(challengeId),
      programOrderId: orderId,
      isFree,
    });

    router.push(`/payment-input`);
    // navigate(`/payment-input`);
  }, [
    application,
    challenge.title,
    challengeId,
    isLoggedIn,
    router,
    setProgramApplicationForm,
  ]);

  return (
    <>
      <DesktopApplyCTA
        program={{
          ...challenge,
          beginning: challenge.startDate ? dayjs(challenge.startDate) : null,
          deadline: challenge.endDate ? dayjs(challenge.endDate) : null,
        }}
        onApplyClick={onApplyClick}
        isAlreadyApplied={isAlreadyApplied}
      />

      <MobileApplyCTA
        program={{
          ...challenge,
          beginning: challenge.startDate ? dayjs(challenge.startDate) : null,
          deadline: challenge.endDate ? dayjs(challenge.endDate) : null,
        }}
        onApplyClick={onApplyClick}
        isAlreadyApplied={isAlreadyApplied}
      />
    </>
  );
};

export default ChallengeCTAButtons;
