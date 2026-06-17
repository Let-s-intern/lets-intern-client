import type { ChallengeData } from '../types';
import { experience } from './challenges/experience';
import { hr } from './challenges/hr';
import { largeCorp } from './challenges/large-corp';
import { marketing } from './challenges/marketing';
import { personalStatement } from './challenges/personal-statement';
import { portfolio } from './challenges/portfolio';
import { resume } from './challenges/resume';

export { COMMON_NOTICE, USER_REVIEWS } from './common';

export const CHALLENGE_LIST: ChallengeData[] = [
  experience,
  resume,
  personalStatement,
  portfolio,
  largeCorp,
  marketing,
  hr,
];

export function findChallengeByKey(key: string | undefined): ChallengeData {
  return CHALLENGE_LIST.find((c) => c.key === key) ?? CHALLENGE_LIST[0];
}
