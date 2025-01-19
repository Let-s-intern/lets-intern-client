import { LuCalendarDays } from 'react-icons/lu';

import Announcement from '@/assets/icons/announcement.svg?react';
import ChevronDown from '@/assets/icons/chevron-down.svg?react';
import ClockIcon from '@/assets/icons/clock.svg?react';
import LaptopIcon from '@/assets/icons/laptop.svg?react';
import {
  LOCALIZED_YYYY_MDdd_HH,
  LOCALIZED_YYYY_MDdd_HHmm,
} from '@/data/dayjsFormat';
import { useInstallmentPayment } from '@/hooks/useInstallmentPayment';
import { ChallengeIdSchema, challengeTypeSchema } from '@/schema';
import {
  formatFullDateTime,
  formatFullDateTimeWithOutYear,
} from '@/utils/formatDateString';
import { ChallengeColor } from '@components/ChallengeView';
import BasicInfoBottomRow from '@components/common/program/program-detail/basicInfo/BasicInfoBottomRow';
import BasicInfoRow from '@components/common/program/program-detail/basicInfo/BasicInfoRow';
import Heading2 from '@components/common/ui/Heading2';
import { useMediaQuery } from '@mui/material';

const { PERSONAL_STATEMENT } = challengeTypeSchema.enum;

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

      default:
        return [
          `단계별 취업 준비 교육 자료 및 템플릿\n(무제한 업데이트)`,
          `마스터 이력서 작성 가이드`,
          `PDF 총 30페이지 분량 추가 자료`,
          `렛츠커리어 공식 커뮤니티 참여`,
        ];
    }
  })();

  const startDate = formatFullDateTime(challenge.startDate, true);
  const endDate =
    challenge.startDate?.year() === challenge.endDate?.year()
      ? formatFullDateTimeWithOutYear(challenge.endDate, true)
      : formatFullDateTime(challenge.endDate, true);

  return (
    <section className="flex w-full max-w-[1000px] flex-col gap-y-8 px-5 pb-8 md:gap-y-[70px] md:px-10 md:pb-[130px] lg:px-0">
      <Heading2>모집개요</Heading2>
      <div
        className="flex flex-col w-full gap-3 md:flex-row"
        style={{ color: colors.primary }}
      >
        {isMobile ? (
          <div className="flex items-center justify-center flex-1 w-full px-6 py-5 rounded-md bg-neutral-95">
            <div className="flex flex-col w-full gap-y-5">
              <BasicInfoRow
                icon={<Announcement />}
                title="진행 기간"
                content={`${startDate}\n-${endDate}`}
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
                content={
                  <>
                    {challenge.startDate?.get('minute') === 0
                      ? challenge.startDate?.format(LOCALIZED_YYYY_MDdd_HH)
                      : challenge.startDate?.format(
                          LOCALIZED_YYYY_MDdd_HHmm,
                        )}{' '}
                    ~{' '}
                    {challenge.startDate?.add(40, 'minute').format('HH시 mm분')}
                    <br />
                    <span className="text-xxsmall12 text-neutral-35 md:text-xsmall14">
                      *실시간 참여 권장 (불참시 녹화본 제공 가능)
                    </span>
                  </>
                }
              />
            </div>
          </div>
        ) : (
          <div
            className="flex flex-col flex-1 w-full gap-y-4"
            style={{ color: colors.primary }}
          >
            <BasicInfoBottomRow
              icon={<Announcement />}
              title="진행 기간"
              content={`${startDate}\n- ${endDate}`}
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
              content={
                <>
                  {challenge.startDate?.get('minute') === 0
                    ? challenge.startDate?.format(LOCALIZED_YYYY_MDdd_HH)
                    : challenge.startDate?.format(
                        LOCALIZED_YYYY_MDdd_HHmm,
                      )}{' '}
                  ~ {challenge.startDate?.add(40, 'minute').format('HH시 mm분')}
                  <br />
                  <span className="text-xxsmall12 text-neutral-35 md:text-xsmall14">
                    *실시간 참여 권장 (불참시 녹화본 제공 가능)
                  </span>
                </>
              }
            />
          </div>
        )}
        <div className="flex flex-col items-center justify-center flex-1 w-full px-6 pt-5 rounded-md gap-y-5 bg-neutral-95 pb-9">
          <div className="flex flex-col w-full gap-y-6">
            <div className="flex w-full flex-col gap-y-[14px]">
              <p className="font-bold text-black text-small18">
                {challenge.title}
              </p>
              <div className="flex w-full flex-col gap-y-0.5 text-xsmall14">
                {priceReason.map((reason, index) => (
                  <div key={index} className="flex w-full gap-x-0.5">
                    <ChevronDown
                      width={24}
                      height={24}
                      className="shrink-0 text-neutral-0"
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
                <div className="flex items-center justify-between w-full gap-x-4 text-xsmall16">
                  <span className="font-bold text-black">
                    미션 모두 수행시, 환급
                  </span>
                  <span>-{priceInfo.refund?.toLocaleString()}원</span>
                </div>
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
    </section>
  );
};

export default ChallengeInfoBottom;
