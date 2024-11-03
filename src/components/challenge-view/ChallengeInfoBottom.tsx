import { useGetTossCardPromotion } from '@/api/payment';
import CalendarIcon from '@/assets/icons/calendar.svg?react';
import ChevronDown from '@/assets/icons/chevron-down.svg?react';
import WalletIcon from '@/assets/icons/credit-card.svg?react';
import LaptopIcon from '@/assets/icons/laptop.svg?react';
import MentorIcon from '@/assets/icons/mentor.svg?react';
import { ChallengeIdSchema } from '@/schema';
import { formatFullDateTime } from '@/utils/formatDateString';
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
}: {
  challenge: ChallengeIdSchema;
}) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
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
    installmentMonths && challenge.priceInfo[0]
      ? Math.round(
          ((challenge.priceInfo[0].price ?? 0) -
            (challenge.priceInfo[0].discount ?? 0) -
            (challenge.priceInfo[0].refund ?? 0)) /
            installmentMonths,
        )
      : null;

  return (
    <div className="flex w-full flex-col gap-y-8 py-8 md:gap-y-20">
      <div className="w-full text-small20 font-bold text-neutral-0 md:text-center">
        모집개요
      </div>
      <div className="flex w-full flex-col gap-3 md:flex-row">
        {isMobile ? (
          <div className="flex flex-1 items-center justify-center rounded-md bg-neutral-95 px-6 py-5">
            <div className="flex w-full flex-col gap-y-5 text-challenge">
              <BasicInfoRow
                icon={<CalendarIcon />}
                title="진행 기간"
                content={`${formatFullDateTime(challenge.startDate, true)}\n- ${formatFullDateTime(challenge.endDate, true)}`}
              />
              <BasicInfoRow
                icon={<LaptopIcon />}
                title="진행 방식"
                content={`100% 온라인\n(챌린지 대시보드, 오픈채팅방)`}
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
          </div>
        ) : (
          <div className="flex flex-1 flex-col gap-y-4">
            <BasicInfoBottomRow
              icon={<CalendarIcon />}
              title="진행 기간"
              content={`${formatFullDateTime(challenge.startDate)}\n- ${formatFullDateTime(challenge.endDate)}`}
            />
            <BasicInfoBottomRow
              icon={<LaptopIcon />}
              title="진행 방식"
              content={`100% 온라인\n(챌린지 대시보드, 오픈채팅방)`}
            />
            <BasicInfoBottomRow
              icon={<WalletIcon />}
              title="모집 마감"
              content={`${formatFullDateTime(challenge.deadline, true)}`}
            />
            <BasicInfoBottomRow
              icon={<MentorIcon />}
              title="OT 일자"
              content={`${formatFullDateTime(challenge.beginning, true)}`}
            />
          </div>
        )}
        <div className="flex flex-1 flex-col items-center justify-center gap-y-5 rounded-md bg-neutral-95 px-6 pb-9 pt-5">
          <div className="flex w-full flex-col gap-y-6">
            <div className="flex w-full flex-col gap-y-[14px]">
              <p className="text-small18 font-bold">
                이력서 & 자기소개서 2주 완성 챌린지
              </p>
              <div className="flex flex-col gap-y-0.5 text-xsmall14">
                {priceReason.map((reason, index) => (
                  <div key={index} className="flex items-center gap-x-0.5">
                    <ChevronDown
                      className="text-neutral-0"
                      width={24}
                      height={24}
                    />
                    <p className="whitespace-pre">{reason}</p>
                  </div>
                ))}
              </div>
            </div>
            {challenge.priceInfo[0] && (
              <div>
                <div className="flex w-full flex-col gap-y-2.5 border-b border-neutral-80 py-2.5 pb-[14px] text-neutral-0">
                  <div className="flex w-full items-center justify-between gap-x-4 text-xsmall16">
                    <span className="font-medium">정가</span>
                    <span>
                      {challenge.priceInfo[0].price?.toLocaleString()}원
                    </span>
                  </div>
                  <div className="flex w-full items-center justify-between gap-x-4 text-xsmall16">
                    <span className="font-bold text-challenge">
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
            )}
          </div>
          {challenge.priceInfo[0] && (
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
                  <span className="text-xxlarge32 font-bold">
                    {monthlyPrice
                      ? `${monthlyPrice.toLocaleString()}원`
                      : '계산 중'}
                  </span>
                </div>
                <p className="text-xsmall14 text-neutral-30">
                  {!data || isLoading
                    ? '무이자 할부 시'
                    : `${banks.join(', ')} ${installmentMonths}개월 무이자 할부 시`}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChallengeInfoBottom;
