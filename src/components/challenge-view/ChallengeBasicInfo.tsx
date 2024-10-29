import AnnouncementIcon from '@/assets/icons/announcement.svg?react';
import CalendarIcon from '@/assets/icons/calendar.svg?react';
import ChevronDown from '@/assets/icons/chevron-down.svg?react';
import ClockIcon from '@/assets/icons/clock.svg?react';
import WalletIcon from '@/assets/icons/credit-card.svg?react';
import LaptopIcon from '@/assets/icons/laptop.svg?react';
import MentorIcon from '@/assets/icons/mentor.svg?react';
import { ChallengeIdSchema } from '@/schema';
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

const ChallengeBasicInfo = ({
  challenge,
  isLive,
}: {
  challenge: ChallengeIdSchema;
  isLive?: boolean;
}) => {
  return (
    <div className="flex flex-col gap-6 pb-10 md:flex-row md:pb-20">
      <img
        src={challenge.thumbnail}
        alt="챌린지 썸네일"
        className="aspect-[4/3] w-full bg-neutral-45 object-cover md:w-3/5"
      />
      <div className="flex w-full flex-col gap-y-3 md:w-2/5">
        <div className="flex w-full items-center justify-center rounded-md bg-neutral-95 px-6 py-5">
          {isLive ? (
            <div className="text-primary-90 flex w-full flex-col gap-y-5">
              <BasicInfoRow
                icon={<ClockIcon />}
                title="진행 기간"
                content={`${formatDate(challenge.startDate)}\n${formatTime(challenge.startDate)} - ${formatTime(challenge.endDate)}`}
              />
              <BasicInfoRow
                icon={<AnnouncementIcon />}
                title="모집 마감"
                content={`${formatFullDateTime(challenge.deadline, true)}`}
              />
              <BasicInfoRow
                icon={<MentorIcon />}
                title="멘토 소개"
                content="김민지 멘토"
              />
              <BasicInfoRow
                icon={<LaptopIcon />}
                title="진행 방식"
                content="커리큘럼"
              />
            </div>
          ) : (
            <div className="text-challenge flex w-full flex-col gap-y-5">
              <BasicInfoRow
                icon={<CalendarIcon />}
                title="진행 기간"
                content={`${formatFullDateTime(challenge.startDate)}\n- ${formatFullDateTime(challenge.endDate)}`}
              />
              <BasicInfoRow
                icon={<WalletIcon />}
                title="모집 마감"
                content={`${formatFullDateTime(challenge.deadline, true)}`}
              />
              <BasicInfoRow
                icon={<MentorIcon />}
                title="OT 일자"
                content={`${formatFullDateTime(challenge.beginning, true)}`}
              />
            </div>
          )}
        </div>
        {isLive ? (
          <div className="flex w-full flex-col items-center justify-center gap-y-3 rounded-md bg-neutral-95 px-6 py-5">
            <div className="flex w-full flex-col gap-y-2.5">
              <div className="flex w-full items-center gap-x-2">
                <WalletIcon className="text-primary-90" />
                <span className="text-xsmall16 font-semibold">가격</span>
              </div>
              <div className="flex w-full flex-col gap-y-2.5 border-b border-neutral-80 py-2.5 text-neutral-0">
                <div className="flex w-full items-center justify-between gap-x-4">
                  <span className="text-xsmall16">정가</span>
                  <span>{10000}원</span>
                </div>
                <div className="flex w-full items-center justify-between gap-x-4">
                  <span className="text-xsmall16 font-bold text-primary">
                    33%할인
                  </span>
                  <span>{-10000}원</span>
                </div>
              </div>
            </div>
            <div className="w-full text-end text-xxlarge32 font-bold text-neutral-0">
              {20000}원
            </div>
          </div>
        ) : (
          <div className="flex w-full flex-col items-center justify-center gap-y-5 rounded-md bg-neutral-95 px-6 pb-9 pt-5">
            <div className="flex w-full flex-col gap-y-6">
              <div className="flex w-full flex-col gap-y-[14px]">
                <p className="text-small18 font-bold">{challenge.title}</p>
                <div className="flex flex-col gap-y-0.5 text-xsmall14">
                  <div className="flex items-center gap-x-0.5">
                    <ChevronDown
                      className="text-neutral-0"
                      width={24}
                      height={24}
                    />
                    <p>렛츠커리어 교육자료 템플릿</p>
                  </div>
                  <div className="flex items-center gap-x-0.5">
                    <ChevronDown
                      className="text-neutral-0"
                      width={24}
                      height={24}
                    />
                    <p>렛츠커리어 교육자료 템플릿</p>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex w-full flex-col gap-y-2.5 border-b border-neutral-80 py-2.5 pb-[14px] text-neutral-0">
                  <div className="flex w-full items-center justify-between gap-x-4 text-xsmall16">
                    <span className="font-medium">정가</span>
                    <span>
                      {challenge.priceInfo[0].price?.toLocaleString()}원
                    </span>
                  </div>
                  <div className="flex w-full items-center justify-between gap-x-4 text-xsmall16">
                    <span className="text-challenge font-bold">
                      {getDiscountPercent(
                        challenge.priceInfo[0].price || 0,
                        challenge.priceInfo[0].discount || 0,
                      )}
                      % 할인
                    </span>
                    <span>
                      -{challenge.priceInfo[0].discount?.toLocaleString()}원
                    </span>
                  </div>
                  <div className="flex w-full items-center justify-between gap-x-4 text-xsmall16">
                    <span className="font-bold text-black">
                      미션 모두 수행시, 환급
                    </span>
                    <span>
                      -{challenge.priceInfo[0].refund?.toLocaleString()}원
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex w-full flex-col gap-y-4">
              <div className="flex w-full items-center justify-between text-small20 font-medium text-neutral-0">
                <p>할인 적용가</p>
                <p className="text-xxlarge32 font-bold text-neutral-0">
                  {(
                    (challenge.priceInfo[0].price ?? 0) -
                    (challenge.priceInfo[0].discount ?? 0)
                  ).toLocaleString()}
                  원
                </p>
              </div>
              <div className="flex w-full flex-col items-end gap-y-2">
                <div className="text-challenge">
                  <span className="mr-1 text-medium22 font-semibold">월</span>
                  <span className="text-xxlarge32 font-bold">9800원</span>
                </div>
                <p className="text-xsmall14 text-neutral-30">
                  *우리은행 10개월 할부 시
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChallengeBasicInfo;