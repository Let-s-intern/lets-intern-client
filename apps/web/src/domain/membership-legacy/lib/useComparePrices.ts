import { useQueries } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';
import {
  activeChallengeResponse,
  getChallengeIdSchema,
  type ChallengeType,
} from '@/schema';
import axios from '@/utils/axios';
import getChallengeOptionPriceInfo from '@/utils/getChallengeOptionPriceInfo';
import type { CompareCombo } from '../data/compare';
import { useMembershipChallengeData } from './useMembershipChallengeData';

/** 가격 조회 캐시 유지 시간 — 이 시간 안에는 탭을 오가도 재요청하지 않는다 */
const PRICE_STALE_TIME = 5 * 60 * 1000;

/** 좌측 카드 한 줄 */
export interface ComparePriceItem {
  challengeType: ChallengeType;
  name: string;
  /** 현재 할인가. 모집 중인 기수가 없으면 null 이고 합계에서 빠진다 */
  price: number | null;
}

export interface ComparePricesResult {
  items: ComparePriceItem[];
  /** price 가 null 이 아닌 항목의 합 */
  total: number;
  isLoading: boolean;
  /** 개별 합계가 올인원 특가 이하 — 비교가 성립하지 않는다 */
  isInverted: boolean;
  /**
   * 이 조합을 화면에 쓸 수 있는가.
   *
   * 항목 중 하나라도 모집 중인 기수가 없으면 합계가 실제보다 작게 잡힌다.
   * 그 상태로 "개별 구매 시 N원" 을 그리면 화면이 사실과 다른 금액을 말하게 되므로,
   * 전부 구했고 역전도 아닐 때만 true 다.
   */
  isUsable: boolean;
}

/**
 * 조합 1종의 개별 구매 합계를 어드민 가격에서 끌어온다.
 *
 * 가격이 목록 API 에 없어 2단 조회다.
 *   1) /challenge/active?type={type} → 모집 중인 챌린지의 id
 *   2) /challenge/{id}               → priceInfo 에서 현재 할인가
 *
 * 조합마다 챌린지가 2~3종이라 조회가 배열이 되는데, 훅은 반복 호출할 수 없으므로
 * 두 단계 모두 `useQueries` 로 묶는다. queryKey 는 `useGetActiveChallenge` ·
 * `useChallengeQuery` 와 **같은 키를 쓴다** — 키가 같아야 탭을 오갈 때, 그리고 페이지의
 * 다른 곳이 같은 챌린지를 조회할 때 캐시가 공유된다. 키를 바꾸면 조용히 중복 호출이 된다.
 *
 * N+1 (타입 5종 × 2단 = 최대 10회)은 이번에 해결하지 않는다. 목록 응답에 대표 가격이
 * 없어서 생기는 것이라 백엔드 변경이 필요하다. 프론트에서는 `enabled` 로 활성 탭만
 * 조회하고 TanStack Query 캐시로 재요청을 막는 데까지만 한다.
 *
 * 가격은 어드민이 어쩌다 한 번 바꾸는 값이라 `staleTime` 을 둔다. 기본값(0)이면 캐시가
 * 화면에는 바로 뜨지만 탭을 되돌아올 때마다 백그라운드 재조회가 나가서, 탭을 오갈수록
 * 호출이 계속 쌓인다(실측: 1번 탭 복귀에 2회 추가). 신선도를 조금 포기하고 호출을 없앤다.
 *
 * 미결 방침 두 가지가 여기 모여 있다. 지시가 바뀌면 이 파일만 고친다.
 *   결정 7 — 역전(개별 합계 ≤ 올인원가) 시 `isInverted` 를 올리고 콘솔 경고를 남긴다.
 *            탭을 숨기는 판단은 호출부(CompareSection)가 한다.
 *   결정 8 — 로딩 중에는 폴백 숫자를 내지 않는다. `isLoading` 만 올리고 금액은 비운다.
 */
export function useComparePrices(
  combo: CompareCombo,
  { enabled = true }: { enabled?: boolean } = {},
): ComparePricesResult {
  // 1단 — 타입별 모집 중 챌린지
  const activeResults = useQueries({
    queries: combo.items.map((item) => ({
      // useGetActiveChallenge 와 동일한 키 (api/challenge/challenge.ts)
      queryKey: ['useGetSameTypeChallenge', item.challengeType],
      queryFn: async () => {
        const res = await axios.get('/challenge/active', {
          params: { type: item.challengeType },
        });
        return activeChallengeResponse.parse(res.data.data);
      },
      enabled,
      staleTime: PRICE_STALE_TIME,
    })),
  });

  // 모집 중인 기수가 여럿이면 첫 항목을 쓴다(서버 정렬 = 마감 임박순).
  const challengeIds = activeResults.map(
    (result) => result.data?.challengeList?.[0]?.id ?? null,
  );

  // 2단 — 상세에서 가격. 항목 수만큼 자리를 고정하고 id 를 모르는 자리는 끈다
  // (useQueries 배열 길이가 렌더마다 널뛰지 않게 한다).
  const detailResults = useQueries({
    queries: combo.items.map((item, index) => {
      const challengeId = challengeIds[index];
      return {
        // useChallengeQuery 와 동일한 키 (api/challenge/challenge.ts).
        // id 를 아직 모르는 자리는 슬롯별로 다른 키를 준다 — 같은 useQueries 안에서
        // 키가 겹치면 TanStack 이 "Duplicate Queries" 로 경고하고 동작을 보장하지 않는다.
        queryKey:
          challengeId !== null
            ? ['useChallengeQueryKey', challengeId]
            : ['useChallengeQueryKey', 'pending', combo.id, index],
        queryFn: async () => {
          const res = await axios.get(`/challenge/${challengeId}`);
          return getChallengeIdSchema.parse(res.data.data);
        },
        enabled: enabled && challengeId !== null,
        staleTime: PRICE_STALE_TIME,
      };
    }),
  });

  const { salePrice } = useMembershipChallengeData();

  // isLoading = isPending && isFetching 이므로 꺼둔 쿼리는 로딩으로 잡히지 않는다.
  const isLoading =
    enabled &&
    (activeResults.some((r) => r.isLoading) ||
      detailResults.some((r) => r.isLoading));

  const items = useMemo(
    () =>
      combo.items.map((item, index) => {
        const priceInfo = detailResults[index]?.data?.priceInfo;
        if (!priceInfo?.length) {
          return { ...item, price: null };
        }
        const { basicRegularPrice, basicDiscountAmount } =
          getChallengeOptionPriceInfo(priceInfo);
        return {
          ...item,
          price: Math.max(0, basicRegularPrice - basicDiscountAmount),
        };
      }),
    // detailResults 는 매 렌더 새 배열이라 의존성에 넣으면 memo 가 무의미해진다.
    // 값이 바뀌는 시점은 각 쿼리의 data 뿐이므로 그것만 본다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [combo, ...detailResults.map((r) => r.data)],
  );

  const total = items.reduce((acc, item) => acc + (item.price ?? 0), 0);
  const hasAllPrices =
    items.length > 0 && items.every((item) => item.price !== null);

  // 로딩 중에는 합계가 0 이라 무조건 역전으로 잡힌다. 다 받은 뒤에만 판정한다.
  const isInverted = !isLoading && total > 0 && total <= salePrice;

  // 가격을 하나도 못 구하면 total 이 0 이라 isInverted 로도 안 걸린다.
  // 그 경우 "0개 개별 구매 시 0원" 이 그대로 그려지므로 별도로 막는다.
  const isUsable = !isLoading && hasAllPrices && total > salePrice;

  useEffect(() => {
    if (!isInverted) return;
    console.warn('[LC-3219] 개별 합계가 올인원가보다 낮다', {
      comboId: combo.id,
      total,
      salePrice,
    });
  }, [isInverted, combo.id, total, salePrice]);

  return { items, total, isLoading, isInverted, isUsable };
}
