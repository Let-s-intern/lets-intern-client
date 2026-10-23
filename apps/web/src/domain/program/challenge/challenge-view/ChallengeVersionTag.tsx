/**
 * 챌린지 상세 시작 일자 라디오의 버전 태그 (LC-3213, LC-3247)
 *
 * 같은 날 여러 버전이 열리면 시작 일자 라디오에 같은 날짜가 여러 줄 나와
 * 구분할 수 없어 태그를 붙인다. 태그 값은 /challenge/active 응답의
 * versionTitle(버전명)이 우선이다.
 *
 * extractChallengeVersionLabel 은 버전 데이터가 없을 때의 fallback 이다.
 * 버전을 등록하지 않고 제목 맨 앞 대괄호로 버전을 구분하는 기존 방식
 * 챌린지에서 그 대괄호 안의 문자열을 태그로 쓴다.
 *
 *   [대학생, 무경력자 Ver.] 기필코 경험정리 챌린지 29기
 *    └──────────────────┘
 *           이 문자열을 태그로 쓴다
 */

/**
 * 제목 맨 앞 대괄호 안의 문자열을 돌려준다. 없으면 null.
 *
 * 다듬지 않고 원문 그대로 쓴다. 매핑 표를 두면 버전이 늘 때마다 코드를
 * 고쳐야 해서, fallback 에 유지보수 부담을 더하게 된다.
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
