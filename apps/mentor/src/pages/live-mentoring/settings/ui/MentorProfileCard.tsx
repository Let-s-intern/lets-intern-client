import type { TemplateIntro } from '@/api/live-mentoring/liveMentoringSchema';

interface MentorProfileCardProps {
  intro: TemplateIntro;
}

const ChatIcon = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 20 20"
    className="h-4 w-4 shrink-0"
    fill="currentColor"
  >
    <path d="M10 3c-4 0-7 2.5-7 5.6 0 1.8 1 3.4 2.6 4.4l-.7 2.6c-.1.4.3.7.6.5l3-1.6c.5.1 1 .1 1.5.1 4 0 7-2.5 7-5.6S14 3 10 3Z" />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 20 20"
    className="h-4 w-4 shrink-0"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M8 5H5.5v9.5H15V12" />
    <path d="M11.5 4.5H15V8" />
    <path d="m9.5 10.5 5.5-6" />
  </svg>
);

/**
 * 탭 2 · 멘토 정보 (시안 `2-멘토 정보.png`) — **읽기 전용**이다.
 *
 * 값의 주인은 프로필 도메인이고 저장 요청 DTO에 `intro` 가 없다. 그런데도 이 화면에
 * 그대로 보여주는 이유는, 멘토가 상세 페이지에 무엇이 나가는지 확인할 수 있어야 하기
 * 때문이다. 고치는 길은 "프로필 수정하기" 하나로만 낸다 — 두 곳에서 고칠 수 있으면
 * 어느 쪽이 진짜인지 알 수 없어진다.
 */
const MentorProfileCard = ({ intro }: MentorProfileCardProps) => {
  /*
   * 소속·직책 한 줄 — `affiliation` 만 쓴다. 서버가 대표 경력에서 "회사 | 직책"
   * 형태로 만들어 주는 값이고, 시안의 "렛츠커리어 | CEO" 자리다.
   *
   * 예전에는 `description` 을 먼저 봤다. 그 필드는 자유 문구가 아니라 프로필의
   * "상세페이지 제작" 리치텍스트이고, Lexical 이 만든 JSON 문자열이 통째로 들어 있다.
   * 그대로 찍으니 `{"root":{"children":[...` 가 화면에 노출됐다.
   *
   * 웹의 멘토 상세(`domain/mentors/mentor-detail/MentorIntroSection`)는 같은 값을
   * parseLexicalRoot 로 파싱해 렌더한다 — 이 카드에는 한 줄만 들어가므로 쓰지 않는다.
   */
  const affiliationLine = intro.affiliation.trim();

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:gap-5">
        {intro.profileImage === null ? (
          <div className="bg-neutral-90 flex h-40 w-40 shrink-0 items-center justify-center rounded-lg text-xs text-neutral-50">
            프로필 사진 없음
          </div>
        ) : (
          <img
            src={intro.profileImage}
            alt={`${intro.nickname} 멘토 프로필 사진`}
            className="h-40 w-40 shrink-0 rounded-lg object-cover"
          />
        )}

        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <p className="text-xsmall16 text-neutral-0 font-semibold">
            {intro.nickname}
          </p>
          {affiliationLine === '' ? null : (
            <p className="text-neutral-40 text-xs">{affiliationLine}</p>
          )}

          {intro.careerLines.length === 0 ? null : (
            <ul className="text-neutral-20 mt-2 flex flex-col gap-1 text-xs">
              {intro.careerLines.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          )}

          {intro.oneLiner.trim() === '' ? null : (
            <div className="bg-primary-5 mt-3 rounded-lg px-4 py-3">
              <p className="text-primary flex items-center gap-1.5 text-xs font-semibold">
                <ChatIcon />
                멘토님의 한마디
              </p>
              <p className="text-neutral-20 mt-1.5 whitespace-pre-line text-xs leading-relaxed">
                {intro.oneLiner}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 고치는 길은 여기 하나뿐이다. 이 카드에는 입력이 없다. */}
      <a
        href="/profile"
        className="border-primary text-primary text-xsmall14 flex w-full items-center justify-center gap-1 rounded-md border py-3 font-medium transition-colors"
      >
        프로필 수정하기
        <ExternalLinkIcon />
      </a>
    </div>
  );
};

export default MentorProfileCard;
