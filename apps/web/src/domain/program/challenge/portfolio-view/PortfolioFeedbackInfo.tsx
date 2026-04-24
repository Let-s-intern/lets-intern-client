import { Break } from '@/common/Break';
import Heading2 from '@/common/header/Heading2';
import Description from '@/domain/program/program-detail/Description';
import SuperTitle from '@/domain/program/program-detail/SuperTitle';
import { twMerge } from '@/lib/twMerge';
import { Check, Plus } from 'lucide-react';
import Balancer from 'react-wrap-balancer';

const feedbackReviews = [
  {
    id: 1,
    content:
      '어떤 부분을 강조해야 하는지, 또 어떤 식으로 작성하면 좋은지 등을 구체적인 예시와 함께 알려주셔서 정말 큰 도움이 되었습니다.',
    from: '10기 한**',
  },
  {
    id: 2,
    content:
      '미션마다 순차적으로 진행되고, 매번 자세한 가이드라인을 제시해줘서 따라가기 벅차지 않았고, 특히 개별 피드백이 정말 많은 도움이 되었습니다!',
    from: '10기 양**',
  },
  {
    id: 3,
    content:
      '어떤 점이 부족하고 보완해야 하는 부분을 짚어주신 덕분에 수정 방향성을 잡을 수 있었던 점이 너무 좋았습니다!',
    from: '10기 권**',
  },
  {
    id: 4,
    content:
      '현업자의 시선에서 필요한 내용과 필요하지 않은 내용을 과감하게 짚어주셔서 보완하는 데 도움이 되었습니다.',
    from: '9기 정**',
  },
  {
    id: 5,
    content: '꼼꼼한 피드백을 받을 수 있어 좋았습니다.',
    from: '9기 배**',
  },
  {
    id: 6,
    content: '피드백을 통해 어느 부분을 강조해야 할지 알게 되어 유익했습니다!',
    from: '9기 전**',
  },
];

const PortfolioFeedbackInfo = () => {
  return (
    <div className="flex w-full flex-col items-center">
      {/* 피드백 리뷰 */}
      <div className="flex w-full flex-col items-center bg-neutral-90">
        <section className="flex w-full max-w-[1000px] flex-col px-5 py-20 md:px-10 md:pb-[140px] md:pt-[130px] lg:px-0">
          <div className="mb-16 md:mb-20">
            {/* <SuperTitle className="mb-3 md:text-center">

            </SuperTitle> */}
            <div
              className={twMerge(
                'mb-4 flex w-fit gap-x-2 rounded-sm md:mx-auto',
                'bg-white px-2 py-1 text-xsmall14',
                'font-bold sm:items-center md:gap-x-3',
                'md:rounded-md md:px-4 md:py-2.5 md:text-[18px]',
                'text-[#436653]',
              )}
            >
              <span className="text-medium22 md:text-xlarge28">👩🏻‍🏫</span>
              이전 기수 참여자들도 <br className="sm:hidden" />
              입을 모아 만족하는 멘토링
            </div>
            <Heading2>
              핵심 <span className="text-[#4A76FF]">콕!</span> 짚어주는 피드백
              받고 <span className="text-[#4A76FF]">포트폴리오 완성</span>해요
            </Heading2>
            <Description className="mt-3 md:mt-8 md:text-center">
              실시간 멘토링 받고, 바로 지원 가능한 포트폴리오 만들어가세요!
            </Description>
          </div>
          <div className="relative w-full overflow-hidden">
            <div className="absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-neutral-90 to-transparent"></div>
            <div className="absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-neutral-90 to-transparent"></div>
            <div
              className="flex w-max animate-infinite-scroll gap-5"
              style={{
                animationDuration: `${10000 * feedbackReviews.length}ms`,
              }}
            >
              {[...feedbackReviews, ...feedbackReviews].map((review, index) => (
                <div
                  key={`${review.id}-${index}`}
                  className="flex w-[300px] flex-col rounded-md bg-white p-4 md:w-[380px] md:p-6"
                >
                  <p className="mb-auto break-keep text-xsmall16 font-medium md:text-medium22">
                    {review.content}
                  </p>
                  <p className="mt-2 text-left md:mt-4 md:text-small20">
                    <span className="rounded-full bg-[#B1C4FF] px-3 py-1 text-xxsmall12 md:text-xsmall16">
                      {review.from}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* 피드백 안내 (라이브 멘토링) */}
      <div className="flex w-full flex-col items-center">
        <section className="flex w-full max-w-[1000px] flex-col px-5 py-20 md:px-10 md:pb-[140px] md:pt-[130px] lg:px-0">
          <div className="mb-6 md:mb-20">
            <SuperTitle className="mb-3 text-[#4A76FF] md:text-center">
              피드백 제공
            </SuperTitle>
            {/* <div className="mb-4 flex w-fit gap-x-2 rounded-sm bg-white px-2 py-1 text-xsmall14 font-bold sm:items-center md:gap-x-3 md:rounded-md md:px-4 md:py-2.5 md:text-[18px]">
              에서는
              <br className="sm:hidden" /> 이런 걸 가져갈 수 있어요
            </div> */}
            <Heading2 className="break-keep text-neutral-30">
              <Balancer>
                포트폴리오 챌린지에서는 렛츠커리어
                <Break />
                <span className="text-[#4A76FF]">
                  취업 연구팀의 라이브 멘토링 최대 2회
                </span>{' '}
                제공되어요
              </Balancer>
            </Heading2>
            <Description className="mt-3 break-keep md:mt-8 md:text-center">
              <Balancer>
                <span className="font-semibold">3000+명의 참여자와</span> 합격
                서류 및 노하우를 가진 취업 연구팀과
                <Break />
                <span className="font-semibold">20분간 실시간 첨삭</span>으로
                포트폴리오를 발전시킬 수 있어요.
              </Balancer>
            </Description>
          </div>
          <div className="flex flex-col-reverse gap-5 md:flex-row md:items-start md:gap-10">
            <img
              src="/images/mentoring-500-185.jpg"
              alt="멘토링 이미지"
              className="mx-auto aspect-[500/185] w-[500px] min-w-0"
            />
            <div className="flex flex-col items-start gap-4">
              <span className="rounded-full bg-[#7897F9] px-4 py-1 text-xxsmall12 font-semibold text-white md:text-xsmall16">
                라이브 멘토링 진행
              </span>
              <p className="text-xsmall14 text-neutral-30 md:text-small18">
                스탠다드(피드백 1회) 선택 시: 6회차 미션 후<br></br>
                프리미엄(피드백 2회) 선택 시: 4회차 미션 후, 6회차 미션 후
              </p>
              <span className="text-xxsmall12 text-neutral-40 md:text-xsmall16">
                *베이직 선택 시 미진행
              </span>
            </div>
          </div>
        </section>
      </div>
      {/* 피드백 옵션 일정 안내 */}
      <div className="flex w-full flex-col items-center bg-neutral-90">
        <section className="flex w-full max-w-[1000px] flex-col px-5 py-20 md:px-10 md:pb-[140px] md:pt-[130px] lg:px-0">
          <div className="mb-16 md:mb-20">
            <SuperTitle className="mb-3 text-[#4A76FF] md:text-center">
              옵션 일정
            </SuperTitle>
            <div className="mb-1.5 text-xsmall16 font-bold text-[#1A2A5D] md:text-center md:text-medium24">
              자신있게 추천합니다!
            </div>
            <Heading2>높은 퀄리티의 포트폴리오를 위한 피드백 옵션</Heading2>
            {/* <Description className="mt-3 md:mt-8 md:text-center">
              asdf
            </Description> */}
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-10">
            {/* 프리미엄 옵션 */}
            <div className="mx-auto max-w-[500px] rounded-lg bg-white p-4 md:p-8">
              <div className="mx-auto overflow-hidden rounded-xxl">
                <h3 className="text-16 break-keep bg-[#B1C4FF] px-3 py-5 text-center font-medium md:text-medium22">
                  <span className="font-semibold">피드백 두 번</span>으로{' '}
                  <span className="font-semibold">완성본</span> 만들어가고
                  싶다면,
                </h3>
                <div className="bg-neutral-95 px-5 py-6">
                  <div className="mb-6 flex w-full flex-col gap-2">
                    <h4 className="mb-1 rounded-sm bg-[#FBFBA3] px-3 py-2 text-xsmall14 font-semibold md:text-small18">
                      1. <strong>4회차 미션</strong> 후 실시간 피드백
                    </h4>
                    <CheckItem text="스스로 미션을 잘 수행하고 있는지 궁금하신가요?" />
                    <CheckItem text="피드백 받고 싶은 포트폴리오 항목을 첨부하고 궁금한 점을 해결해보세요!" />
                  </div>
                  <div className="flex w-full flex-col gap-2">
                    <h4 className="mb-1 rounded-sm bg-[#FBFBA3] px-3 py-2 text-xsmall14 font-semibold md:text-small18">
                      2. <strong>마지막 미션</strong> 후 실시간 피드백
                    </h4>
                    <CheckItem text="수정한 항목이 괜찮은지 궁금하신가요?" />
                    <CheckItem text="1차 피드백을 기반으로 수정한 포트폴리오를 첨부 또는, 다른 항목을 선택하여 피드백을 받아보세요!" />
                    <div className="flex items-start gap-1.5">
                      <Plus className="mt-0.5 h-4 w-4 text-[#47C8FE] md:mt-1" />
                      <span className="break-keep text-xsmall14 font-semibold md:text-xsmall16">
                        피드백 바탕으로 추천드리는 합격자 서류 자료 공유
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <hr className="my-6" />
              <div className="rounded-lg bg-[#B1C4FF] py-3 text-center text-xsmall16 font-semibold md:py-5 md:text-medium22">
                프리미엄 옵션
              </div>
            </div>

            {/* 스탠다드 옵션 */}
            <div className="mx-auto flex w-full max-w-[500px] flex-col rounded-lg bg-white p-4 md:p-8">
              <div className="mx-auto flex w-full flex-1 flex-col overflow-hidden rounded-xxl">
                <h3 className="text-16 break-keep bg-[#E3EAFF] px-3 py-5 text-center font-medium md:text-medium22">
                  최종 점검 피드백 한 번이 필요하다면,
                </h3>
                <div className="flex-1 bg-neutral-95 px-5 py-6">
                  <div className="flex w-full flex-col gap-2">
                    <h4 className="mb-1 rounded-sm bg-[#FBFBA3] px-3 py-2 text-xsmall14 font-semibold md:text-small18">
                      1. <strong>마지막 미션</strong> 후 실시간 피드백
                    </h4>
                    <CheckItem text="서류 완성 후 스스로 잘 작성하셨는지 고민이신가요?" />
                    <CheckItem text="피드백 받고 싶은 포트폴리오 항목을 첨부하고 궁금한 점을 해결해보세요!" />
                  </div>
                </div>
              </div>
              <hr className="my-6" />
              <div className="rounded-lg bg-[#E3EAFF] py-3 text-center text-xsmall16 font-semibold md:py-5 md:text-medium22">
                스탠다드 옵션
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

const CheckItem = ({ text }: { text: string }) => {
  return (
    <div className="flex items-start gap-1.5">
      <Check className="mt-0.5 h-4 w-4 flex-none md:mt-1" />
      <span className="break-keep text-xsmall14 md:text-xsmall16">{text}</span>
    </div>
  );
};

export default PortfolioFeedbackInfo;
