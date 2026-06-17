'use client';

import { Duration } from '@/common/Duration';
import GradientButton from '@/domain/program/program-detail/button/GradientButton';
import NotiButton from '@/domain/program/program-detail/button/NotiButton';
import useInstagramAlert from '@/hooks/useInstagramAlert';
import dayjs from '@/lib/dayjs';
import { twMerge } from '@/lib/twMerge';
import { Dayjs } from 'dayjs';
import { memo, ReactNode } from 'react';
import PaymentErrorNotification from '../PaymentErrorNotification';

function DisabledButton() {
  return (
    <button
      disabled
      className="bg-neutral-80 text-xsmall16 text-neutral-40 w-full rounded-sm px-6 py-3 font-medium"
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
  onNotiClick?: () => void;
  isAlreadyApplied: boolean;
}

export function MobileApplyCTA({
  program,
  onApplyClick,
  onNotiClick,
  isAlreadyApplied,
}: ApplyCTAProps) {
  const isOutOfDate =
    program?.beginning && program.deadline
      ? dayjs().isBefore(program.beginning) || dayjs().isAfter(program.deadline)
      : false;

  const { isInstagram, showInstagramAlert, setShowInstagramAlert } =
    useInstagramAlert();

  const handleApplyClick = () => {
    if (!isInstagram) {
      onApplyClick();
      return;
    }

    if (!showInstagramAlert) {
      setShowInstagramAlert(true);
      return;
    }

    onApplyClick();
  };

  const hasDeadline = program?.deadline != null;

  return (
    <MobileCTA
      className="flex flex-col items-center lg:hidden"
      title={
        isOutOfDate
          ? '다양한 렛츠커리어 프로그램에 참여하고 싶다면?'
          : (program?.title ?? '')
      }
      banner={
        showInstagramAlert ? (
          <PaymentErrorNotification className="border-t" />
        ) : undefined
      }
    >
      {isOutOfDate ? (
        <NotiButton
          text={'출시알림신청'}
          className="early_button"
          onClick={onNotiClick}
        />
      ) : isAlreadyApplied ? (
        <DisabledButton />
      ) : hasDeadline ? (
        <>
          <div>
            <span className="text-xsmall14 mb-1 block font-medium">
              {program.deadline!.format('M월 D일 (dd)')} 마감까지 🚀
            </span>
            <div className="flex items-center gap-2">
              <Duration
                disabled={isAlreadyApplied || isOutOfDate}
                deadline={program.deadline ?? dayjs()}
              />
              <span className="text-xxsmall12 text-neutral-80">남음</span>
            </div>
          </div>
          <GradientButton onClick={handleApplyClick} className="apply_button">
            지금 바로 신청
          </GradientButton>
        </>
      ) : (
        <GradientButton
          onClick={handleApplyClick}
          className="apply_button w-full"
        >
          지금 바로 신청
        </GradientButton>
      )}
    </MobileCTA>
  );
}

export const MobileCTA = memo(function MobileCTA({
  title,
  children,
  banner,
  className,
}: {
  title: string;
  children?: ReactNode;
  banner?: JSX.Element;
  className?: string;
}) {
  return (
    <div
      className={twMerge(
        'safe-area-bottom bg-neutral-0/65 text-xxsmall12 fixed left-0 right-0 z-40 w-full overflow-hidden',
        className,
      )}
    >
      {banner}
      {!banner && (
        <div className="bg-neutral-0/95 text-static-100 w-full py-1.5 text-center font-bold">
          {title}
        </div>
      )}
      <div className="text-neutral-80 flex w-full items-center justify-between px-5 pb-5 pt-3 backdrop-blur">
        {children}
      </div>
    </div>
  );
});

export function DesktopApplyCTA({
  program,
  onApplyClick,
  onNotiClick,
  isAlreadyApplied,
}: ApplyCTAProps) {
  const isOutOfDate =
    program?.beginning && program.deadline
      ? dayjs().isBefore(program.beginning) || dayjs().isAfter(program.deadline)
      : false;

  const hasDeadline = program?.deadline != null;

  return (
    <DesktopCTA className="hidden items-center justify-between lg:flex">
      <div className="flex flex-col gap-1">
        <span className="font-bold text-neutral-100">
          {isOutOfDate
            ? '다양한 렛츠커리어 프로그램에 참여하고 싶다면?'
            : program?.title}
        </span>
        {!isOutOfDate && hasDeadline && program.deadline && (
          <span className="text-xsmall14 text-neutral-80 font-medium">
            {program.deadline.format('M월 D일 (dd)')} 마감까지 🚀
          </span>
        )}
      </div>
      <div className="flex min-w-80 max-w-[60rem] items-center justify-end gap-8">
        {isOutOfDate ? (
          <NotiButton
            text={'출시알림신청'}
            className="early_button"
            onClick={onNotiClick}
          />
        ) : isAlreadyApplied ? (
          <DisabledButton />
        ) : hasDeadline && program.deadline ? (
          <>
            <div className="flex items-center gap-2">
              <Duration
                disabled={isAlreadyApplied || isOutOfDate}
                deadline={program.deadline ?? dayjs()}
              />
              <span className="text-xxsmall12 text-neutral-80">남음</span>
            </div>
            <GradientButton onClick={onApplyClick} className="apply_button">
              지금 바로 신청
            </GradientButton>
          </>
        ) : (
          <GradientButton onClick={onApplyClick} className="apply_button">
            지금 바로 신청
          </GradientButton>
        )}
      </div>
    </DesktopCTA>
  );
}

export function DesktopCTA({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={twMerge(
        'bg-neutral-0/65 fixed bottom-4 left-0 right-0 z-40 mx-auto w-full max-w-[1000px] overflow-hidden rounded-sm px-5 py-4 backdrop-blur',
        className,
      )}
    >
      {children}
    </div>
  );
}
