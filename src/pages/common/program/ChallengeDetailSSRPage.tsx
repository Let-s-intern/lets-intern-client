import { useMediaQuery } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
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
import CommonHelmet from '@components/common/CommonHelmet';
import FilledButton from '@components/common/program/program-detail/button/FilledButton';
import GradientButton from '@components/common/program/program-detail/button/GradientButton';
import NotiButton from '@components/common/program/program-detail/button/NotiButton';
import { Duration } from '@components/Duration';

const ChallengeDetailSSRPage = () => {
  const navigate = useNavigate();
  const { id, title: titleFromUrl } = useParams<{
    id: string;
    title?: string;
  }>();
  const isDesktop = useMediaQuery('(min-width:991px)');
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
  }, [challenge, id, isDeprecated, navigate]);

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

      {isDesktop ? (
        <DesktopApplyCTA
          program={challenge}
          onApplyClick={onApplyClick}
          isAlreadyApplied={isAlreadyApplied}
        />
      ) : (
        <MobileApplyCTA
          program={challenge}
          onApplyClick={onApplyClick}
          isAlreadyApplied={isAlreadyApplied}
        />
      )}
    </>
  );
};

/* CTA는 모든 프로그램 상세페이지에서 공동으로 사용 */
interface ApplyCTAProps {
  program: {
    title?: string | null;
    deadline: Dayjs | null;
    beginning: Dayjs | null;
  };
  onApplyClick: () => void;
  isAlreadyApplied: boolean;
}

export function MobileApplyCTA({
  program,
  onApplyClick,
  isAlreadyApplied,
}: ApplyCTAProps) {
  const isOutOfDate =
    program?.beginning && program.deadline
      ? dayjs().isBefore(program.beginning) || dayjs().isAfter(program.deadline)
      : false;

  return (
    <div className="safe-area-bottom fixed left-0 right-0 z-40 flex w-full flex-col items-center overflow-hidden bg-neutral-0/65 text-xxsmall12">
      <div className="w-full bg-neutral-0/95 py-1.5 text-center font-bold text-static-100">
        {program?.title}
      </div>
      <div className="flex w-full items-center justify-between px-5 pb-5 pt-3 text-neutral-80 backdrop-blur">
        {isOutOfDate ? (
          <NotiButton text={'출시알림신청'} className="early_button" />
        ) : isAlreadyApplied ? (
          <FilledButton caption="이미 신청이 완료되었습니다" disabled={true} />
        ) : (
          <>
            <div>
              <span className="mb-1 block text-xsmall14 font-medium">
                {program?.deadline?.format('M월 D일 (dd)')} 마감까지 🚀
              </span>
              <div className="flex items-center gap-2">
                <Duration
                  disabled={isAlreadyApplied || isOutOfDate}
                  deadline={program?.deadline ?? dayjs()}
                />
                <span className="text-xxsmall12 text-neutral-80">남음</span>
              </div>
            </div>
            <GradientButton onClick={onApplyClick} className="apply_button">
              지금 바로 신청
            </GradientButton>
          </>
        )}
      </div>
    </div>
  );
}

export function DesktopApplyCTA({
  program,
  onApplyClick,
  isAlreadyApplied,
}: ApplyCTAProps) {
  const isOutOfDate =
    program?.beginning && program.deadline
      ? dayjs().isBefore(program.beginning) || dayjs().isAfter(program.deadline)
      : false;

  return (
    <div className="fixed bottom-4 left-0 right-0 z-40 mx-auto flex w-full max-w-[1000px] items-center justify-between overflow-hidden rounded-sm bg-neutral-0/65 px-5 py-4 backdrop-blur">
      <div className="flex flex-col gap-1">
        <span className="font-bold text-neutral-100">{program?.title}</span>
        <span className="text-xsmall14 font-medium text-neutral-80">
          {program?.deadline?.format?.('M월 D일 (dd)')} 마감까지 🚀
        </span>
      </div>
      <div className="flex min-w-80 max-w-[60rem] items-center gap-8">
        {isOutOfDate ? (
          <NotiButton text={'출시알림신청'} className="early_button" />
        ) : isAlreadyApplied ? (
          <FilledButton caption="이미 신청이 완료되었습니다" disabled={true} />
        ) : (
          <>
            <div className="flex items-center gap-2">
              <Duration
                disabled={isAlreadyApplied || isOutOfDate}
                deadline={program?.deadline ?? dayjs()}
              />
              <span className="text-xxsmall12 text-neutral-80">남음</span>
            </div>
            <GradientButton onClick={onApplyClick} className="apply_button">
              지금 바로 신청
            </GradientButton>
          </>
        )}
      </div>
    </div>
  );
}

export default ChallengeDetailSSRPage;
