import { useProgramApplicationQuery } from '@/api/application';
import { generateOrderId, getPayInfo, UserInfo } from '@/lib/order';
import useAuthStore from '@/store/useAuthStore';
import useProgramStore from '@/store/useProgramStore';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCallback, useEffect } from 'react';
import { DesktopApplyCTA, MobileApplyCTA } from '@/common/button/ApplyCTA';

interface VodCTAButtonsProps {
  vodId: string;
  title?: string | null;
}

const VodCTAButtons = ({ vodId, title }: VodCTAButtonsProps) => {
  const { isLoggedIn } = useAuthStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { data: application, refetch } = useProgramApplicationQuery(
    'vod',
    Number(vodId),
  );

  const { setProgramApplicationForm } = useProgramStore();

  useEffect(() => {
    if (isLoggedIn) {
      refetch();
    }
  }, [isLoggedIn, refetch]);

  const programTitle = title ?? '';
  const isAlreadyApplied = application?.applied ?? false;

  const onApplyClick = useCallback(() => {
    if (!isLoggedIn) {
      const currentPath = window.location.pathname;
      const currentSearch = searchParams.toString();
      const redirectUrl = currentSearch
        ? `${currentPath}?${currentSearch}`
        : currentPath;

      navigate(`/login?redirect=${encodeURIComponent(redirectUrl)}`);
      return;
    }

    const payInfo = application ? getPayInfo(application) : null;
    if (!payInfo) {
      window.alert('정보를 불러오는 중입니다. 잠시만 기다려주세요.');
      return;
    }

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
      payInfo.vodPriceType === 'FREE' ||
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
      programTitle,
      programType: 'vod',
      progressType,
      programId: Number(vodId),
      programOrderId: orderId,
      isFree,
    });

    navigate('/payment-input');
  }, [
    isLoggedIn,
    application,
    setProgramApplicationForm,
    programTitle,
    vodId,
    navigate,
    searchParams,
  ]);

  return (
    <>
      <DesktopApplyCTA
        program={{
          title: programTitle,
          beginning: null,
          deadline: null,
        }}
        onApplyClick={onApplyClick}
        isAlreadyApplied={isAlreadyApplied}
      />

      <MobileApplyCTA
        program={{
          title: programTitle,
          beginning: null,
          deadline: null,
        }}
        onApplyClick={onApplyClick}
        isAlreadyApplied={isAlreadyApplied}
      />
    </>
  );
};

export default VodCTAButtons;
