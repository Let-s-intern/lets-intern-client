import { useVodPassListQuery } from '@/api/vodPass';
import { useMemo } from 'react';
import { summarizeVodPassHolding, type VodPassHolding } from './vodPassHolding';

/**
 * 내 이용권 목록에서 보유 중 요약을 만든다. 조회가 실패하거나 아직 응답 전이면 null 이라
 * 호출한 화면은 배너만 그리지 않는다.
 */
export function useVodPassHolding(): VodPassHolding | null {
  const { data } = useVodPassListQuery();

  return useMemo(
    () => (data ? summarizeVodPassHolding(data.passes) : null),
    [data],
  );
}
