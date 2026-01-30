import { twMerge } from '@/lib/twMerge';
import { ChallengeIdPrimitive } from '@/schema';
import getChallengeOptionPriceInfo from '@/utils/getChallengeOptionPriceInfo';
import getChallengeSchedule from '@/utils/getChallengeSchedule';
import { Fragment, ReactNode, useMemo } from 'react';
import MainTitle from '../ui/MainTitle';
import { DEFAULT_COLOR } from '../utils/getChallengeThemeColor';

interface PriceInfo {
  title: string;
  originalPrice: number;
  discountAmount: number;
}

const Box = ({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={twMerge(
        'flex flex-col items-stretch gap-5 rounded-sm bg-neutral-95 px-4 py-5 md:flex-1',
        className,
      )}
    >
      {children}
    </div>
  );
};

const Label = ({
  children,
  themeColor = DEFAULT_COLOR,
}: {
  children?: ReactNode;
  themeColor?: string;
}) => {
  return (
    <span
      className="text-xsmall14 font-semibold md:text-xsmall16"
      style={{ color: themeColor }}
    >
      {children}
    </span>
  );
};

const InfoWrapper = ({
  label,
  children,
  themeColor = DEFAULT_COLOR,
}: {
  label: string;
  children?: ReactNode;
  themeColor?: string;
}) => {
  return (
    <div className="flex flex-col gap-2">
      <Label themeColor={themeColor}>{label}</Label>
      <p className="whitespace-pre-line text-xsmall14 font-medium text-neutral-0 md:text-xsmall16">
        {children}
      </p>
    </div>
  );
};

const PriceView = ({
  originalPrice,
  discountAmount = 0,
}: {
  originalPrice: number;
  discountAmount?: number;
}) => {
  const percent = ((discountAmount / originalPrice) * 100).toFixed(0);
  const sellingPrice = originalPrice - discountAmount;
  const hasDiscount = discountAmount > 0;

  return (
    <div className="flex shrink-0 flex-col items-end">
      {hasDiscount && (
        <span className="inline-flex gap-1 text-xsmall14">
          <span className="font-semibold text-system-error/90">{percent}%</span>
          <span className="font-medium text-neutral-40 line-through">
            {originalPrice.toLocaleString()}원
          </span>
        </span>
      )}

      <span className="text-small20 font-bold text-neutral-0">
        {sellingPrice.toLocaleString()}원
      </span>
    </div>
  );
};

const PriceListItem = ({ priceInfo }: { priceInfo: PriceInfo }) => {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xsmall14 font-medium text-neutral-0 md:text-xsmall16">
        {priceInfo.title}
      </span>
      <PriceView
        originalPrice={priceInfo.originalPrice}
        discountAmount={priceInfo.discountAmount}
      />
    </div>
  );
};

interface Props {
  challenge: ChallengeIdPrimitive;
  themeColor?: string;
}

export default function ChallengeRecruitmentInfoSection({
  challenge,
  themeColor = DEFAULT_COLOR,
}: Props) {
  const { startDate, deadline, startDateWithTime, endDateWithTime } =
    getChallengeSchedule(challenge);

  const basicPriceInfo = challenge.priceInfo.find(
    (item) => item.challengePricePlanType === 'BASIC',
  );
  const standardPriceInfo = challenge.priceInfo.find(
    (item) => item.challengePricePlanType === 'STANDARD',
  );
  const premiumPriceInfo = challenge.priceInfo.find(
    (item) => item.challengePricePlanType === 'PREMIUM',
  );

  const {
    basicRegularPrice,
    basicDiscountAmount,
    standardRegularPrice,
    standardDiscountAmount,
    premiumRegularPrice,
    premiumDiscountAmount,
  } = getChallengeOptionPriceInfo(challenge.priceInfo);

  const priceList: PriceInfo[] = useMemo(() => {
    const result = [];

    if (premiumRegularPrice !== 0) {
      result.push({
        title: premiumPriceInfo?.title || '프리미엄',
        originalPrice: premiumRegularPrice,
        discountAmount: premiumDiscountAmount,
      });
    }

    if (standardRegularPrice !== 0) {
      result.push({
        title: standardPriceInfo?.title || '스탠다드',
        originalPrice: standardRegularPrice,
        discountAmount: standardDiscountAmount,
      });
    }

    result.push({
      title: basicPriceInfo?.title || '베이직',
      originalPrice: basicRegularPrice,
      discountAmount: basicDiscountAmount,
    });

    return result;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [challenge.priceInfo]);

  return (
    <section className="flex flex-col items-center px-5 pb-[60px] md:px-0 md:pb-[120px]">
      <MainTitle className="mb-8 md:mb-[60px]">모집개요</MainTitle>

      <div className="flex w-full max-w-[1000px] items-stretch max-md:flex-col md:flex-row md:gap-3">
        <Box className="rounded-b-none pb-0 md:rounded-sm md:pb-5">
          <InfoWrapper label="시작 일자" themeColor={themeColor}>
            {startDate}
          </InfoWrapper>
          <InfoWrapper label="진행 기간" themeColor={themeColor}>
            {startDateWithTime} -
            <br /> {endDateWithTime}
          </InfoWrapper>
        </Box>
        <Box className="mb-5 rounded-t-none md:mb-0 md:rounded-sm">
          <InfoWrapper label="모집 마감" themeColor={themeColor}>
            {deadline}
          </InfoWrapper>
          <InfoWrapper label="OT 안내" themeColor={themeColor}>
            챌린지 대시보드 입장 후 0회차 미션을 통해 OT 영상 시청 부탁드립니다.
          </InfoWrapper>
          <InfoWrapper label="진행방식" themeColor={themeColor}>
            100% 온라인
          </InfoWrapper>
        </Box>
        <Box>
          <Label themeColor={themeColor}>가격</Label>
          <div className="flex flex-col items-stretch">
            {priceList.map((item, index) => {
              return (
                <Fragment key={item.title}>
                  <PriceListItem priceInfo={item} />
                  {index < priceList.length - 1 && (
                    <hr className="my-2 border-t border-neutral-80" />
                  )}
                </Fragment>
              );
            })}
          </div>
        </Box>
      </div>
    </section>
  );
}
