/**
 * [임시] LC-3213 — 챌린지 상세 시작 일자 라디오의 버전 태그
 *
 * 무경력자 버전과 경력자 버전이 같은 날 동시에 열리면 시작 일자 라디오에
 * 같은 날짜가 두 줄 나와 구분할 수 없다. Challenge 엔티티에 버전 필드가 없고
 * 두 버전은 challengeType 만 같은 별개의 행이라, 지금 구분할 수 있는 단서는
 * 제목 맨 앞 대괄호뿐이다.
 *
 *   [대학생, 무경력자 Ver.] 기필코 경험정리 챌린지 29기
 *    └──────────────────┘
 *           이 문자열을 태그로 쓴다
 *
 * 제목 문자열에 기대는 임시 방편이다. 버전이 데이터로 들어오면
 * **이 파일을 지우고** 아래 두 곳만 정리하면 된다.
 *
 *   1. ChallengeBasicInfo.tsx 의 import 와 rightSlot 전달
 *   2. RadioButton.tsx 의 rightSlot prop (다른 사용처가 없다면)
 *
 * 그때는 파싱 대신 ActiveChallengeType 의 버전 필드를 그대로 넘기면 된다.
 */

/**
 * 제목 맨 앞 대괄호 안의 문자열을 돌려준다. 없으면 null.
 *
 * 다듬지 않고 원문 그대로 쓴다. 매핑 표를 두면 버전이 늘 때마다 코드를
 * 고쳐야 해서, 임시 조치에 유지보수 부담을 더하게 된다.
 */
export const extractChallengeVersionLabel = (
  title: string | undefined | null,
): string | null => {
  if (!title) return null;

  const matched = title.trim().match(/^\[([^\]]*)\]/);
  if (!matched) return null;

  const label = matched[1].trim();
  return label.length > 0 ? label : null;
};

const ChallengeVersionTag = ({
  label,
  color,
}: {
  label: string;
  color: string;
}) => {
  return (
    <span
      // 날짜가 우선이라 좁은 칸에서는 태그가 먼저 줄어들고 말줄임된다.
      className="rounded-xxs text-xxsmall12 min-w-0 shrink truncate px-1.5 py-0.5 font-medium"
      // 테마 색을 글자에 쓰고 같은 색을 옅게 깔아 배경을 만든다.
      style={{ color, backgroundColor: `${color}1A` }}
      title={label}
    >
      {label}
    </span>
  );
};

export default ChallengeVersionTag;
