import { useMemo } from 'react';
import { ChallengeIdPrimitive } from '@/schema';
import getChallengeOptionPriceInfo from '@/utils/getChallengeOptionPriceInfo';
import {
  MEMBERSHIP_BEGINNING,
  MEMBERSHIP_DEADLINE,
  MEMBERSHIP_END_DATE,
  MEMBERSHIP_START_DATE,
} from '../data/membership';
import { FAQ_ITEMS } from '../data/faq';
import { PLAN_PRICE, VOD_OPTION_PRICE } from '../data/plans';
import {
  IS_MEMBERSHIP_LAUNCHED,
  MEMBERSHIP_CHALLENGE_ID,
} from './membershipChallenge';
import { useMembershipChallengeQuery } from './useMembershipChallengeQuery';

export interface MembershipFaqItem {
  id: number;
  question: string;
  answer: string;
}

/**
 * 랜딩이 화면에 쓰는 멤버십 뷰모델 — 날짜/가격/FAQ.
 * 날짜는 Countdown/BarCountdown 이 getTime() 을 쓰므로 Date 로 통일.
 */
export interface MembershipChallengeData {
  /** 모집 기간 시작 */
  beginning: Date;
  /** 모집 마감(=카운트다운 기준) */
  deadline: Date;
  /** 이용(챌린지) 기간 시작 */
  startDate: Date;
  /** 이용(챌린지) 기간 종료 */
  endDate: Date;
  /** 정가(취소선) */
  regularPrice: number;
  /** 오픈 특가(판매가) */
  salePrice: number;
  /** VOD 옵션 정가(취소선) */
  vodRegularPrice: number;
  /** VOD 옵션 판매가 */
  vodSalePrice: number;
  faqItems: MembershipFaqItem[];
}

/**
 * 챌린지 옵션 목록에서 VOD 옵션을 찾는다.
 *
 * 서버의 `challenge_option` 에는 VOD 를 가리키는 구조적 필드가 없다. `type` enum 은
 * WRITTEN_FEEDBACK / LIVE_FEEDBACK 둘뿐이고 `code` 는 어드민이 손으로 적는 자유 문자열이라,
 * 지금 계약으로 판별할 수 있는 방법은 코드/이름에 "VOD" 가 들어 있는지 보는 것뿐이다.
 *
 * 어드민이 이름을 다르게 지으면 조용히 못 찾는다. 그래서 못 찾았을 때 카드를 숨기지 않고
 * 폴백값을 쓴다 — 화면이 비는 것보다 시안 값이 남는 편이 덜 나쁘고, 실제 결제 금액은
 * 결제 시트가 챌린지에서 다시 계산하므로 어긋나지 않는다.
 */
const findVodOption = (priceInfo: ChallengeIdPrimitive['priceInfo']) => {
  for (const plan of priceInfo) {
    const option = plan.challengeOptionList.find((o) =>
      `${o.code ?? ''} ${o.title ?? ''}`.toUpperCase().includes('VOD'),
    );
    if (option) return option;
  }
  return undefined;
};

// 유효하지 않은 날짜 문자열은 Invalid Date(=== null/undefined 아님)를 만들어 ?? 폴백을
// 무력화하므로, getTime()이 NaN이면 null 로 떨어뜨려 정적 폴백이 동작하게 한다.
const toDate = (value?: string | null): Date | null => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

/**
 * 멤버십 랜딩의 날짜·가격·FAQ 단일 진입점.
 * env 로 연결된 챌린지(`MEMBERSHIP_CHALLENGE_ID`)에서 값을 가져오되,
 * 출시 전/로딩 중/실패 시에는 정적 `data/*.ts` 값을 폴백으로 사용한다.
 *
 * TanStack Query 가 queryKey 로 dedupe 하므로 여러 섹션이 호출해도 요청은 1회다.
 */
export function useMembershipChallengeData(): MembershipChallengeData {
  const { data } = useMembershipChallengeQuery({
    challengeId: MEMBERSHIP_CHALLENGE_ID,
    enabled: IS_MEMBERSHIP_LAUNCHED,
  });

  return useMemo(() => {
    const beginning = toDate(data?.beginning) ?? MEMBERSHIP_BEGINNING;
    const deadline = toDate(data?.deadline) ?? MEMBERSHIP_DEADLINE;
    const startDate = toDate(data?.startDate) ?? MEMBERSHIP_START_DATE;
    const endDate = toDate(data?.endDate) ?? MEMBERSHIP_END_DATE;

    // 가격 — BASIC(첫) 단일 플랜 기준. 정가/할인은 옵션 합산 유틸 재사용.
    let regularPrice: number = PLAN_PRICE.original;
    let salePrice: number = PLAN_PRICE.sale;
    if (data?.priceInfo?.length) {
      const { basicRegularPrice, basicDiscountAmount } =
        getChallengeOptionPriceInfo(data.priceInfo);
      if (basicRegularPrice > 0) {
        regularPrice = basicRegularPrice;
        salePrice = Math.max(0, basicRegularPrice - basicDiscountAmount);
      }
    }

    // VOD 옵션 — 옵션 목록에서 찾아 정가/판매가를 낸다. 못 찾으면 폴백.
    let vodRegularPrice: number = VOD_OPTION_PRICE.original;
    let vodSalePrice: number = VOD_OPTION_PRICE.sale;
    const vodOption = data?.priceInfo?.length
      ? findVodOption(data.priceInfo)
      : undefined;
    if (vodOption && (vodOption.price ?? 0) > 0) {
      vodRegularPrice = vodOption.price ?? 0;
      vodSalePrice = Math.max(
        0,
        vodRegularPrice - (vodOption.discountPrice ?? 0),
      );
    }

    // FAQ — 어드민이 챌린지에 연결한 faqInfo. 질문/답변이 모두 있는 항목만 노출.
    const challengeFaq = data?.faqInfo
      ?.filter((f) => f.question && f.answer)
      .map((f) => ({
        id: f.id,
        question: f.question as string,
        answer: f.answer as string,
      }));
    const faqItems =
      challengeFaq && challengeFaq.length > 0 ? challengeFaq : FAQ_ITEMS;

    return {
      beginning,
      deadline,
      startDate,
      endDate,
      regularPrice,
      salePrice,
      vodRegularPrice,
      vodSalePrice,
      faqItems,
    };
  }, [data]);
}
