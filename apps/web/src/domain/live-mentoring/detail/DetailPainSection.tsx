import type { LiveMentorProfile } from '@/api/live-mentoring/liveMentoringSchema';
import { twMerge } from '@/lib/twMerge';

/**
 * 말풍선 문구에 끼워 넣을 직무 이름을 고른다.
 *
 * 시안(section-pain.png)에는 `@@@ 직무` 라는 플레이스홀더가 그대로 구워져 있었다.
 * 통이미지라 치환할 방법이 없어 사용자 화면에 `@@@` 가 그대로 나갔다.
 *
 * 상세 응답에는 직무 전용 필드가 없다. 가장 가까운 값이 대표 경력의 `position`
 * (예: "서비스 기획자") 이라 그것을 쓰고, 비공개이거나 비어 있으면 "원하는" 으로
 * 문장을 자연스럽게 닫는다.
 * TODO(BE): 상세 응답에 직무 필드가 생기면 이 파생을 걷어낼 것.
 */
export const painJobLabel = (careers: LiveMentorProfile['careers']): string => {
  const position = careers.find(
    (c) => c.visible && c.position.trim(),
  )?.position;
  return position?.trim() ?? '원하는';
};

/** 시안 0-2 · 말풍선 3개. tone 은 시안에서 뽑은 배경색이다. */
const BUBBLES = [
  {
    tone: 'bg-white',
    align: 'md:mr-auto',
    lines: (job: string) => [
      '관련 경험과 스펙이 없는데 내가 과연',
      `${job} 직무 취업을 할 수 있을까?`,
    ],
  },
  {
    tone: 'bg-[#e5f5ff]',
    align: 'md:ml-auto',
    lines: (job: string) => [
      `${job} 직무에서 선호하는 이력서, 자기소개서,`,
      '포트폴리오는 어떤 내용일까?',
    ],
  },
  {
    tone: 'bg-primary-5',
    align: 'md:mr-auto',
    lines: (job: string) => [
      '학생회, 동아리 경험은 있는데',
      `이걸 어떻게 ${job} 직무 역량으로 엮어야 할지 모르겠어요.`,
    ],
  },
] as const;

interface DetailPainSectionProps {
  careers: LiveMentorProfile['careers'];
}

/**
 * 시안 0-2 · "취업 준비, 혼자 하기 막막하셨나요?"
 *
 * 통이미지(section-pain.png, 1.4MB)를 마크업으로 옮긴 것이다. 문구가 전부 텍스트라
 * 검색엔진이 읽을 수 있고, `@@@` 플레이스홀더에 실제 직무가 들어간다.
 *
 * 배경 그라데이션과 말풍선 색은 시안 PNG 에서 픽셀로 뽑았다
 * (상단 #fefeff → 하단 #abc2ff, 말풍선 #ffffff / #e5f5ff / #f5f6ff).
 * 캐릭터는 글자가 아니라 삽화라 이미지로 남긴다 — 배경만 지운 pain-character.png.
 */
const DetailPainSection = ({ careers }: DetailPainSectionProps) => {
  const job = painJobLabel(careers);

  return (
    <section className="w-full scroll-mt-16 bg-gradient-to-b from-[#fefeff] to-[#abc2ff]">
      <div className="mw-1180 flex flex-col items-center break-keep px-5 pb-3 pt-12 md:pt-16">
        <h2 className="text-small20 md:text-xlarge30 whitespace-pre-line text-center font-bold">
          {'취업 준비,\n혼자 하기 막막하셨나요?'}
        </h2>

        <div className="mt-8 flex w-full max-w-[624px] flex-col gap-5 md:mt-11 md:gap-8">
          {BUBBLES.map((bubble, i) => (
            <div
              key={i}
              className={twMerge(
                'text-xsmall14 md:text-small18 relative w-full rounded-[20px] px-6 py-5 text-center leading-[1.6] md:w-[79%]',
                bubble.tone,
                bubble.align,
              )}
            >
              {bubble.lines(job).map((line) => (
                <p key={line}>{line}</p>
              ))}
              {/* 마지막 말풍선만 아래 캐릭터를 가리키는 꼬리를 단다 */}
              {i === BUBBLES.length - 1 && (
                <span
                  aria-hidden="true"
                  className="border-t-primary-5 absolute left-1/2 top-full h-0 w-0 -translate-x-1/2 border-x-[12px] border-t-[14px] border-x-transparent"
                />
              )}
            </div>
          ))}
        </div>

        {/* 삽화 — 시안 PNG 에서 배경만 지워 잘라냈다 */}
        <img
          src="/images/live-mentoring/pain-character.png"
          alt=""
          aria-hidden="true"
          width={253}
          height={257}
          className="mt-6 h-auto w-[92px] md:w-[128px]"
          loading="lazy"
        />
      </div>
    </section>
  );
};

export default DetailPainSection;
