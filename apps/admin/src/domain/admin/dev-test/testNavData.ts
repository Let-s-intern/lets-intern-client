/**
 * 개발자 테스트 메뉴. /test 주소로만 들어오며 어드민 사이드바에는 링크를 두지 않는다.
 * 테스트를 추가할 때 여기 한 줄과 router 의 /test/* 라우트를 같이 추가한다.
 * 운영 어드민에도 배포되므로 조회만 하는 화면만 둔다
 */
export const testNavData = [
  {
    name: '노출 분류 미리보기',
    url: '/test/program-category',
    description:
      '어드민에서 설정한 노출 분류가 공개 API 로 그대로 내려오는지, 프론트 필터처럼 그려 확인합니다.',
  },
  {
    name: '노출 분류 미리보기 (한 번 호출)',
    url: '/test/program-category-bundle',
    description:
      '여러 카테고리 조회 API 를 한 번만 불러 같은 화면을 그립니다. 카테고리마다 따로 부르는 방식과 결과가 같은지 비교합니다.',
  },
  {
    name: '노출 분류 미리보기 (챌린지 기수 합치기)',
    url: '/test/program-category-grouped',
    description:
      '한 번 호출에 groupChallenges=true 를 붙여, 같은 챌린지의 여러 기수가 대표 기수 카드 하나로 합쳐지는지 확인합니다.',
  },
] as const;
