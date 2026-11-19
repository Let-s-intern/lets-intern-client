import type { ProgramCategoryMatchMode } from '../programCategoryApi';

/** 노출 분류 화면 전체에서 같은 말을 쓴다. 서버 필드 이름 대신 운영자가 보는 결과로 적는다 */

/** mergeChallenges */
export const MERGE_CHALLENGES_LABEL =
  '같은 챌린지의 기수·버전을 하나로 묶어 보이기';
export const MERGE_CHALLENGES_HELP =
  '끄면 같은 챌린지라도 기수·버전마다 카드가 따로 나옵니다.';

/** matchMode */
export const MATCH_MODE_LABEL: Record<ProgramCategoryMatchMode, string> = {
  ANY: '하나라도 해당',
  ALL: '모두 해당',
};
export const MATCH_MODE_HELP: Record<ProgramCategoryMatchMode, string> = {
  ANY: '버튼을 여러 개 고르면, 그중 하나라도 해당하는 상품을 모두 보여줍니다.',
  ALL: '버튼을 여러 개 고르면, 고른 버튼에 모두 해당하는 상품만 보여줍니다.',
};

/** sourceCategoryIds */
export const SOURCES_LABEL = '다른 섹션 상품도 함께 보여주기';
export const SOURCES_HELP =
  '고른 카테고리에 연결된 상품을 이 섹션에도 함께 보여줍니다. 같은 상품을 이 섹션에 다시 연결하지 않아도 됩니다.';

/** directTargetType / directTargetId */
export const DIRECT_TARGET_LABEL = '메뉴를 누르면 이 상품으로 바로 이동';
export const DIRECT_TARGET_HELP =
  '끄면 메뉴를 눌렀을 때 아래 주소의 카테고리 페이지로 갑니다.';

/** 노출 목록 / 카테고리 저장 실패. 서버가 409(키 겹침)를 주는 경우가 대부분이다 */
export const PLACEMENT_SAVE_FAILED =
  '저장에 실패했습니다. 다른 랜딩이 쓰는 키인지 확인하세요.';
export const CATEGORY_SAVE_FAILED =
  '저장에 실패했습니다. 키가 겹치거나 상품 id 가 없는지 확인하세요.';
