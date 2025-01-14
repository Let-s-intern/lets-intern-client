import { LuCalendarDays } from 'react-icons/lu';

import Announcement from '@/assets/icons/announcement.svg?react';
import ChevronDown from '@/assets/icons/chevron-down.svg?react';
import ClockIcon from '@/assets/icons/clock.svg?react';
import { useInstallmentPayment } from '@/hooks/useInstallmentPayment';
import { ChallengeIdPrimitive, challengeTypeSchema } from '@/schema';
import {
  formatFullDateTime,
  formatFullDateTimeWithOutYear,
} from '@/utils/formatDateString';
import { ChallengeColor } from '@components/ChallengeView';
import BasicInfoRow from '@components/common/program/program-detail/basicInfo/BasicInfoRow';
import dayjs from 'dayjs';

const { PERSONAL_STATEMENT } = challengeTypeSchema.enum;

export const getDiscountPercent = (
  originalPrice: number,
  discountPrice: number,
): number => {
  if (originalPrice === 0) return 0;
  return Math.round((discountPrice / originalPrice) * 100);
};

const ChallengeBasicInfo = ({
  challenge,
  colors,
}: {
  challenge: ChallengeIdPrimitive;
  colors: ChallengeColor;
}) => {
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
  const showMonthlyPrice =
    priceInfo && totalPrice + (priceInfo.refund || 0) >= 50000;
  const regularPrice =
    priceInfo.challengePriceType === 'CHARGE'
      ? priceInfo.price
      : (priceInfo.price ?? 0) + (priceInfo.refund ?? 0); // 정가

  const priceReason = (() => {
    switch (challenge.challengeType) {
      case PERSONAL_STATEMENT:
        return [
          `자기소개서 최다 빈출 문항 작성 가이드\n(무제한 업데이트)`,
          `기업별 합격 자기소개서 예시 및 패턴 분석`,
          `PDF 총 30페이지 분량 추가 자료`,
          `렛츠커리어 공식 커뮤니티 참여`,
        ];

      // 포트폴리오 추가 예정

      default:
        return [
          `단계별 취업 준비 교육 자료 및 템플릿\n(무제한 업데이트)`,
          `마스터 이력서 작성 가이드`,
          `PDF 총 30페이지 분량 추가 자료`,
          `렛츠커리어 공식 커뮤니티 참여`,
        ];
    }
  })();

  const challengeStartDate = challenge.startDate
    ? dayjs(challenge.startDate)
    : null;
  const challengeEndDate = challenge.endDate ? dayjs(challenge.endDate) : null;
  const challengeDeadline = challenge.deadline
    ? dayjs(challenge.deadline)
    : null;

  const startDate = formatFullDateTime(challengeStartDate, true);
  const endDate =
    challengeStartDate?.year() === challengeEndDate?.year()
      ? formatFullDateTimeWithOutYear(challengeEndDate, true)
      : formatFullDateTime(challengeEndDate, true);

  return (
    <div className="flex flex-col gap-6 pb-10 md:flex-row md:pb-20">
      <img
        src={challenge.thumbnail}
        alt="챌린지 썸네일"
        className="aspect-[4/3] h-auto w-full rounded-md object-contain md:w-3/5"
        style={{ backgroundColor: colors.thumbnailBg }}
      />
      <div className="flex flex-col w-full gap-y-3 md:w-2/5">
        <div className="flex items-center justify-center w-full px-6 py-5 rounded-md bg-neutral-95">
          <div
            className="flex flex-col w-full gap-y-5"
            style={{ color: colors.primary }}
          >
            <BasicInfoRow
              icon={<Announcement />}
              title="진행 기간"
              content={`${startDate}\n- ${endDate}`}
            />
            <BasicInfoRow
              icon={<ClockIcon />}
              title="모집 마감"
              content={`${formatFullDateTime(challengeDeadline, true)}`}
            />
            <BasicInfoRow
              icon={<LuCalendarDays size={20} />}
              title="OT 일자"
              content={`${formatFullDateTime(challengeStartDate, true)}`}
            />
          </div>
        </div>
        <div className="flex flex-col items-center justify-center w-full px-6 pt-5 rounded-md gap-y-5 bg-neutral-95 pb-9">
          <div className="flex flex-col w-full gap-y-6">
            <div className="flex w-full flex-col gap-y-[14px]">
              <p className="font-bold text-small18">{challenge.title}</p>
              <div className="flex w-full flex-col gap-y-0.5 text-xsmall14">
                {priceReason.map((reason, index) => (
                  <div key={index} className="flex w-full gap-x-0.5">
                    <ChevronDown
                      className="-mt-0.5 shrink-0 text-neutral-0"
                      width={24}
                      height={24}
                    />
                    <p className="text-black whitespace-pre grow text-wrap break-keep">
                      {reason}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            {priceInfo && (
              <div className="flex w-full flex-col gap-y-2.5 border-b border-neutral-80 pb-[14px] pt-2.5 text-neutral-0">
                <div className="flex items-center justify-between w-full gap-x-4 text-xsmall16">
                  <span className="font-medium">정가</span>
                  <span>{regularPrice?.toLocaleString()}원</span>
                </div>
                <div className="flex items-center justify-between w-full gap-x-4 text-xsmall16">
                  <span className="font-bold" style={{ color: colors.primary }}>
                    {getDiscountPercent(
                      regularPrice || 0,
                      priceInfo.discount || 0,
                    )}
                    % 할인
                  </span>
                  <span>-{priceInfo.discount?.toLocaleString()}원</span>
                </div>
                {priceInfo.challengePriceType === 'REFUND' && (
                  <div className="flex items-center justify-between w-full gap-x-4 text-xsmall16">
                    <span className="font-bold text-black">
                      미션 모두 수행시, 환급
                    </span>
                    <span>-{priceInfo.refund?.toLocaleString()}원</span>
                  </div>
                )}
              </div>
            )}
          </div>
          {priceInfo && (
            <div className="flex flex-col w-full gap-y-4">
              <div className="flex items-center justify-between w-full font-medium text-small20 text-neutral-0">
                <p>할인 적용가</p>
                <p className="font-medium text-small20 text-neutral-0">
                  {totalPrice.toLocaleString()}원
                </p>
              </div>
              {showMonthlyPrice && (
                <div className="flex flex-col items-end w-full gap-y-2">
                  <div style={{ color: colors.primary }}>
                    <span className="mr-1 font-semibold text-medium22">월</span>
                    <span className="font-bold text-xxlarge32">
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
    </div>
  );
};

export default ChallengeBasicInfo;
