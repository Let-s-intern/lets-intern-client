import { filterB2CChallenges } from '@/utils/challengeFilter';
import { useEffect, useMemo, useState } from 'react';

/**
 * 챌린지 목록에서 B2C 챌린지만 필터링하는 훅
 * @param challenges 챌린지 목록 (id와 title을 포함하는 객체 배열)
 * @returns 필터링된 B2C 챌린지 목록과 로딩 상태
 */
export function useFilterB2CChallenges<
  T extends { id: number; title?: string | null },
>(challenges: T[] | undefined) {
  const [filteredChallenges, setFilteredChallenges] = useState<T[]>([]);
  const [isFiltering, setIsFiltering] = useState(false);

  const challengeList = useMemo(() => challenges ?? [], [challenges]);

  useEffect(() => {
    if (challengeList.length === 0) {
      setFilteredChallenges([]);
      setIsFiltering(false);
      return;
    }

    setIsFiltering(true);

    const filterChallenges = async () => {
      const b2cChallenges = await filterB2CChallenges(challengeList);
      setFilteredChallenges(b2cChallenges);
      setIsFiltering(false);
    };

    filterChallenges();
  }, [challengeList]);

  return {
    filteredChallenges,
    isFiltering,
  };
}
