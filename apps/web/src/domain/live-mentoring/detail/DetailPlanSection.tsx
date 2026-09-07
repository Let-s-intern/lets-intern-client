import type {
  LiveMentorDetail,
  LiveMentoringDuration,
} from '@/api/live-mentoring/liveMentoringSchema';
import {
  discountRate,
  durationLabel,
  formatPrice,
  LIST_PRICE_BY_DURATION,
} from '../constants';

/** 진행시간별 고정 카피. 백엔드 enum 이 30·60 뿐이라 이 둘이 전부다. */
const PLAN_COPY: Record<
  LiveMentoringDuration,
  {
    name: string;
    recommend: string;
    summary: string[];
    needs: string[];
  }
> = {
  30: {
    name: 'STANDARD',
    recommend: '핵심 방향을 확인하고 싶은 분께 추천',
    summary: [
      '이력서, 자기소개서, 포트폴리오, 취업 고민 중',
      '필요한 주제를 중심으로 핵심 피드백을 받아요.',
    ],
    needs: [
      '지원 전 현재 방향이 적절한지 점검하고 싶어요',
      '지금 가장 먼저 보완할 부분을 알고 싶어요',
      '멘토의 관점으로 핵심 피드백을 받고 싶어요',
    ],
  },
  60: {
    name: 'PREMIUM',
    recommend: '완성도를 깊게 높이고 싶은 분께 추천',
    summary: [
      '제출 자료와 취업 고민을 함께 보며,',
      '강점 정리부터 지원 전략까지 깊게 상담해요.',
    ],
    needs: [
      '제출 자료를 세부적으로 점검하고 싶어요',
      '내 경험이 직무에 맞게 잘 드러나는지 확인하고 싶어요',
      '자료 피드백과 취업 고민 상담을 함께 받고 싶어요',
    ],
  },
};

const VideoIcon = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 20 14"
    className="fill-neutral-40 h-[14px] w-5 shrink-0"
  >
    <rect x="0" y="0" width="13" height="14" rx="2.5" />
    <path d="M14.5 5.2 19.2 2.3a.6.6 0 0 1 .9.5v8.4a.6.6 0 0 1-.9.5l-4.7-2.9V5.2Z" />
  </svg>
);

const DocumentIcon = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 16 18"
    className="fill-neutral-40 h-[18px] w-4 shrink-0"
  >
    <path d="M2.5 0h7L16 6v10a2 2 0 0 1-2 2H2.5a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2Zm7 1.6V6H14L9.5 1.6ZM4 9h8v1.5H4V9Zm0 3.5h8V14H4v-1.5Z" />
  </svg>
);

/** 우측 플랜 카드 하나. */
const PlanCard = ({
  duration,
  price,
}: {
  duration: LiveMentoringDuration;
  price: number;
}) => {
  const listPrice = LIST_PRICE_BY_DURATION[duration];
  const rate = discountRate(price, listPrice);

  return (
    <div className="flex flex-col justify-center gap-6 rounded-2xl bg-white p-6 md:p-8">
      <p className="text-small18 md:text-small20 font-bold">
        {PLAN_COPY[duration].name}
      </p>
      <ul className="text-xsmall14 md:text-xsmall16 flex flex-col gap-2.5 rounded-lg bg-[#f0f4ff] px-4 py-4">
        <li className="flex items-center gap-2">
          <VideoIcon />
          <span>
            1:1 LIVE 멘토링{' '}
            <span className="text-primary font-semibold">
              {durationLabel(duration)}
            </span>
          </span>
        </li>
        <li className="flex items-center gap-2">
          <DocumentIcon />
          <span>합격 포폴 자료집</span>
        </li>
      </ul>
      <div className="flex flex-col gap-0.5">
        {rate > 0 && (
          <p className="text-xsmall14 md:text-xsmall16 flex items-center gap-2 font-semibold">
            <span className="text-system-error">{rate}%</span>
            <span className="text-neutral-45 font-normal line-through">
              {formatPrice(listPrice)}
            </span>
          </p>
        )}
        <p className="text-small20 md:text-medium24 font-bold">
          {formatPrice(price)}
        </p>
      </div>
    </div>
  );
};

interface DetailPlanSectionProps {
  durationPrices: LiveMentorDetail['durationPrices'];
}

/**
 * 시안 6 · "내게 알맞은 구성을 선택할 수 있어요!"
 *
 * 통이미지(section-plan.png)를 마크업으로 옮긴 것이다. 이미지에는 STANDARD 35,000원 /
 * PREMIUM 65,000원과 할인율 14% / 15% 가 구워져 있었는데, 가격은 멘토마다 다르고
 * (`durationPrices`) 할인율도 정가 대비로 계산하면 다른 값이 나온다. 즉 이미지는
 * 멘토 대부분에게 틀린 금액을 보여주고 있었다. 이제 히어로(시안 0)와 같은 값을 쓴다.
 *
 * 멘토가 연 진행시간만 렌더한다 — 30분만 열었으면 STANDARD 한 줄만 나온다.
 *
 * 배경·카드 색은 시안 PNG 에서 픽셀로 뽑았다
 * (섹션 #e5ecff, 카드 #ffffff, 회색 박스 #f3f3f3, 연파랑 박스 #f0f4ff).
 */
const DetailPlanSection = ({ durationPrices }: DetailPlanSectionProps) => {
  if (durationPrices.length === 0) return null;

  const plans = [...durationPrices].sort((a, b) => a.duration - b.duration);

  return (
    <section className="w-full scroll-mt-16 bg-[#e5ecff] py-12 md:py-16">
      <div className="mw-1180 flex flex-col items-center break-keep px-5">
        <p className="text-xsmall14 md:text-small18 text-primary font-semibold">
          필요한 깊이에 맞게 플랜을 선택하세요
        </p>
        <h2 className="text-small20 md:text-xlarge30 mt-2 text-center font-bold">
          내게 알맞은 구성을 선택할 수 있어요!
        </h2>

        <div className="mt-8 flex w-full max-w-[1000px] flex-col gap-5 md:mt-12 md:gap-8">
          {plans.map(({ durationPriceId, duration, price }) => (
            <div
              key={durationPriceId}
              className="grid grid-cols-1 gap-4 md:grid-cols-[1.75fr_auto_1fr] md:items-stretch md:gap-8"
            >
              {/* 좌 · 추천 대상 */}
              <div className="flex flex-col gap-5 rounded-2xl bg-white p-6 md:p-9">
                <h3 className="text-small18 md:text-small20 font-bold">
                  {PLAN_COPY[duration].recommend}
                </h3>
                <div className="text-xsmall14 md:text-xsmall16 text-neutral-30">
                  {PLAN_COPY[duration].summary.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
                <ul className="text-xsmall14 md:text-xsmall16 text-neutral-40 bg-neutral-90 flex flex-col gap-2 rounded-lg px-5 py-5">
                  {PLAN_COPY[duration].needs.map((need) => (
                    <li key={need}>{need}</li>
                  ))}
                </ul>
              </div>

              {/* 가운데 · 시안의 화살표. 모바일은 아래를 가리킨다 */}
              <div
                aria-hidden="true"
                className="flex items-center justify-center"
              >
                <svg
                  viewBox="0 0 40 32"
                  className="h-6 w-8 rotate-90 fill-[#b6ccff] md:h-8 md:w-10 md:rotate-0"
                >
                  <path d="M0 10h22V0l18 16-18 16V22H0V10Z" />
                </svg>
              </div>

              {/* 우 · 플랜과 가격 */}
              <PlanCard duration={duration} price={price} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DetailPlanSection;
