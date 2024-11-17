import { useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useProgramApplicationQuery } from '@/api/application';
import { useChallengeQuery } from '@/api/challenge';
import { useServerChallenge } from '@/context/ServerChallenge';
import { isDeprecatedProgram } from '@/lib/isDeprecatedProgram';
import { generateOrderId, getPayInfo, UserInfo } from '@/lib/order';
import useAuthStore from '@/store/useAuthStore';
import useProgramStore from '@/store/useProgramStore';
import {
  getChallengeTitle,
  getProgramPathname,
  getUniversalLink,
} from '@/utils/url';
import ChallengeView from '@components/ChallengeView';
import { DesktopApplyCTA, MobileApplyCTA } from '@components/common/ApplyCTA';
import CommonHelmet from '@components/common/CommonHelmet';

const ChallengeDetailSSRPage = () => {
  const navigate = useNavigate();
  const { id, title: titleFromUrl } = useParams<{
    id: string;
    title?: string;
  }>();

  const { isLoggedIn } = useAuthStore();

  const challengeFromServer = useServerChallenge();
  const { data } = useChallengeQuery({ challengeId: Number(id || '') });

  const { initProgramApplicationForm, setProgramApplicationForm } =
    useProgramStore();

  const challenge = data || challengeFromServer;
  const isLoading = challenge.title === '로딩중...';
  const isDeprecated = isDeprecatedProgram(challenge);

  useEffect(() => {
    if (isDeprecated) {
      navigate(`/program/old/challenge/${id}`, { replace: true });
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
          programType: 'challenge',
          title: challenge.title,
          id,
        }),
      );
    }
  }, [challenge.title, id, isDeprecated, isLoading, titleFromUrl]);

  const { data: application } = useProgramApplicationQuery(
    'challenge',
    Number(id),
  );

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
      programTitle: challenge.title,
      programType: 'challenge',
      progressType,
      programId: Number(id),
      programOrderId: orderId,
      isFree,
    });

    navigate(`/payment-input`);
  }, [
    application,
    challenge.title,
    id,
    isLoggedIn,
    navigate,
    setProgramApplicationForm,
  ]);

  if (isDeprecated || isLoading) {
    return <></>;
  }

  return (
    <>
      <CommonHelmet
        title={getChallengeTitle(challenge)}
        url={getUniversalLink(
          getProgramPathname({
            programType: 'challenge',
            title: challenge.title,
            id,
          }),
        )}
        description={challenge.shortDesc}
      />

      <ChallengeView challenge={challenge} />

      <DesktopApplyCTA
        program={challenge}
        onApplyClick={onApplyClick}
        isAlreadyApplied={isAlreadyApplied}
      />

      <MobileApplyCTA
        program={challenge}
        onApplyClick={onApplyClick}
        isAlreadyApplied={isAlreadyApplied}
      />
    </>
  );
};

export default ChallengeDetailSSRPage;
