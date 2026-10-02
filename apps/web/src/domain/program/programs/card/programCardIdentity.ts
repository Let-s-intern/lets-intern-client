import { ProgramInfo } from '@/schema';
import { getProgramPathname } from '@/utils/url';

type CardProgramInfo = Pick<
  ProgramInfo['programInfo'],
  'id' | 'programType' | 'title' | 'challengeVersionId'
>;

/** 같은 챌린지의 버전 카드가 여러 장 나오므로 버전 id 까지 넣어야 카드마다 다르다 */
export const getProgramCardKey = ({
  programType,
  id,
  challengeVersionId,
}: CardProgramInfo) => `${programType}-${id}-${challengeVersionId ?? ''}`;

/** 버전 카드는 버전 상세 URL, 나머지는 기존처럼 id 경로(상세에서 slug 로 리다이렉트) */
export const getProgramCardLink = ({
  programType,
  id,
  title,
  challengeVersionId,
}: CardProgramInfo) => {
  if (challengeVersionId != null) {
    return getProgramPathname({
      programType: 'challenge',
      id,
      title,
      challengeVersionId,
    });
  }
  return `/program/${programType.toLowerCase()}/${id}`;
};
