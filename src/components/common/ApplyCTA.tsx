import GradientButton from '@components/common/program/program-detail/button/GradientButton';
import NotiButton from '@components/common/program/program-detail/button/NotiButton';
import { Duration } from '@components/Duration';
import dayjs, { Dayjs } from 'dayjs';
import { useCallback, useState } from 'react';
import PaymentErrorNotification from './PaymentErrorNotification';

function DisabledButton() {
  return (
    <button
      disabled
      className="w-full rounded-sm bg-neutral-80 px-6 py-3 text-xsmall14 font-medium text-neutral-40"
    >
      이미 신청이 완료되었습니다
    </button>
  );
}

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

  const [showInstagramAlert, setShowInstagramAlert] = useState(false);

  const isInstagram =
    typeof window !== 'undefined'
      ? window.navigator.userAgent.includes('Instagram')
      : false;

  const handleApplyClick = useCallback(() => {
    if (!isInstagram) {
      handleApplyClick();
      return;
    }

    if (!showInstagramAlert) {
      setShowInstagramAlert(true);
      return;
    }

    onApplyClick();
  }, [isInstagram, onApplyClick, showInstagramAlert]);

  return (
    <div className="safe-area-bottom fixed left-0 right-0 z-40 flex w-full flex-col items-center overflow-hidden bg-neutral-0/65 text-xxsmall12 lg:hidden">
      {showInstagramAlert && <PaymentErrorNotification className="border-t" />}
      <div className="w-full bg-neutral-0/95 py-1.5 text-center font-bold text-static-100">
        {program?.title}
      </div>
      <div className="flex w-full items-center justify-between px-5 pb-5 pt-3 text-neutral-80 backdrop-blur">
        {isOutOfDate ? (
          <NotiButton text={'출시알림신청'} className="early_button" />
        ) : isAlreadyApplied ? (
          <DisabledButton />
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
            <GradientButton onClick={handleApplyClick} className="apply_button">
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
    <div className="fixed bottom-4 left-0 right-0 z-40 mx-auto hidden w-full max-w-[1000px] items-center justify-between overflow-hidden rounded-sm bg-neutral-0/65 px-5 py-4 backdrop-blur lg:flex">
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
          <DisabledButton />
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
