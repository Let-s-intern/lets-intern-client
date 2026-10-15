/**
 * GET /challenge 는 버전 있는 챌린지를 버전마다 한 행으로 준다.
 * 챌린지 단위로 쓰는 화면을 위해 같은 id 의 첫 행만 남긴다. 순서는 그대로다
 */
export const uniqueChallengesById = <T extends { id?: number }>(
  programList: T[],
): T[] => {
  const seen = new Set<number>();
  return programList.filter(({ id }) => {
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  });
};
