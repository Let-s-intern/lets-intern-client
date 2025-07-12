import Announcement from '@/assets/icons/announcement.svg?react';
import ClockIcon from '@/assets/icons/clock.svg?react';
import Pin from '@/assets/icons/pin.svg?react';
import {
  LOCALIZED_YYYY_MDdd_HH,
  LOCALIZED_YYYY_MDdd_HHmm,
} from '@/data/dayjsFormat';
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
import ChallengePriceInfoContent from '@components/common/challenge-marketing-view/ChallengePriceInfoContent';
import BasicInfoRow from '@components/common/program/program-detail/basicInfo/BasicInfoRow';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { CSSProperties, useMemo } from 'react';
import { LuCalendarDays } from 'react-icons/lu';
import RadioButton from './RadioButton';

const {
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
  const router = useRouter();

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
  const startDate = formatFullDateTime(challenge.startDate);
  const endDate =
    challenge.startDate?.year() === challenge.endDate?.year()
      ? formatFullDateTimeWithOutYear(challenge.endDate)
      : formatFullDateTime(challenge.endDate);

  return (
    <div className="flex w-full flex-col gap-y-6 md:gap-y-5">
      <div className="flex flex-col items-stretch gap-3 md:flex-row md:gap-[22px]">
        {/* 썸네일 */}
        <div className="relative aspect-[4/3] h-full flex-1 overflow-hidden rounded-sm bg-blue-500">
          {challenge.thumbnail && (
            <Image
              className="object-cover"
              src={challenge.thumbnail}
              alt={`${challenge.title} 썸네일`}
              fill={true}
              priority
            />
          )}
        </div>

        {/* 챌린지 정보 */}
        <div className="w-full md:max-w-[424px]">
          <h1 className="mb-2 py-1 text-medium22 font-bold text-neutral-0 md:text-medium24">
            {challenge.title}
          </h1>

          <ChallengePriceInfoContent priceInfoList={challenge.priceInfo} />
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
      </div>
    </div>
  );
};

export default ChallengeBasicInfo;
