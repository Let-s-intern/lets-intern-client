import { UserExperienceType } from '@/api/experience/experienceSchema';

/**
 * 핵심 역량 빈도 계산 및 상위 3개 추출
 * - isAddedByAdmin === false인 항목만 필터링
 * - coreCompetency를 쉼표로 분리하여 개별 숫자별 빈도수 계산
 * - 빈도 내림차순 정렬
 * - 상위 2개는 고정 선택
 * - 3번째는 동점 항목 중 랜덤 선택
 */
export const getTopCoreCompetencies = (
  experiences: UserExperienceType[],
): string[] => {
  // 사용자가 직접 입력한 데이터만 필터링
  const userExperiences = experiences.filter(
    (exp) => exp.isAddedByAdmin === false,
  );

  // 핵심 역량 빈도 계산 (쉼표로 분리된 개별 숫자별로 계산)
  const competencyCountMap = new Map<string, number>();

  userExperiences.forEach((exp) => {
    const competency = exp.coreCompetency?.trim();
    if (competency) {
      // 쉼표로 분리하여 개별 숫자 추출
      const competencies = competency
        .split(',')
        .map((c) => c.trim())
        .filter((c) => c !== '');

      // 각 숫자의 빈도수 계산
      competencies.forEach((c) => {
        competencyCountMap.set(c, (competencyCountMap.get(c) || 0) + 1);
      });
    }
  });

  // 빈도 내림차순 정렬
  const sortedCompetencies = Array.from(competencyCountMap.entries()).sort(
    (a, b) => b[1] - a[1],
  );

  if (sortedCompetencies.length === 0) {
    return [];
  }

  // 상위 2개는 고정 선택
  const topTwo = sortedCompetencies
    .slice(0, 2)
    .map(([competency]) => competency);

  // 3번째 항목 선택 (동점이 있으면 랜덤 선택)
  if (sortedCompetencies.length <= 2) {
    return topTwo;
  }

  const thirdFrequency = sortedCompetencies[2][1];
  const tiedCompetencies = sortedCompetencies
    .filter(([competency, count]) => {
      return count === thirdFrequency && !topTwo.includes(competency);
    })
    .map(([competency]) => competency);

  // 동점 항목 중 랜덤 선택
  const third =
    tiedCompetencies[Math.floor(Math.random() * tiedCompetencies.length)];

  return [...topTwo, third];
};
