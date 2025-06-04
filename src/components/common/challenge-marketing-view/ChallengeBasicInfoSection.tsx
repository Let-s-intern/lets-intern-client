import Announcement from '@/assets/icons/announcement.svg?react';
import ChevronDown from '@/assets/icons/chevron-down.svg?react';
import ClockIcon from '@/assets/icons/clock.svg?react';
import Pin from '@/assets/icons/pin.svg?react';
import { twMerge } from '@/lib/twMerge';
import { ChallengeIdPrimitive, challengeTypeSchema } from '@/schema';
import Image from 'next/image';
import React, { ReactNode } from 'react';
import { LuCalendarDays } from 'react-icons/lu';

const { PERSONAL_STATEMENT } = challengeTypeSchema.enum;

const PlanButton = ({
  children,
  active,
}: {
  children?: string;
  active: boolean;
}) => {
  return (
    <button
      type="button"
      className={twMerge(
        'flex-1 overflow-clip rounded-xxs px-2.5 py-1 text-center',
        active
          ? 'bg-white font-medium text-neutral-0 shadow-[0px_0px_6px_rgba(0,0,0,0.08)]'
          : 'bg-transparent font-normal text-neutral-50',
      )}
    >
      <div className={active ? 'h-5' : 'h-6'}>{children}</div>
    </button>
  );
};

const IconTitle = ({
  icon,
  children,
}: {
  icon: ReactNode;
  children?: ReactNode;
}) => {
  return (
    <div className="flex items-center gap-2 font-semibold text-neutral-0">
      {icon}
      {children}
    </div>
  );
};

const ScheduleBox = ({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={twMerge(
        'flex flex-1 flex-col gap-3 rounded-xs bg-neutral-95 p-4 pb-5',
        className,
      )}
    >
      {children}
    </div>
  );
};

const ScheduleWrapper = ({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) => {
  return (
    <div className={twMerge('flex flex-col gap-1', className)}>{children}</div>
  );
};

const ScheduleDescription = ({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) => {
  return (
    <p className={twMerge('text-xsmall14 md:text-xsmall16', className)}>
      {children}
    </p>
  );
};

interface Props {
  challenge: ChallengeIdPrimitive;
}

const ChallengeBasicInfoSection: React.FC<Props> = ({ challenge }) => {
  const basicPriceInfo = challenge.priceInfo.find(
    (item) => item.challengePricePlanType === 'BASIC',
  );
  const plans = [basicPriceInfo?.title, '프리미엄', '올인원'];

  const benefits = (() => {
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

  return (
    <div className="mx-auto w-full max-w-[1000px] px-5 pb-10 pt-6 md:px-0 md:py-[60px]">
      <div className="flex flex-col items-stretch gap-3 md:flex-row md:gap-[22px]">
        {/* 썸네일 */}
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm bg-blue-500">
          <Image
            src={challenge.thumbnail ?? ''}
            alt={`${challenge.title} 썸네일`}
            fill={true}
            priority
          />
        </div>

        {/* 챌린지 정보 */}
        <div className="w-full max-w-[424px]">
          <h1 className="mb-2 py-1 text-medium22 font-bold text-neutral-0 md:text-medium24">
            {challenge.title}
          </h1>

          <div className="flex flex-col items-stretch gap-2">
            {/* 플랜 정보 */}
            <div className="rounded-xs bg-neutral-95">
              <div className="flex items-center px-3 py-2">
                {plans.map((item, index) => (
                  <PlanButton key={`plan-btn-${index}`} active={false}>
                    {item ?? '베이직'}
                  </PlanButton>
                ))}
              </div>

              {/* 혜택 */}
              <div className="px-3 pb-5 pt-2.5">
                <span className="text-xsmall14 font-semibold text-[#4A76FF]">
                  이번 챌린지로 모든걸 얻어갈 수 있어요!
                </span>
                <div className="mt-1.5 flex flex-col gap-1.5">
                  {benefits.map((item, index) => (
                    <div
                      key={`benefit-${index}`}
                      className="flex gap-1 text-neutral-0"
                    >
                      <ChevronDown className="-mt-0.5 h-5 w-5 shrink-0" />
                      <p className="whitespace-pre-line text-nowrap text-xsmall14 font-medium">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 가격 정보 */}
            <div className="flex flex-col gap-1.5">
              <div className="text-xsmall16 text-neutral-20">
                <div className="flex h-[26px] w-full items-center justify-between px-3 text-neutral-40">
                  <span>정가</span>
                  <span>100,000원</span>
                </div>
                <div className="flex w-full items-center justify-between px-3 font-medium">
                  <div className="font-semibold text-system-error">
                    10% 할인
                  </div>
                  <div>-10,000원</div>
                </div>
                <div className="flex w-full items-center justify-between rounded-[2px] bg-[#FFEFED] px-3 py-1 font-medium">
                  <div>모든 미션 수행 시, 환급</div>
                  <div>-10,000원</div>
                </div>
              </div>

              {/* 최종 결제 금액 */}
              <div className="flex flex-col items-stretch gap-0.5 px-2.5">
                <div className="flex items-center justify-between font-medium text-neutral-20">
                  <div className="text-zinc-700">최종 결제 금액</div>
                  <div className="text-zinc-700">80,000원</div>
                </div>
                <div className="flex flex-col items-end gap-0.5">
                  <strong className="text-medium24 font-bold text-[#4A76FF]">
                    월 13,400원
                  </strong>
                  <span className="text-xxsmall12 text-neutral-30">
                    * 우리은행 6개월 무이자 할부 시
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 일정 정보 */}
      <div className="mt-6 flex flex-col md:mt-5 md:flex-row md:gap-3">
        <ScheduleBox className="rounded-b-none pb-0 md:rounded-xs md:pb-5">
          <ScheduleWrapper className="hidden md:block">
            <IconTitle icon={<Pin color="#4A76FF" width={20} height={20} />}>
              시작 일자
            </IconTitle>
            <ScheduleDescription>2025년 01월 04일</ScheduleDescription>
          </ScheduleWrapper>
          <ScheduleWrapper>
            <IconTitle
              icon={<Announcement color="#4A76FF" width={20} height={20} />}
            >
              진행 기간
            </IconTitle>
            <ScheduleDescription>
              2024년 01월 04일 (금) 23시 59분 - 01월 17일 (수) 23시 59분
            </ScheduleDescription>
          </ScheduleWrapper>
        </ScheduleBox>
        <ScheduleBox className="rounded-t-none md:rounded-xs">
          <ScheduleWrapper>
            <IconTitle
              icon={<ClockIcon color="#4A76FF" width={20} height={20} />}
            >
              모집 마감
            </IconTitle>
            <ScheduleDescription>
              2024년 10월 15일(화) 23시 59분
            </ScheduleDescription>
          </ScheduleWrapper>
          <ScheduleWrapper>
            <IconTitle
              icon={<LuCalendarDays color="#4A76FF" className="h-5 w-5" />}
            >
              <span className='inline-block after:ml-2 after:w-16 after:text-xsmall14 after:font-normal after:text-neutral-30 after:content-["온라인_진행"]'>
                OT 일자
              </span>
            </IconTitle>
            <ScheduleDescription>
              2024년 10월 15일(화) 23시 59분
            </ScheduleDescription>
          </ScheduleWrapper>
        </ScheduleBox>
      </div>
    </div>
  );
};

export default ChallengeBasicInfoSection;
