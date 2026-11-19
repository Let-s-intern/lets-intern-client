import ChallengeThumbnail from './catalog/ui/ChallengeThumbnail';

/**
 * 챌린지 제목에서 앞의 `[버전]` 과 뒤의 `N기 …` 를 뗀다
 * (예: "[인턴 Ver.] 포트폴리오 챌린지 58기" → "포트폴리오 챌린지")
 */
const getChallengeDisplayTitle = (title: string) =>
  title
    .replace(/^(\s*\[[^\]]*\]\s*)+/, '')
    .replace(/\s*\d+기(\s.*)?$/, '')
    .trim() || title;

/**
 * 결제·결제 결과 화면의 챌린지 썸네일. 기수·버전 글자가 박힌 등록 썸네일 대신
 * 유형별 기본 썸네일을 쓰고, 기본 이미지가 없는 유형이면 등록 썸네일을 쓴다
 */
const OrderChallengeThumbnail = ({
  title,
  challengeType,
  fallbackSrc,
}: {
  title: string;
  challengeType?: string | null;
  fallbackSrc?: string | null;
}) => (
  <ChallengeThumbnail
    challengeType={challengeType}
    title={title}
    displayTitle={getChallengeDisplayTitle(title)}
    fallbackSrc={fallbackSrc}
  />
);

export default OrderChallengeThumbnail;
