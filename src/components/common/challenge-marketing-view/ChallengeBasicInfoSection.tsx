import ChevronDown from '@/assets/icons/chevron-down.svg?react';
import { twMerge } from '@/lib/twMerge';
import { ChallengeIdPrimitive, challengeTypeSchema } from '@/schema';
import Image from 'next/image';
import React from 'react';

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

      <div className="mt-5 w-full max-md:max-w-full">
        <div className="flex w-full flex-wrap gap-3 max-md:max-w-full">
          <div className="min-w-60 flex-1 shrink basis-0 rounded-md bg-stone-50 px-5 pb-5 pt-4 text-base tracking-normal text-zinc-800 max-md:max-w-full">
            <div className="flex w-full flex-col max-md:max-w-full">
              <div className="flex items-center gap-2 self-start font-semibold">
                <img
                  src="/icons/calendar.svg"
                  className="my-auto aspect-square w-5 shrink-0 self-stretch object-contain"
                  alt="달력"
                />
                <div className="my-auto self-stretch text-zinc-800">
                  시작 일자
                </div>
              </div>
              <div className="mt-2 leading-loose text-zinc-800">
                {challenge.startDate
                  ? new Date(challenge.startDate).toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                    })
                  : '2025년 01월 04일'}
              </div>
            </div>
            <div className="mt-3 flex w-full flex-col max-md:max-w-full">
              <div className="flex items-center gap-2 self-start font-semibold">
                <img
                  src="/icons/clock.svg"
                  className="my-auto aspect-square w-5 shrink-0 self-stretch object-contain"
                  alt="시계"
                />
                <div className="my-auto self-stretch text-zinc-800">
                  진행 기간
                </div>
              </div>
              <div className="mt-2 leading-loose text-zinc-800">
                {challenge.startDate && challenge.endDate
                  ? `${new Date(challenge.startDate).toLocaleDateString(
                      'ko-KR',
                      {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                      },
                    )} - ${new Date(challenge.endDate).toLocaleDateString(
                      'ko-KR',
                      {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                      },
                    )}`
                  : '2024년 01월 04일 (금) 23시 59분 - 01월 17일 (수) 23시 59분'}
              </div>
            </div>
          </div>
          <div className="min-w-60 flex-1 shrink basis-0 rounded-md bg-stone-50 px-5 pb-5 pt-4 max-md:max-w-full">
            <div className="flex w-full flex-col text-base tracking-normal text-zinc-800 max-md:max-w-full">
              <div className="flex items-center gap-2 self-start font-semibold">
                <img
                  src="/icons/Bell.svg"
                  className="my-auto aspect-square w-5 shrink-0 self-stretch object-contain"
                  alt="벨"
                />
                <div className="my-auto self-stretch text-zinc-800">
                  모집 마감
                </div>
              </div>
              <div className="mt-2 leading-loose text-zinc-800">
                {challenge.deadline
                  ? new Date(challenge.deadline).toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      weekday: 'short',
                    }) + ' 23시 59분'
                  : '2024년 10월 15일(화) 23시 59분'}
              </div>
            </div>
            <div className="mt-3 flex w-full flex-col max-md:max-w-full">
              <div className="flex items-center gap-2 self-start">
                <img
                  src="/icons/calendar.svg"
                  className="my-auto aspect-square w-5 shrink-0 self-stretch object-contain"
                  alt="달력"
                />
                <div className="my-auto flex items-center gap-2 self-stretch">
                  <div className="my-auto self-stretch text-base font-semibold tracking-normal text-zinc-800">
                    OT 일자
                  </div>
                  <div className="my-auto self-stretch text-sm leading-loose tracking-tight text-neutral-600">
                    온라인 진행
                  </div>
                </div>
              </div>
              <div className="mt-2 text-base leading-loose tracking-normal text-zinc-800">
                {challenge.startDate
                  ? new Date(challenge.startDate).toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      weekday: 'short',
                    }) + ' 23시 59분'
                  : '2024년 10월 15일(화) 23시 59분'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengeBasicInfoSection;
