import { LuCalendarDays } from 'react-icons/lu';

import Announcement from '@/assets/icons/announcement.svg?react';
import ChevronDown from '@/assets/icons/chevron-down.svg?react';
import ClockIcon from '@/assets/icons/clock.svg?react';
import LaptopIcon from '@/assets/icons/laptop.svg?react';
import { useInstallmentPayment } from '@/hooks/useInstallmentPayment';
import { ChallengeIdSchema } from '@/schema';
import { formatFullDateTime } from '@/utils/formatDateString';
import { ChallengeColor } from '@components/ChallengeView';
import BasicInfoBottomRow from '@components/common/program/program-detail/basicInfo/BasicInfoBottomRow';
import BasicInfoRow from '@components/common/program/program-detail/basicInfo/BasicInfoRow';
import { useMediaQuery } from '@mui/material';
import { priceReason } from './ChallengeBasicInfo';

export const getDiscountPercent = (
  originalPrice: number,
  discountPrice: number,
): number => {
  if (originalPrice === 0) return 0;
  return Math.round((discountPrice / originalPrice) * 100);
};

const ChallengeInfoBottom = ({
  challenge,
  colors,
}: {
  challenge: ChallengeIdSchema;
  colors: ChallengeColor;
}) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const {
    isLoading,
    months: installmentMonths,
    banks,
  } = useInstallmentPayment();

  const priceInfo = challenge.priceInfo[0];

  const monthlyPrice =
    installmentMonths && priceInfo
      ? Math.round(
          ((priceInfo.price ?? 0) - (priceInfo.discount ?? 0)) /
            installmentMonths,
        )
      : null;
  const totalPrice = (priceInfo?.price || 0) - (priceInfo?.discount || 0);
  const showMonthlyPrice = priceInfo && totalPrice >= 50000;
  const regularPrice =
    priceInfo.challengePriceType === 'CHARGE'
      ? priceInfo.price
      : (priceInfo.price ?? 0) + (priceInfo.refund ?? 0); // 정가

  return (
    <section className="flex w-full max-w-[1000px] flex-col gap-y-8 md:gap-y-20">
      <div className="w-full text-small20 font-bold text-neutral-0 md:text-center">
        모집개요
      </div>
      <div
        className="flex w-full flex-col gap-3 md:flex-row"
        style={{ color: colors.primary }}
      >
        {isMobile ? (
          <div className="flex flex-1 items-center justify-center rounded-md bg-neutral-95 px-6 py-5">
            <div className="flex w-full flex-col gap-y-5">
              <BasicInfoRow
                icon={<Announcement />}
                title="진행 기간"
                content={`${formatFullDateTime(challenge.startDate, true)}\n- ${formatFullDateTime(challenge.endDate, true)}`}
              />
              <BasicInfoRow
                icon={<LaptopIcon />}
                title="진행 방식"
                content={`100% 온라인\n(챌린지 대시보드, 오픈채팅방)`}
              />
              <BasicInfoRow
                icon={<ClockIcon />}
                title="모집 마감"
                content={`${formatFullDateTime(challenge.deadline, true)}`}
              />
              <BasicInfoRow
                icon={<LuCalendarDays size={20} />}
                title="OT 일자"
                content={`${formatFullDateTime(challenge.startDate, true)}`}
              />
            </div>
          </div>
        ) : (
          <div
            className="flex flex-1 flex-col gap-y-4"
            style={{ color: colors.primary }}
          >
            <BasicInfoBottomRow
              icon={<Announcement />}
              title="진행 기간"
              content={`${formatFullDateTime(challenge.startDate)}\n- ${formatFullDateTime(challenge.endDate)}`}
            />
            <BasicInfoBottomRow
              icon={<LaptopIcon />}
              title="진행 방식"
              content={`100% 온라인\n(챌린지 대시보드, 오픈채팅방)`}
            />
            <BasicInfoBottomRow
              icon={<ClockIcon />}
              title="모집 마감"
              content={`${formatFullDateTime(challenge.deadline, true)}`}
            />
            <BasicInfoBottomRow
              icon={<LuCalendarDays size={20} />}
              title="OT 일자"
              content={`${formatFullDateTime(challenge.startDate, true)}`}
            />
          </div>
        )}
        <div className="flex flex-1 flex-col items-center justify-center gap-y-5 rounded-md bg-neutral-95 px-6 pb-9 pt-5">
          <div className="flex w-full flex-col gap-y-6">
            <div className="flex w-full flex-col gap-y-[14px]">
              <p className="text-small18 font-bold text-black">
                {challenge.title}
              </p>
              <div className="flex flex-col gap-y-0.5 text-xsmall14">
                {priceReason.map((reason, index) => (
                  <div key={index} className="flex items-center gap-x-0.5">
                    <ChevronDown width={24} height={24} />
                    <p className="whitespace-pre text-black">{reason}</p>
                  </div>
                ))}
              </div>
            </div>
            {priceInfo && (
              <div className="flex w-full flex-col gap-y-2.5 border-b border-neutral-80 pb-[14px] pt-2.5 text-neutral-0">
                <div className="flex w-full items-center justify-between gap-x-4 text-xsmall16">
                  <span className="font-medium">정가</span>
                  <span>{regularPrice?.toLocaleString()}원</span>
                </div>
                <div className="flex w-full items-center justify-between gap-x-4 text-xsmall16">
                  <span className="font-bold" style={{ color: colors.primary }}>
                    {getDiscountPercent(
                      priceInfo.price || 0,
                      priceInfo.discount || 0,
                    )}
                    % 할인
                  </span>
                  <span>-{priceInfo.discount?.toLocaleString()}원</span>
                </div>
                <div className="flex w-full items-center justify-between gap-x-4 text-xsmall16">
                  <span className="font-bold text-black">
                    미션 모두 수행시, 환급
                  </span>
                  <span>-{priceInfo.refund?.toLocaleString()}원</span>
                </div>
              </div>
            )}
          </div>
          {priceInfo && (
            <div className="flex w-full flex-col gap-y-4">
              <div className="flex w-full items-center justify-between text-small20 font-medium text-neutral-0">
                <p>할인 적용가</p>
                <p className="text-small20 font-medium text-neutral-0">
                  {totalPrice.toLocaleString()}원
                </p>
              </div>
              {showMonthlyPrice && (
                <div className="flex w-full flex-col items-end gap-y-2">
                  <div style={{ color: colors.primary }}>
                    <span className="mr-1 text-medium22 font-semibold">월</span>
                    <span className="text-xxlarge32 font-bold">
                      {monthlyPrice
                        ? `${monthlyPrice.toLocaleString()}원`
                        : '계산 중'}
                    </span>
                  </div>
                  <p className="text-xsmall14 text-neutral-30">
                    {isLoading
                      ? '무이자 할부 시'
                      : `${banks.join(', ')} ${installmentMonths}개월 무이자 할부 시`}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ChallengeInfoBottom;
