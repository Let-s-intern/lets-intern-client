/**
 * 저장 실패 메시지를 멘토가 알아들을 수 있는 말로 옮긴다.
 *
 * 서버는 검증 실패를 `[mentoringTypes.title] 공백일 수 없습니다` 처럼 **필드 경로**로
 * 알려준다. 그대로 띄우면 멘토는 어느 칸을 말하는지 알 수 없고, 뒤에 붙는 `BAD_REQUEST`
 * 는 고치는 데 아무 도움이 안 된다.
 *
 * 여기서는 그 경로를 화면에 적힌 이름(스텝 이름 + 칸 이름)으로 바꾸고, 몇 번째 항목인지도
 * 세어 준다. 모르는 경로면 서버 문구를 그대로 쓰되 코드는 떼어낸다 — 번역하지 못했다고
 * 아무 말도 안 하는 것보다는 낫다.
 */

/** 스텝 이름. 상세 페이지 설정의 탭 라벨과 같은 말을 쓴다. */
const SECTION_LABELS: Record<string, string> = {
  hero: '핵심 소개',
  intro: '멘토 정보',
  mentoringTypes: '멘토링 유형',
  strategy: '취업 성공 전략',
  video: '소개 영상',
  results: '결과 사례',
  reviews: '후기',
};

/**
 * 칸 이름. `섹션.칸` 으로 찾고, 없으면 `칸` 만으로 한 번 더 찾는다 —
 * `title`·`subtitle` 처럼 여러 섹션에 같은 이름이 있는 칸을 매번 적지 않기 위해서다.
 */
const FIELD_LABELS: Record<string, string> = {
  'hero.bullets': '소개 문구',
  'mentoringTypes.title': '소개 제목',
  'mentoringTypes.subtitle': '소개 문구',
  'mentoringTypes.items.typeName': '유형 이름',
  'mentoringTypes.items.title': '유형 제목',
  'mentoringTypes.items.description': '부가 설명',
  'mentoringTypes.items.tags': '관련 태그',
  'strategy.points.title': 'Point 제목',
  'strategy.points.description': 'Point 설명',
  'strategy.points.image': 'Point 이미지',
  'video.videoUrl': '영상 주소',
  'video.caption': '영상 안내 문구',
  'results.cases.beforeCaption': '멘토링 전 설명',
  'results.cases.afterCaption': '멘토링 후 설명',
  'results.cases.beforeImage': '멘토링 전 이미지',
  'results.cases.afterImage': '멘토링 후 이미지',
  title: '섹션 제목',
  subtitle: '섹션 설명',
};

/** `mentoringTypes.items[2].title` → 섹션·칸·항목 번호. */
const parsePath = (path: string) => {
  const segments = path.split('.');
  const section = segments[0]?.replace(/\[\d+\]$/, '') ?? '';

  // 목록 안의 항목이면 그 번호를 사람이 세는 방식(1부터)으로 돌려준다.
  const indexed = segments.find((segment) => /\[\d+\]$/.test(segment));
  const index = indexed
    ? Number(indexed.match(/\[(\d+)\]$/)?.[1] ?? -1) + 1
    : null;

  const bare = segments.map((segment) => segment.replace(/\[\d+\]$/, ''));
  const fieldKey = bare.join('.');
  const leaf = bare[bare.length - 1] ?? '';

  return {
    section,
    index: index && index > 0 ? index : null,
    label: FIELD_LABELS[fieldKey] ?? FIELD_LABELS[leaf] ?? null,
  };
};

/** 앞 글자의 받침에 맞는 조사를 고른다. "제목을" / "문구를" 처럼 읽히게. */
const withParticle = (
  word: string,
  withFinal: string,
  withoutFinal: string,
) => {
  const last = word.charCodeAt(word.length - 1);
  const isHangul = last >= 0xac00 && last <= 0xd7a3;
  if (!isHangul) return `${word}${withFinal}`;
  return (last - 0xac00) % 28 === 0
    ? `${word}${withoutFinal}`
    : `${word}${withFinal}`;
};

/** 서버 검증 문구를 할 일로 바꾼다. 못 알아보면 그대로 돌려준다. */
const toAction = (field: string, reason: string): string => {
  if (reason.includes('공백'))
    return `${withParticle(field, '을', '를')} 채워 주세요.`;
  if (reason.includes('길이') || reason.includes('이내'))
    return `${withParticle(field, '이', '가')} 너무 깁니다. 줄여 주세요.`;
  return `${field}: ${reason}`;
};

/**
 * 저장 실패를 한 문장으로 만든다.
 *
 * 예) `[mentoringTypes.items[1].title] 공백일 수 없습니다`
 *   → `멘토링 유형의 2번 유형 제목을 채워 주세요.`
 */
export const describeSaveError = (error: unknown): string | undefined => {
  const message = (error as { message?: string } | null)?.message;
  if (!message) return undefined;

  /*
    경로 자체에 `items[1]` 처럼 대괄호가 들어 있다. `[^\]]+` 로 잡으면 그 첫 `]` 에서
    잘려 경로를 못 읽는다. 마지막 `]` + 공백까지 욕심껏 잡는다.
   */
  const matched = message.match(/^\[(.+)\]\s+(.+)$/);
  if (!matched) return message;

  const [, path, reason] = matched;
  const { section, index, label } = parsePath(path);
  const sectionLabel = SECTION_LABELS[section];

  // 어느 스텝인지도 모르면 서버 문구를 그대로 둔다. 지어내면 엉뚱한 곳을 찾게 된다.
  if (!sectionLabel || !label) return message;

  const where = index === null ? '' : `${index}번 `;
  return `${sectionLabel}의 ${where}${toAction(label, reason)}`;
};
