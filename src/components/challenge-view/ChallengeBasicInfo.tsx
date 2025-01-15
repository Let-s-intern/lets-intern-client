import Announcement from '@/assets/icons/announcement.svg?react';
import ChevronDown from '@/assets/icons/chevron-down.svg?react';
import ClockIcon from '@/assets/icons/clock.svg?react';
import Pin from '@/assets/icons/pin.svg?react';
import Polygon from '@/assets/icons/polygon-sharp.svg?react';
import { useInstallmentPayment } from '@/hooks/useInstallmentPayment';
import {
  ActiveChallengeType,
  ChallengeIdSchema,
  challengeTypeSchema,
} from '@/schema';
import {
  formatFullDate,
  formatFullDateTime,
  formatFullDateTimeWithOutYear,
} from '@/utils/formatDateString';
import { ChallengeColor } from '@components/ChallengeView';
import BasicInfoRow from '@components/common/program/program-detail/basicInfo/BasicInfoRow';
import dayjs from 'dayjs';
import { LuCalendarDays } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';
import RadioButton from './RadioButton';

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
  challengeId,
  activeChallengeList,
  colors,
}: {
  challenge: ChallengeIdSchema;
  challengeId: string | undefined;
  activeChallengeList: ActiveChallengeType[] | undefined;
  colors: ChallengeColor;
}) => {
  const {
    isLoading,
    months: installmentMonths,
    banks,
  } = useInstallmentPayment();
  const navigate = useNavigate();

  const onClickActiveChallenge = (challengeId: number) => {
    navigate(`/program/challenge/${challengeId}`);
  };

  const activeOnly =
    activeChallengeList === undefined || activeChallengeList.length <= 1;

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

  const startDate = formatFullDateTime(challenge.startDate);
  const endDate =
    challenge.startDate?.year() === challenge.endDate?.year()
      ? formatFullDateTimeWithOutYear(challenge.endDate)
      : formatFullDateTime(challenge.endDate);

  return (
    <div className="flex w-full flex-col gap-y-6 pb-10 md:gap-y-5 md:pb-20">
      <div className="flex w-full gap-x-4">
        <div
          className="flex flex-1 items-center justify-center overflow-hidden rounded-ms"
          style={{ backgroundColor: colors.thumbnailBg }}
        >
          <img
            src={challenge.thumbnail}
            alt="챌린지 썸네일"
            className="aspect-[4/3] h-auto w-full max-w-[546px] object-contain"
          />
        </div>
        <div className="hidden w-[354px] shrink-0 flex-col items-center justify-center gap-y-3 rounded-ms bg-neutral-95 p-5 pb-6 md:flex">
          <div className="flex w-full flex-1 flex-col justify-between gap-y-4">
            <div className="flex w-full flex-col gap-y-2">
              <p className="text-small20 font-bold">{challenge.title}</p>
              <div className="flex w-full flex-col gap-y-0.5 text-xsmall14 font-medium text-neutral-0">
                {priceReason.map((reason, index) => (
                  <div key={index} className="flex w-full gap-x-0.5">
                    <ChevronDown
                      className="-mt-0.5 shrink-0 text-neutral-0"
                      width={24}
                      height={24}
                    />
                    <p className="grow whitespace-pre text-wrap break-keep">
                      {reason}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            {priceInfo && (
              <div className="flex w-full flex-col gap-y-1 border-b border-neutral-80 pb-2 text-neutral-0">
                <div className="flex w-full items-center justify-between gap-x-4 text-xsmall16">
                  <span className="font-medium">정가</span>
                  <span>{regularPrice?.toLocaleString()}원</span>
                </div>
                <div className="flex w-full items-center justify-between gap-x-4 text-xsmall16">
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
                  <div className="flex w-full items-center justify-between gap-x-4 text-xsmall16">
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
            <div className="flex w-full flex-col gap-y-2">
              <div className="flex w-full items-center justify-between text-xsmall16 font-semibold text-neutral-0">
                <p>할인 적용가</p>
                <p className="text-small18 text-neutral-0">
                  {totalPrice.toLocaleString()}원
                </p>
              </div>
              {showMonthlyPrice && (
                <div className="flex w-full flex-col items-end">
                  <div style={{ color: colors.primary }}>
                    <span className="mr-1 text-medium22 font-semibold">월</span>
                    <span className="text-xlarge28 font-bold">
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
      <div
        className="flex w-full flex-col gap-3 md:flex-row"
        style={{ color: colors.primary }}
      >
        {!activeOnly && (
          <div className="flex w-full flex-col gap-y-2 rounded-ms bg-neutral-95 px-4 pb-5 pt-3 md:flex-1 md:p-5 md:pt-4">
            <div className="flex w-full items-center gap-x-2">
              <Pin className="shrink-0" width={20} height={20} />
              <p className="text-xsmall16 font-semibold text-neutral-0">
                시작 일자
              </p>
              <div className="relative ml-3 animate-bounce-x">
                <Polygon
                  className="absolute left-0 top-1/2 -translate-x-[8px] -translate-y-[3px] transform"
                  style={{ color: colors.primary }}
                  width={10}
                  height={8}
                />
                <span
                  className="rounded-xxs px-2 py-1 text-xxsmall12 font-medium text-white"
                  style={{ backgroundColor: colors.primary }}
                >
                  참여 가능한 일자를 선택해주세요!
                </span>
              </div>
            </div>
            <div className="flex w-full flex-col gap-y-2">
              {challengeId !== undefined &&
                activeChallengeList !== undefined &&
                activeChallengeList.length > 0 &&
                activeChallengeList
                  .sort((a, b) =>
                    dayjs(a.startDate).isAfter(b.startDate) ? 1 : -1,
                  )
                  .map((activeChallenge, index) => (
                    <RadioButton
                      key={index}
                      color={colors.primary}
                      checked={activeChallenge.id === Number(challengeId)}
                      label={formatFullDate(dayjs(activeChallenge.startDate))}
                      onClick={() => onClickActiveChallenge(activeChallenge.id)}
                    />
                  ))}
            </div>
          </div>
        )}
        <div className="hidden w-full flex-col gap-y-3 rounded-ms bg-neutral-95 px-4 pb-5 pt-3 md:flex md:flex-1 md:p-5 md:pt-4">
          {activeOnly ? (
            <>
              <div className="flex w-full flex-col gap-y-2">
                <div className="flex w-full items-center gap-x-2">
                  <Pin className="shrink-0" width={20} height={20} />
                  <p className="text-xsmall16 font-semibold text-neutral-0">
                    시작 일자
                  </p>
                </div>
                <p className="text-xsmall16 text-neutral-0">
                  {formatFullDate(challenge.startDate)}
                </p>
              </div>
              <BasicInfoRow
                icon={<Announcement />}
                title="진행 기간"
                content={`${startDate} - ${endDate}`}
              />
            </>
          ) : (
            <BasicInfoRow
              icon={<Announcement />}
              title="진행 기간"
              content={`${startDate}-\n${endDate}`}
            />
          )}
        </div>
        <div className="flex w-full flex-col gap-y-3 rounded-ms bg-neutral-95 px-4 pb-5 pt-3 md:flex-1 md:p-5 md:pt-4">
          <div className="w-full md:hidden">
            <BasicInfoRow
              icon={<Announcement />}
              title="진행 기간"
              content={`${startDate}-\n${endDate}`}
            />
          </div>
          <BasicInfoRow
            icon={<ClockIcon />}
            title="모집 마감"
            content={`${formatFullDateTime(challenge.deadline)}`}
          />
          <BasicInfoRow
            icon={<LuCalendarDays size={20} />}
            title="OT 일자"
            content={`${formatFullDateTime(challenge.startDate)}`}
          />
        </div>
        <div className="flex w-full flex-col items-center justify-center gap-y-3 rounded-ms bg-neutral-95 px-4 pb-6 pt-5 md:hidden">
          <div className="flex w-full flex-col gap-y-4">
            <div className="flex w-full flex-col gap-y-2">
              <p className="text-small18 font-bold text-neutral-0">
                {challenge.title}
              </p>
              <div className="flex w-full flex-col gap-y-1 text-xsmall14 text-neutral-0">
                {priceReason.map((reason, index) => (
                  <div key={index} className="flex w-full gap-x-0.5">
                    <ChevronDown
                      className="-mt-0.5 shrink-0 text-neutral-0"
                      width={24}
                      height={24}
                    />
                    <p className="grow whitespace-pre text-wrap break-keep">
                      {reason}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            {priceInfo && (
              <div className="flex w-full flex-col gap-y-2 border-b border-neutral-80 pb-2 text-neutral-0">
                <div className="flex w-full items-center justify-between gap-x-4 text-xsmall16">
                  <span className="font-medium">정가</span>
                  <span>{regularPrice?.toLocaleString()}원</span>
                </div>
                <div className="flex w-full items-center justify-between gap-x-4 text-xsmall16">
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
                  <div className="flex w-full items-center justify-between gap-x-4 text-xsmall16">
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
            <div className="flex w-full flex-col gap-y-4">
              <div className="flex w-full items-center justify-between text-xsmall16 font-medium text-neutral-0">
                <p>할인 적용가</p>
                <p className="text-small18 font-medium text-neutral-0">
                  {totalPrice.toLocaleString()}원
                </p>
              </div>
              {showMonthlyPrice && (
                <div className="flex w-full flex-col items-end gap-y-2">
                  <div style={{ color: colors.primary }}>
                    <span className="mr-1 text-medium22 font-semibold">월</span>
                    <span className="text-xlarge28 font-bold">
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
