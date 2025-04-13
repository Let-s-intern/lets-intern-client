'use client';

import { useProgramApplicationQuery } from '@/api/application';
import dayjs from '@/lib/dayjs';
import { generateOrderId, getPayInfo, UserInfo } from '@/lib/order';
import { ChallengeIdPrimitive } from '@/schema';
import useAuthStore from '@/store/useAuthStore';
import useProgramStore from '@/store/useProgramStore';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { DesktopApplyCTA, MobileApplyCTA } from './common/ApplyCTA';
import BottomSheet from './common/ui/BottomSheeet';

const ChallengeCTAButtons = ({
  challenge,
  challengeId,
}: {
  challenge: ChallengeIdPrimitive;
  challengeId: string;
}) => {
  const { isLoggedIn } = useAuthStore();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);

  const { data: application } = useProgramApplicationQuery(
    'challenge',
    Number(challengeId),
  );

  const { setProgramApplicationForm } = useProgramStore();

  /** 이미 신청했는지 체크하는 정보 */
  const isAlreadyApplied = application?.applied ?? false;

  const onApplyClick = useCallback(() => {
    if (!isLoggedIn) {
      window.location.href = `/login?redirect=${encodeURIComponent(`/program/challenge/${challengeId}`)}`;
      return;
    }

    if (!isOpen) {
      setIsOpen(true);
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
      deposit: challenge.priceInfo[0].refund ?? 0,
    });

    router.push(`/payment-input`);
    // navigate(`/payment-input`);
  }, [
    application,
    challenge,
    challengeId,
    isLoggedIn,
    router,
    setProgramApplicationForm,
  ]);

  if (isOpen)
    return (
      <BottomSheet>
        <label className="required-star text-xsmall14 font-semibold">
          챌린지 플랜 선택 (필수)
        </label>
      </BottomSheet>
    );

  return (
    <>
      <DesktopApplyCTA
        program={{
          ...challenge,
          beginning: challenge.beginning ? dayjs(challenge.beginning) : null,
          deadline: challenge.deadline ? dayjs(challenge.deadline) : null,
        }}
        onApplyClick={onApplyClick}
        isAlreadyApplied={isAlreadyApplied}
      />

      <MobileApplyCTA
        program={{
          ...challenge,
          beginning: challenge.beginning ? dayjs(challenge.beginning) : null,
          deadline: challenge.deadline ? dayjs(challenge.deadline) : null,
        }}
        onApplyClick={onApplyClick}
        isAlreadyApplied={isAlreadyApplied}
      />
    </>
  );
};

export default ChallengeCTAButtons;
