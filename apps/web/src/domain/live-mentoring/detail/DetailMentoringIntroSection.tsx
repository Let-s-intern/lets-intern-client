/** 시안 0-3 · 추천 블록 3개. 멘토와 무관하게 모든 상세에 동일하게 나가는 고정 카피다. */
const RECOMMENDATIONS = [
  {
    headline: [
      '혼자 붙잡고 있던 지원서,',
      '제출 전 마지막으로 점검받고 싶어요',
    ],
    checks: [
      '이력서·자소서·포트폴리오에서 무엇을 고쳐야 할지 알고 싶은 분',
      '지원 직무와 공고 기준으로 내 강점이 잘 보이는지 확인받고 싶은 분',
    ],
  },
  {
    headline: ['뭘 더 해야 할지 몰라', '계속 제자리인 것 같아요'],
    checks: [
      '취업 준비는 해야 하는데 어디서부터 시작할지 막막한 분',
      '내 경험을 어떤 직무와 강점으로 연결해야 할지 모르겠는 분',
      '시간 낭비 없이 우선순위부터 잡고 싶은 분',
    ],
  },
  {
    headline: [
      '검색해도 안 나오는 취업 고민,',
      '현직자에게 바로 물어보고 싶어요',
    ],
    checks: [
      '내 상황에 맞는 현실적인 답변이 필요한 분',
      '궁금한 점을 바로 질문하고 즉석에서 피드백받고 싶은 분',
    ],
  },
] as const;

const CheckIcon = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 20 20"
    className="mt-0.5 h-5 w-5 shrink-0"
  >
    <rect
      x="0.75"
      y="0.75"
      width="18.5"
      height="18.5"
      rx="3.25"
      className="stroke-primary fill-white"
      strokeWidth="1.5"
    />
    <path
      d="m5.5 10.3 3.1 3.1 5.9-6.2"
      className="stroke-primary"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

interface DetailMentoringIntroSectionProps {
  id?: string;
}

/**
 * 시안 0-3 · "혼자 막힌 취업 준비, 1:1 LIVE 멘토링으로 빠르게 정리해요"
 *
 * 통이미지(section-mentoring-intro.png, 3.4MB)를 마크업으로 옮긴 것이다. 상세 페이지에서
 * 가장 긴 설명 덩어리인데 전부 이미지라 검색엔진에 한 글자도 노출되지 않았다.
 *
 * 색은 시안 PNG 에서 픽셀로 뽑아 디자인 토큰에 대응시켰다
 * (배경 #ffffff→#f5f6ff = primary-5, 카드 #edeefe = primary-10, 뱃지 #4d55f5 = primary).
 *
 * `DetailSection` 을 쓰지 않는 이유 — 그 래퍼는 배경이 흰색/검정 두 가지뿐인데
 * 이 섹션은 위아래 그라데이션이라 맞지 않는다. 헤더 타이포 스케일만 같게 맞췄다.
 */
const DetailMentoringIntroSection = ({
  id,
}: DetailMentoringIntroSectionProps) => (
  <section
    id={id}
    className="to-primary-5 w-full scroll-mt-16 bg-gradient-to-b from-white py-14 md:py-20"
  >
    <div className="mw-1180 flex flex-col items-center px-5">
      <span className="text-xsmall14 md:text-small20 text-neutral-30 font-semibold">
        멘토링 소개
      </span>
      <h2 className="text-small20 md:text-xlarge30 mt-2 whitespace-pre-line text-center font-bold">
        {'혼자 막힌 취업 준비,\n1:1 LIVE 멘토링으로 빠르게 정리해요'}
      </h2>
      <p className="text-xsmall14 md:text-small18 text-neutral-30 mt-3 text-center">
        지원서 점검부터 직무 방향까지, 지금 필요한 답을 현직자에게 바로
        들어보세요.
      </p>

      <ol className="mt-12 flex w-full max-w-[660px] flex-col gap-12 md:mt-16 md:gap-16">
        {RECOMMENDATIONS.map((item, i) => (
          <li key={item.headline[0]} className="flex flex-col">
            {/* 뱃지는 카드 좌상단에 걸치게 얹는다 (시안) */}
            <span className="text-xsmall14 md:text-xsmall16 bg-primary text-static-100 z-10 ml-4 w-fit -translate-y-1/2 rounded-lg px-4 py-1.5 font-semibold md:ml-6">
              추천 {i + 1}
            </span>
            <div className="bg-primary-10 -mt-4 rounded-2xl px-6 py-9 md:py-12">
              <p className="text-small18 md:text-medium24 whitespace-pre-line text-center font-bold">
                {item.headline.join('\n')}
              </p>
            </div>
            <ul className="text-xsmall14 md:text-small18 text-neutral-35 mt-6 flex flex-col gap-3 px-1 md:mt-8 md:px-4">
              {item.checks.map((check) => (
                <li key={check} className="flex items-start gap-3">
                  <CheckIcon />
                  <span>{check}</span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </div>
  </section>
);

export default DetailMentoringIntroSection;
