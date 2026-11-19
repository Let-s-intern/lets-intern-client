import { useLandingMenuQuery } from '@/api/program-category/programCategory';
import { buildJourneyGroups } from './landingMenu';

/** GNB·모바일 메뉴·브레드크럼이 함께 쓰는 취준 여정 메뉴. 받기 전과 비었을 때는 고정 메뉴 */
export const useJourneyGroups = () => {
  const { data } = useLandingMenuQuery();
  return buildJourneyGroups(data);
};
