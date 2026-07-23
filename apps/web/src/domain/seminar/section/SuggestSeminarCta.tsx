'use client';

import { useGetLaunchAlertQuery } from '@/api/magnet/magnet';
import useAuthStore from '@/store/useAuthStore';
import { useToast } from '@letscareer/ui';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { SEMINAR_MAGNET_ID } from '../constants';
import SuggestSeminarModal from '../modal/SuggestSeminarModal';

interface SuggestSeminarCtaProps {
  /** 'card' = 빈 상태용 세로 카드(figma 4_1), 'banner' = 리스트 하단 가로 배너(figma 4_0) */
  variant?: 'card' | 'banner';
}

/**
 * "듣고 싶은 챌린지 제안하기" CTA.
 * 클릭 시 마그넷(SEMINAR_MAGNET_ID, env 세팅) 신청 모달을 연다.
 * - 비로그인: 로그인 페이지로 보낸 뒤 /seminar 로 복귀.
 * - 이미 제안(신청)한 경우: 모달 대신 "이미 제안했다" 토스트로 안내.
 *   (마그넷 99 = 출시알림 마그넷이므로 appliedLaunchAlert 로 제출 여부 판단.)
 */
const SuggestSeminarCta = ({ variant = 'card' }: SuggestSeminarCtaProps) => {
  const router = useRouter();
  const toast = useToast();
  const { isLoggedIn } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: launchAlert } = useGetLaunchAlertQuery({
    enabled: isLoggedIn,
  });
  const alreadyApplied = launchAlert?.appliedLaunchAlert === true;

  const handleClick = () => {
    if (!isLoggedIn) {
      router.push(`/login?redirect=${encodeURIComponent('/seminar')}`);
      return;
    }
    if (alreadyApplied) {
      toast.success('이미 제안해 주셨어요. 소중한 의견 감사합니다!');
      return;
    }
    setIsModalOpen(true);
  };

  const icon = (
    <img
      src="/images/seminar/logo.png"
      alt=""
      aria-hidden
      className="h-7 w-7 shrink-0"
    />
  );

  const heading = (
    <div
      className={`flex flex-col gap-1 ${variant === 'banner' ? 'text-center md:text-left' : 'items-center text-center'}`}
    >
      <p className="text-xsmall16 md:text-small18 text-primary font-bold">
        듣고 싶은 세미나 주제가 있나요?
      </p>
      <p className="text-xxsmall12 md:text-xsmall14 text-neutral-45">
        보고 싶은 기업·직무 현직자와 세미나 주제를 알려주세요!
      </p>
    </div>
  );

  const button = (
    <button
      type="button"
      onClick={handleClick}
      className="bg-primary text-xsmall14 md:text-xsmall16 rounded-xs min-h-[44px] shrink-0 px-5 py-3 font-semibold text-neutral-100"
    >
      듣고 싶은 세미나 제안하기
    </button>
  );

  const modal = isModalOpen && (
    <SuggestSeminarModal
      magnetId={SEMINAR_MAGNET_ID}
      onClose={() => setIsModalOpen(false)}
    />
  );

  if (variant === 'banner') {
    return (
      <div className="bg-primary-5 flex w-full flex-col items-center gap-4 rounded-md px-6 py-6 md:flex-row md:justify-between md:gap-6 md:px-8">
        <div className="flex items-center gap-3">
          {icon}
          {heading}
        </div>
        {button}
        {modal}
      </div>
    );
  }

  return (
    <div className="bg-primary-5 mx-auto flex w-full max-w-[720px] flex-col items-center gap-4 rounded-md px-6 py-8 md:py-10">
      {icon}
      {heading}
      {button}
      {modal}
    </div>
  );
};

export default SuggestSeminarCta;
