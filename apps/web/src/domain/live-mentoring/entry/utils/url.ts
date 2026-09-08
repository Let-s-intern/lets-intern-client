/**
 * 새 탭으로 열어 줘도 되는 주소인지. `http`/`https` 만 통과시킨다.
 *
 * 1대1 신청의 첨부 주소는 멘티가 직접 적어 낸 값인데 서버는 길이만 검증한다
 * (mentor 앱 `LiveMentoringSubmissionModal.tsx` 의 같은 이름 함수 주석 참고).
 * 걸러 내지 않고 `href` 에 그대로 실으면 `javascript:` 스킴이 클릭 시 이 페이지
 * origin 에서 실행된다.
 */
export function isOpenableUrl(url: string): boolean {
  try {
    const { protocol } = new URL(url);
    return protocol === 'https:' || protocol === 'http:';
  } catch {
    return false;
  }
}
