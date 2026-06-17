import { CheckCircle2 } from 'lucide-react';

type ChallengeType = 'PERSONAL_STATEMENT' | 'PORTFOLIO';

const content = {
  PERSONAL_STATEMENT: {
    title: '필수 서류 중 하나인 자소서,',
    concerns: [
      {
        text: '한 항목에 경험이 하나만 있어도\n되는 걸까요? 너무 부실해보여요.',
        emoji: '😨',
      },
      {
        text: '흐름이 자꾸 반복되는 느낌인데,\n어디부터 고쳐야할지 모르겠어요.',
        emoji: '😨',
      },
      {
        text: '나만의 자소서 쓰기가 어려워요.\n매력적인 구성이 아닌 것 같아 계속\n썼다 지웠다만 반복하고 있어요.',
        emoji: '😨',
      },
    ],
    solutionTitle:
      '1:1 실시간 첨삭으로\n나에게 딱 맞춘 피드백 받고\n자소서 완성도 높이자!',
    benefits: [
      {
        imageSrc: '/images/personal-feedback.gif',
        imageAlt: '자소서 피드백',
        benefitTitle:
          '객관적인 시선으로 내 자소서에서\n놓친 부분을 바로 잡을 수 있어요',
        benefitDescription:
          '자기소개서 질문과 답변,\n활용하고자 하는 경험을 기반으로\n다시 서류를 보고 고치는 시간을 가질 거예요',
      },
    ],
  },
  PORTFOLIO: {
    title: '필수 서류 중 하나인 포폴,',
    subtitle: '혼자 만들 때 어떠셨나요?',
    concerns: [
      {
        text: '경험을 많이 보여주는 것과 하나를\n자세히 적는 것 중 어떤 게 더 좋은\n구성인지 모르겠어요ㅠㅠ',
        emoji: '😨',
      },
      {
        text: '실질적인 성과가 없는 활동이라 매력\n적으로 보이진 않을까 걱정이에요.',
        emoji: '😨',
      },
      {
        text: '포폴 가독성이 좋은지, 설득력\n있게 전개되는지 확신이 없어요...!',
        emoji: '😨',
      },
    ],
    solutionTitle:
      '1:1 실시간 첨삭으로\n나에게 딱 맞춘 피드백 받고\n포폴 완성도 높이자!',
    benefits: [
      {
        imageSrc: '/images/portfolio-feedback.gif',
        imageAlt: '포트폴리오 피드백',
        benefitTitle:
          '포폴 만들면서 궁금했던 점\n멘토님과 바로 해결할 수 있어요!',
        benefitDescription:
          '기존 포폴에 대한 코멘트와 딱 맞춘\n개선 방안까지 멘토링에서 가져갈 수 있어요',
      },
      {
        imageSrc: '/images/portfolio-feedback-catch.gif',
        imageAlt: '포트폴리오 피드백',
        benefitTitle: '실제 합격 자료 예시도 함께 해요!!',
        benefitDescription:
          '내 포폴 상황에서 참고할 수 있는\n실제 합격 자료도 함께 다뤄요',
      },
    ],
  },
};

export default function ChallengeFeedbackUI({
  challengeType,
}: {
  challengeType: ChallengeType;
}) {
  const currentContent = content[challengeType];

  return (
    <div className="flex w-full max-w-[1000px] flex-col px-5 pt-20 md:px-10 md:pt-40 lg:px-0">
      {/* Hero Section */}
      <section className="bg-primary py-28 pt-14 text-center">
        <div className="mb-2 md:mb-3">
          <span className="text-lg font-medium text-white md:text-2xl">
            이젠 진짜 만들기 시작해야하는데...
          </span>
        </div>
        <h1 className="text-medium24 md:text-xxlarge36 mb-8 font-bold text-white">
          {currentContent.title}
          <br />
          혼자 만들 때 어떠셨나요?
        </h1>
        <div className="relative mx-auto max-w-[90%] rounded-md bg-slate-100 p-4 md:max-w-[75%] md:p-12">
          <div>
            <div className="space-y-4 md:space-y-6">
              {currentContent.concerns.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-center gap-3 rounded-lg bg-white p-4 md:gap-4 md:p-6"
                >
                  <span className="flex-shrink-0 text-2xl md:text-3xl">
                    {item.emoji}
                  </span>
                  <p className="whitespace-pre-line text-left text-base leading-relaxed md:text-lg lg:text-2xl">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="absolute -bottom-8 left-1/2 h-0 w-0 -translate-x-1/2 border-l-[30px] border-r-[30px] border-t-[40px] border-l-transparent border-r-transparent border-t-slate-100 md:-bottom-12 md:border-l-[40px] md:border-r-[40px] md:border-t-[50px]"></div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-14 text-center">
        <div className="mb-2 md:mb-3">
          <span className="text-lg font-medium text-sky-400 md:text-2xl">
            혼자 만들면서 겪었던 어려움과 고민
          </span>
        </div>
        <h1 className="text-medium24 md:text-xxlarge36 mb-8 whitespace-pre-line font-bold">
          {currentContent.solutionTitle}
        </h1>

        <div className="flex flex-col gap-8">
          {currentContent.benefits.map((benefit, idx) => (
            <div key={idx}>
              <div className="mx-auto mb-8 max-w-[90%] md:max-w-[75%]">
                <img
                  className="w-full"
                  src={benefit.imageSrc}
                  alt={benefit.imageAlt}
                />
              </div>

              <div className="mx-auto max-w-[90%] rounded-md bg-sky-100 p-4 md:max-w-[75%] md:p-5">
                <div className="mb-1 flex flex-col items-center gap-1">
                  <CheckCircle2
                    fill="#879FFF"
                    strokeWidth={1}
                    className="text-white md:h-8 md:w-8"
                  />
                  <div>
                    <h3 className="whitespace-pre-line text-center text-lg font-bold text-gray-900 md:text-2xl">
                      {benefit.benefitTitle}
                    </h3>
                  </div>
                </div>

                <div className="text-neutral-10 whitespace-pre-line md:text-xl">
                  {benefit.benefitDescription}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
