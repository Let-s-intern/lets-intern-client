'use client';

import { useProgramApplicationQuery } from '@/api/application';
import dayjs from '@/lib/dayjs';
import { generateOrderId, getPayInfo, UserInfo } from '@/lib/order';
import { LiveIdPrimitive } from '@/schema';
import useAuthStore from '@/store/useAuthStore';
import useProgramStore from '@/store/useProgramStore';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect } from 'react';
import {
  DesktopApplyCTA,
  MobileApplyCTA,
} from '../../../../common/button/ApplyCTA';

const LiveCTAButtons = ({
  live,
  liveId,
}: {
  live: LiveIdPrimitive;
  liveId: string;
}) => {
  const { isLoggedIn } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: application, refetch } = useProgramApplicationQuery(
    'live',
    Number(liveId),
  );

  const { setProgramApplicationForm } = useProgramStore();

  // 로그인 상태 변경 시 application 데이터 refetch
  useEffect(() => {
    if (isLoggedIn) {
      refetch();
    }
  }, [isLoggedIn, refetch]);

  /** 이미 신청했는지 체크하는 정보 */
  const isAlreadyApplied = application?.applied ?? false;

  const onApplyClick = useCallback(() => {
    if (!isLoggedIn) {
      // 현재 URL의 전체 경로와 쿼리 파라미터를 포함하여 로그인 후 리다이렉트 URL 생성
      // window.location.pathname을 사용해야 title이 포함된 전체 경로를 가져올 수 있음
      const currentPath = window.location.pathname;
      const currentSearch = searchParams.toString();
      const redirectUrl = currentSearch
        ? `${currentPath}?${currentSearch}`
        : currentPath;

      router.push(`/login?redirect=${encodeURIComponent(redirectUrl)}`);
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
      payInfo.livePriceType === 'FREE' ||
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
      programTitle: live.title,
      programType: 'live',
      progressType,
      programId: Number(liveId),
      programOrderId: orderId,
      isFree,
    });

    router.push('/payment-input');
  }, [
    isLoggedIn,
    application,
    setProgramApplicationForm,
    live.title,
    liveId,
    router,
    searchParams,
  ]);

  return (
    <>
      <DesktopApplyCTA
        program={{
          ...live,
          beginning: live.startDate ? dayjs(live.beginning) : null,
          deadline: live.endDate ? dayjs(live.deadline) : null,
        }}
        onApplyClick={onApplyClick}
        isAlreadyApplied={isAlreadyApplied}
      />

      <MobileApplyCTA
        program={{
          ...live,
          beginning: live.startDate ? dayjs(live.beginning) : null,
          deadline: live.endDate ? dayjs(live.deadline) : null,
        }}
        onApplyClick={onApplyClick}
        isAlreadyApplied={isAlreadyApplied}
      />
    </>
  );
};

export default LiveCTAButtons;
