import { useProgramApplicationQuery } from '@/api/application';
import { useGetLiveQuery } from '@/api/program';
import { useServerLive } from '@/context/ServerLive';
import { isDeprecatedProgram } from '@/lib/isDeprecatedProgram';
import { generateOrderId, getPayInfo, UserInfo } from '@/lib/order';
import useAuthStore from '@/store/useAuthStore';
import useProgramStore from '@/store/useProgramStore';
import { getProgramPathname } from '@/utils/url';
import LiveView from '@components/LiveView';
import { useMediaQuery } from '@mui/material';
import { useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ApplyCTA, DesktopApplyCTA } from './ChallengeDetailSSRPage';

const LiveDetailSSRPage = () => {
  const navigate = useNavigate();
  const { id, title: titleFromUrl } = useParams<{
    id: string;
    title?: string;
  }>();
  const isMobile = useMediaQuery('(max-width:991px)');
  const { isLoggedIn } = useAuthStore();

  const liveFromServer = useServerLive();
  const { data } = useGetLiveQuery({ liveId: Number(id || '') });

  const { initProgramApplicationForm, setProgramApplicationForm } =
    useProgramStore();

  const live = data || liveFromServer;
  const isLoading = live.title === '로딩중...';
  const isDeprecated = isDeprecatedProgram(live);

  useEffect(() => {
    if (isDeprecated) {
      navigate(`/program/old/live/${id}`, { replace: true });
    }
  }, [id, isDeprecated, navigate]);

  // 이 페이지 방문 시 프로그램 신청 폼 초기화
  useEffect(() => {
    initProgramApplicationForm();
  }, [initProgramApplicationForm]);

  useEffect(() => {
    if (!titleFromUrl && !isLoading && !isDeprecated) {
      window.history.replaceState(
        {},
        '',
        getProgramPathname({
          programType: 'live',
          title: live.title,
          id,
        }),
      );
    }
  }, [live.title, id, isLoading, titleFromUrl, isDeprecated]);

  const { data: application } = useProgramApplicationQuery('live', Number(id));

  /** 이미 신청했는지 체크하는 정보 */
  const isAlreadyApplied = application?.applied ?? false;

  const onApplyClick = useCallback(() => {
    if (!isLoggedIn) {
      navigate(`/login?redirect=${window.location.pathname}`);
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
      programTitle: live.title,
      programType: 'live',
      progressType,
      programId: Number(id),
      programOrderId: orderId,
      isFree,
    });

    if (isFree) {
      navigate(`/order/result?orderId=${orderId}`);
    } else {
      navigate(`/payment-input`);
    }
  }, [
    application,
    live.title,
    id,
    isLoggedIn,
    navigate,
    setProgramApplicationForm,
  ]);

  if (isDeprecated) {
    return <></>;
  }

  return (
    <>
      <LiveView live={live} />

      {isMobile ? (
        <ApplyCTA
          program={live}
          onApplyClick={onApplyClick}
          isAlreadyApplied={isAlreadyApplied}
        />
      ) : (
        <DesktopApplyCTA
          program={live}
          onApplyClick={onApplyClick}
          isAlreadyApplied={isAlreadyApplied}
        />
      )}
    </>
  );
};

export default LiveDetailSSRPage;
