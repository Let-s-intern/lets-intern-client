import Announcement from '@/assets/icons/announcement.svg?react';
import ChevronDown from '@/assets/icons/chevron-down.svg?react';
import ClockIcon from '@/assets/icons/clock.svg?react';
import Pin from '@/assets/icons/pin.svg?react';
import {
  LOCALIZED_YYYY_MDdd_HH,
  LOCALIZED_YYYY_MDdd_HHmm,
} from '@/data/dayjsFormat';
import { useInstallmentPayment } from '@/hooks/useInstallmentPayment';
import dayjs from '@/lib/dayjs';
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
import { getProgramPathname } from '@/utils/url';
import { challengeColors } from '@components/ChallengeView';
import BasicInfoRow from '@components/common/program/program-detail/basicInfo/BasicInfoRow';
import { useRouter } from 'next/navigation';
import { CSSProperties, useMemo } from 'react';
import { LuCalendarDays } from 'react-icons/lu';
import RadioButton from './RadioButton';

const {
  PERSONAL_STATEMENT,
  CAREER_START,
  PORTFOLIO,
  PERSONAL_STATEMENT_LARGE_CORP,
  EXPERIENCE_SUMMARY,
  ETC,
} = challengeTypeSchema.enum;

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
}: {
  challenge: ChallengeIdSchema;
  challengeId: string | undefined;
  activeChallengeList: ActiveChallengeType[] | undefined;
}) => {
  const styles = useMemo(() => {
    switch (challenge.challengeType) {
      case CAREER_START:
        return {
          thumbnailStyle: {
            backgroundColor: challengeColors.EDEEFE,
          },
          basicInfoStyle: {
            color: challengeColors._4D55F5,
          },
        };
      case PORTFOLIO:
        return {
          thumbnailStyle: {
            backgroundColor: challengeColors.FFF4DB,
          },
          basicInfoStyle: {
            color: challengeColors._4A76FF,
          },
        };
      case PERSONAL_STATEMENT_LARGE_CORP:
        return {
          thumbnailStyle: {
            backgroundColor: challengeColors.E6F9DE,
          },
          basicInfoStyle: {
            color: challengeColors._32B750,
          },
        };
      case EXPERIENCE_SUMMARY:
        return {
          thumbnailStyle: {
            backgroundColor: challengeColors.FFF6F4,
          },
          basicInfoStyle: {
            color: challengeColors.F26646,
          },
        };
      case ETC:
        return {
          thumbnailStyle: {
            backgroundColor: challengeColors.FFF6F4,
          },
          basicInfoStyle: {
            color: challengeColors.F26646,
          },
        };
      default:
        return {
          thumbnailStyle: {
            backgroundColor: challengeColors.EEFAFF,
          },
          basicInfoStyle: {
            color: challengeColors._14BCFF,
          },
        };
    }
  }, [challenge.challengeType]);

  const {
    isLoading,
    months: installmentMonths,
    banks,
  } = useInstallmentPayment();
  const router = useRouter();

  const handleClickActiveChallenge = (challenge: {
    id: number;
    title: string;
  }) => {
    const href = getProgramPathname({
      programType: 'challenge',
      ...challenge,
    });

    router.push(href);
  };

  const activeOnly =
    activeChallengeList === undefined || activeChallengeList.length <= 1;

  const basicPriceInfo = challenge.priceInfo.find(
    (info) => info.challengePricePlanType === 'BASIC',
  );
  const regularPrice =
    (basicPriceInfo?.price ?? 0) + (basicPriceInfo?.refund ?? 0); // 정가
  const totalPrice =
    (basicPriceInfo?.price ?? 0) - (basicPriceInfo?.discount ?? 0); // 할인 적용가 = 판매가 - 보증금
  const monthlyPrice =
    installmentMonths && basicPriceInfo
      ? Math.round(totalPrice / installmentMonths)
      : null;
  const showMonthlyPrice =
    basicPriceInfo && totalPrice + (basicPriceInfo.refund ?? 0) >= 50000;

  const priceReason = (() => {
    switch (challenge.challengeType) {
      // 자기소개서
      case PERSONAL_STATEMENT:
        return [
          `자기소개서 최다 빈출 문항 작성 가이드\n(무제한 업데이트)`,
          `기업별 합격 자기소개서 예시 및 패턴 분석`,
          `PDF 총 30페이지 분량 추가 자료`,
          `렛츠커리어 공식 커뮤니티 참여`,
        ];

      // 그 외
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
          style={styles.thumbnailStyle}
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
            {basicPriceInfo && (
              <div className="flex w-full flex-col gap-y-1 border-b border-neutral-80 pb-2 text-neutral-0">
                <div className="flex w-full items-center justify-between gap-x-4 text-xsmall16">
                  <span className="font-medium">정가</span>
                  <span>{regularPrice?.toLocaleString()}원</span>
                </div>

                {/* 할인 금액이 0이면 숨김 */}
                {basicPriceInfo.discount !== 0 && (
                  <div className="flex w-full items-center justify-between gap-x-4 text-xsmall16">
                    <span className="font-bold" style={styles.basicInfoStyle}>
                      {getDiscountPercent(
                        regularPrice || 0,
                        basicPriceInfo.discount || 0,
                      )}
                      % 할인
                    </span>
                    <span>-{basicPriceInfo.discount?.toLocaleString()}원</span>
                  </div>
                )}

                {basicPriceInfo.challengePriceType === 'REFUND' && (
                  <div className="flex w-full items-center justify-between gap-x-4 text-xsmall16">
                    <span
                      style={
                        basicPriceInfo.discount === 0
                          ? styles.basicInfoStyle
                          : undefined
                      }
                      className="font-bold text-black"
                    >
                      미션 모두 수행시, 환급
                    </span>
                    <span>-{basicPriceInfo.refund?.toLocaleString()}원</span>
                  </div>
                )}
              </div>
            )}
          </div>
          {basicPriceInfo && (
            <div className="flex w-full flex-col gap-y-2">
              <div className="flex w-full items-center justify-between text-xsmall16 font-semibold text-neutral-0">
                <p>할인 적용가</p>
                <p className="text-small18 text-neutral-0">
                  {totalPrice.toLocaleString()}원~
                </p>
              </div>
              {showMonthlyPrice && (
                <div className="flex w-full flex-col items-end">
                  <div style={styles.basicInfoStyle}>
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
        style={styles.basicInfoStyle}
      >
        {!activeOnly && (
          <div className="flex w-full flex-col gap-y-2 rounded-ms bg-neutral-95 px-4 pb-5 pt-3 md:flex-1 md:p-5 md:pt-4">
            <div className="flex w-full items-center gap-x-2">
              <Pin className="shrink-0" width={20} height={20} />
              <p className="shrink-0 text-xsmall16 font-semibold text-neutral-0">
                시작 일자
              </p>
              <span
                className="speech-bubble relative ml-3 animate-bounce-x break-keep rounded-xxs px-2 py-1 text-xxsmall12 font-normal text-white"
                style={{
                  backgroundColor: styles.basicInfoStyle.color,
                  ['--after-border-color' as keyof CSSProperties]:
                    styles.basicInfoStyle.color,
                }}
              >
                참여 가능한 일자를 선택해주세요!
              </span>
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
                      color={styles.basicInfoStyle.color}
                      checked={activeChallenge.id === Number(challengeId)}
                      label={formatFullDate(dayjs(activeChallenge.startDate))}
                      onClick={() =>
                        handleClickActiveChallenge(activeChallenge)
                      }
                    />
                  ))}
            </div>
          </div>
        )}

        {/* 데스크탑 뷰 */}
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
            content={
              <>
                {challenge.startDate?.get('minute') === 0
                  ? challenge.startDate?.format(LOCALIZED_YYYY_MDdd_HH)
                  : challenge.startDate?.format(LOCALIZED_YYYY_MDdd_HHmm)}{' '}
                ~ {challenge.startDate?.add(40, 'minute').format('HH시 mm분')}
                <br />
                <span className="text-xxsmall12 text-neutral-35 md:text-xsmall14">
                  *실시간 참여 권장 (불참시 녹화본 제공 가능)
                </span>
              </>
            }
          />
        </div>

        {/* 모바일 뷰 */}
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
            {basicPriceInfo && (
              <div className="flex w-full flex-col gap-y-2 border-b border-neutral-80 pb-2 text-neutral-0">
                <div className="flex w-full items-center justify-between gap-x-4 text-xsmall16">
                  <span className="font-medium">정가</span>
                  <span>{regularPrice?.toLocaleString()}원</span>
                </div>
                <div className="flex w-full items-center justify-between gap-x-4 text-xsmall16">
                  <span className="font-bold" style={styles.basicInfoStyle}>
                    {getDiscountPercent(
                      regularPrice || 0,
                      basicPriceInfo.discount || 0,
                    )}
                    % 할인
                  </span>
                  <span>-{basicPriceInfo.discount?.toLocaleString()}원</span>
                </div>
                {basicPriceInfo.challengePriceType === 'REFUND' && (
                  <div className="flex w-full items-center justify-between gap-x-4 text-xsmall16">
                    <span className="font-bold text-black">
                      미션 모두 수행시, 환급
                    </span>
                    <span>-{basicPriceInfo.refund?.toLocaleString()}원</span>
                  </div>
                )}
              </div>
            )}
          </div>
          {basicPriceInfo && (
            <div className="flex w-full flex-col gap-y-4">
              <div className="flex w-full items-center justify-between text-xsmall16 font-medium text-neutral-0">
                <p>할인 적용가</p>
                <p className="text-small18 font-medium text-neutral-0">
                  {totalPrice.toLocaleString()}원~
                </p>
              </div>
              {showMonthlyPrice && (
                <div className="flex w-full flex-col items-end gap-y-2">
                  <div style={styles.basicInfoStyle}>
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
