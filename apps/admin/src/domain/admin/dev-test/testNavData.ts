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
] as const;
