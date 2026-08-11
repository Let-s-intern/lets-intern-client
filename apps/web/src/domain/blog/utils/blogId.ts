/**
 * 블로그 상세 라우트의 `[id]` 세그먼트가 서버에 보낼 수 있는 값인지 검사한다.
 *
 * 서버 `GET /blog/{blogId}` 의 path variable 타입은 `Long` 이라, 숫자가 아닌 값은
 * 컨트롤러에 들어가기도 전에 바인딩 단계에서 400 으로 거부된다. 즉 "없는 글"(404)
 * 과 달리 정상 처리 경로가 없다. 요청을 보내기 전에 여기서 걸러야 한다.
 *
 * `[id]` 는 슬래시 없는 임의 문자열을 모두 받으므로 `/blog/rss`, `/blog/sitemap.xml`
 * 같은 크롤러 프로브가 그대로 흘러 들어온다.
 */
export const isValidBlogId = (id: string): boolean => /^\d+$/.test(id);
