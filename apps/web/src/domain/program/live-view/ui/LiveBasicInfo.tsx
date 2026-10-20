import AnnouncementIcon from '@/assets/icons/announcement.svg?react';
import ClockIcon from '@/assets/icons/clock.svg?react';
import WalletIcon from '@/assets/icons/credit-card.svg?react';
import LaptopIcon from '@/assets/icons/laptop.svg?react';
import MentorIcon from '@/assets/icons/mentor.svg?react';
import LoadingContainer from '@/common/loading/LoadingContainer';
import { useGetMembershipPrivilege } from '@/domain/all-in-one-pass/api/privilege';
import BasicInfoRow from '@/domain/program/program-detail/basicInfo/BasicInfoRow';
import { LiveIdSchema } from '@/schema';
import {
  formatDate,
  formatFullDateTime,
  formatTime,
} from '@/utils/formatDateString';

export const getDiscountPercent = (
  originalPrice: number,
  discountPrice: number,
): number => {
  if (originalPrice === 0) return 0;
  return Math.round((discountPrice / originalPrice) * 100);
};

const LiveBasicInfo = ({
  live,
  liveId,
}: {
  live: LiveIdSchema;
  liveId: string;
}) => {
  const { data: privilege, isLoading: isPrivilegeLoading } =
    useGetMembershipPrivilege('LIVE', Number(liveId));
  const isPrivilegePending = isPrivilegeLoading;
  const hasPrivilege = privilege?.hasPrivilege ?? false;
  const basePrice = live.priceInfo.price ?? 0;
  const baseDiscount = live.priceInfo.discount ?? 0;
  const discountedPrice = basePrice - baseDiscount;
  const finalPrice = hasPrivilege ? 0 : discountedPrice;

  return (
    <section className="flex flex-col gap-6 pb-10 md:flex-row md:pb-20">
      <img
        src={live.thumbnail ?? undefined}
        alt="챌린지 썸네일"
        className="bg-neutral-95 w-full rounded-md object-contain md:w-3/5"
      />
      <div className="flex w-full flex-col gap-y-3 md:w-2/5">
        <div className="bg-neutral-95 flex w-full items-center justify-center rounded-md px-6 py-5">
          <div className="text-primary-90 flex w-full flex-col gap-y-5">
            <BasicInfoRow
              icon={<AnnouncementIcon />}
              title="진행 기간"
              content={`${formatDate(live.startDate)}\n${formatTime(live.startDate)} - ${formatTime(live.endDate)}`}
            />
            <BasicInfoRow
              icon={<ClockIcon />}
              title="모집 마감"
              content={`${formatFullDateTime(live.deadline, true)}`}
            />
            <BasicInfoRow
              icon={<MentorIcon />}
              title="멘토 소개"
              content={`${live.mentorName} 멘토\n${live.mentorCompany} | ${live.mentorJob}`}
            />
            <BasicInfoRow
              icon={<LaptopIcon />}
              title="진행 방식"
              content={
                live.progressType === 'ONLINE'
                  ? 'LIVE/온라인'
                  : `오프라인/${live.place}`
              }
            />
          </div>
        </div>
        <div className="bg-neutral-95 flex w-full flex-col items-center justify-center gap-y-3 rounded-md px-6 py-5">
          <div className="flex w-full items-center gap-x-2">
            <WalletIcon className="text-primary-90" />
            <span className="text-xsmall16 font-semibold">가격</span>
          </div>
          <div className="relative w-full">
            <div className={isPrivilegePending ? 'invisible' : undefined}>
              <div className="border-neutral-80 text-neutral-0 flex w-full flex-col gap-y-2.5 border-b py-2.5">
                <div className="flex w-full items-center justify-between gap-x-4">
                  <span className="text-xsmall16">정가</span>
                  <span>{basePrice.toLocaleString()}원</span>
                </div>
                <div className="flex w-full items-center justify-between gap-x-4">
                  <span className="text-xsmall16 text-primary font-bold">
                    {getDiscountPercent(basePrice, baseDiscount)}% 할인
                  </span>
                  <span>-{baseDiscount.toLocaleString()}원</span>
                </div>
                {/* 비권한 시 높이만 확보 */}
                <div
                  className={`flex w-full items-center justify-between gap-x-4 ${
                    hasPrivilege ? '' : 'invisible'
                  }`}
                >
                  <span className="text-xsmall16 text-primary font-bold">
                    패스 혜택 할인
                  </span>
                  <span>-{discountedPrice.toLocaleString()}원</span>
                </div>
              </div>
              <div className="text-xxlarge32 text-neutral-0 w-full pt-3 text-end font-bold">
                {finalPrice.toLocaleString()}원
              </div>
            </div>
            {isPrivilegePending && (
              <div className="absolute inset-0 flex items-center justify-center">
                <LoadingContainer
                  text="가격을 불러오는 중입니다"
                  className="py-0"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveBasicInfo;
