import { useGetTossCardPromotion } from '@/api/payment';
import AnnouncementIcon from '@/assets/icons/announcement.svg?react';
import ClockIcon from '@/assets/icons/clock.svg?react';
import WalletIcon from '@/assets/icons/credit-card.svg?react';
import LaptopIcon from '@/assets/icons/laptop.svg?react';
import MentorIcon from '@/assets/icons/mentor.svg?react';
import { LiveIdSchema } from '@/schema';
import {
  formatDate,
  formatFullDateTime,
  formatTime,
} from '@/utils/formatDateString';
import BasicInfoRow from '@components/common/program/program-detail/basicInfo/BasicInfoRow';

export const getDiscountPercent = (
  originalPrice: number,
  discountPrice: number,
): number => {
  if (originalPrice === 0) return 0;
  return Math.round((discountPrice / originalPrice) * 100);
};

const LiveBasicInfo = ({ live }: { live: LiveIdSchema }) => {
  const { data, isLoading } = useGetTossCardPromotion();

  const findCard = () => {
    if (!data) return { months: null, banks: [] };

    const allMonths = data.interestFreeCards.flatMap(
      (card) => card.installmentFreeMonths,
    );
    const uniqueMonths = Array.from(new Set(allMonths)).sort((a, b) => b - a);

    const targetMonth = uniqueMonths[1] ?? uniqueMonths[0] ?? null;
    if (!targetMonth) return { months: null, banks: [] };

    // 선택된 개월 수를 제공하는 은행 목록 필터링
    const banks = data.interestFreeCards
      .filter((card) => card.installmentFreeMonths.includes(targetMonth))
      .map((card) => card.cardCompany);

    return { months: targetMonth, banks };
  };

  const { months: installmentMonths, banks } = findCard();
  const monthlyPrice =
    installmentMonths && live.priceInfo
      ? Math.round(
          ((live.priceInfo.price ?? 0) - (live.priceInfo.discount ?? 0)) /
            installmentMonths,
        )
      : null;

  return (
    <div className="flex flex-col gap-6 pb-10 pt-8 md:flex-row md:pb-20 md:pt-[50px]">
      <img
        src={live.thumbnail}
        alt="챌린지 썸네일"
        className="aspect-[4/3] w-full bg-neutral-45 object-cover md:w-3/5"
      />
      <div className="flex w-full flex-col gap-y-3 md:w-2/5">
        <div className="flex w-full items-center justify-center rounded-md bg-neutral-95 px-6 py-5">
          <div className="flex w-full flex-col gap-y-5 text-primary-90">
            <BasicInfoRow
              icon={<ClockIcon />}
              title="진행 기간"
              content={`${formatDate(live.startDate)}\n${formatTime(live.startDate)} - ${formatTime(live.endDate)}`}
            />
            <BasicInfoRow
              icon={<AnnouncementIcon />}
              title="모집 마감"
              content={`${formatFullDateTime(live.deadline, true)}`}
            />
            <BasicInfoRow
              icon={<MentorIcon />}
              title="멘토 소개"
              content={`${live.mentorName} 멘토`}
            />
            <BasicInfoRow
              icon={<LaptopIcon />}
              title="진행 방식"
              content={
                live.progressType === 'ONLINE'
                  ? 'LIVE/온라인'
                  : live.progressType === 'OFFLINE'
                    ? '오프라인'
                    : '온라인/오프라인'
              }
            />
          </div>
        </div>
        <div className="flex w-full flex-col items-center justify-center gap-y-3 rounded-md bg-neutral-95 px-6 py-5">
          <div className="flex w-full flex-col gap-y-2.5">
            <div className="flex w-full items-center gap-x-2">
              <WalletIcon className="text-primary-90" />
              <span className="text-xsmall16 font-semibold">가격</span>
            </div>
            <div className="flex w-full flex-col gap-y-2.5 border-b border-neutral-80 py-2.5 text-neutral-0">
              <div className="flex w-full items-center justify-between gap-x-4">
                <span className="text-xsmall16">정가</span>
                <span>{live.priceInfo.price?.toLocaleString()}원</span>
              </div>
              <div className="flex w-full items-center justify-between gap-x-4">
                <span className="text-xsmall16 font-bold text-primary">
                  {getDiscountPercent(
                    live.priceInfo.price ?? 0,
                    live.priceInfo.discount ?? 0,
                  )}
                  % 할인
                </span>
                <span>-{live.priceInfo.discount?.toLocaleString()}원</span>
              </div>
            </div>
          </div>
          <div className="w-full text-end text-xxlarge32 font-bold text-neutral-0">
            {(
              (live.priceInfo.price ?? 0) - (live.priceInfo.discount ?? 0)
            ).toLocaleString()}
            원
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveBasicInfo;
