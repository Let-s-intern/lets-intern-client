import { ReactNode } from 'react';
import MainTitle from './MainTitle';

const differentiators = [
  {
    title: '마케팅 실무 역량 Class',
    description: (
      <>
        신입 마케터가 가장 막히는 실무 툴, <br className="md:hidden" />단 3회
        수업으로 한 번에 끝냅니다.
      </>
    ),
    visualExplanation: (
      <div className="md:mt[42px] mt-6 flex flex-col gap-2 md:gap-2.5">
        <div className="flex w-full min-w-60 flex-1 flex-col items-center justify-center gap-3 rounded-xs bg-white p-4 md:max-w-[696px] md:flex-row md:gap-6 md:rounded-sm md:p-8">
          <div className="h-fit w-full rounded-[4.5px] bg-neutral-90 md:max-w-[270px] md:rounded-sm">
            <picture>
              <source
                srcSet="/images/marketing-point1-mobile.png"
                media="(orientation: portrait)"
              />
              <img
                className="h-full w-full object-cover"
                srcSet="/images/marketing-point1-desktop.svg"
                alt="필요한 마케팅 역량(피그마, Google Analytics, Meta)을 보여주는 이미지"
              />
            </picture>
          </div>
          <div className="flex flex-col items-center justify-center gap-1.5 md:items-start md:gap-2">
            <div className="rounded-xxs bg-black px-2 py-[0.188rem] text-xxsmall12 font-medium text-white md:text-small18">
              마케터에게 필요한 역량만 쏙쏙!
            </div>
            <div className="text-center text-xsmall16 md:text-left md:text-medium24">
              <span className="font-medium">3회의 마케터 실무 역량 Class</span>
              <br />
              <span className="text-nowrap font-semibold">
                + 스타트업 CMO의 Hidden Track
              </span>
            </div>
          </div>
        </div>
        <div className="flex h-[114px] w-full min-w-60 flex-1 items-center justify-center gap-3 rounded-xs bg-white p-4 md:h-[164px] md:max-w-[696px] md:gap-5 md:rounded-sm md:p-8">
          <img
            className="h-auto w-[88px] md:w-[144px]"
            src="/logo/logo.svg"
            alt=""
          />
          <p className="text-xsmall16 font-semibold md:text-center md:text-medium24">
            <span className="text-neutral-0">
              4000명 이상, 서류 피드백 및 합격 노하우를{' '}
              <br className="hidden md:block" />
              보유한
            </span>{' '}
            <br className="md:hidden" />
            <span className="text-primary">렛츠커리어 합격 데이터까지!</span>
          </p>
        </div>
      </div>
    ),
  },
];

const Badge = ({ index }: { index: number }) => {
  return (
    <div className="flex h-8 w-20 items-center justify-center rounded-full bg-gradient-to-r from-[#7FDDFF] to-[#7395FF] md:h-[38px] md:w-[92px]">
      <div className="flex h-[28px] w-[76px] items-center justify-center rounded-full bg-[#060C1D] leading-none md:h-[34px] md:w-[88px]">
        <span className="gradient-text bg-gradient-to-b from-[#7FDDFF] to-[#8FAAFF] text-xsmall14 font-bold md:text-small18 md:font-semibold">
          차별점 {index}
        </span>
      </div>
    </div>
  );
};

const Differentiator = ({
  index,
  title,
  description,
  visualExplanation,
}: {
  index: number;
  title: ReactNode;
  description: ReactNode;
  visualExplanation: ReactNode;
}) => {
  return (
    <div className="flex flex-col items-center">
      <Badge index={index} />
      <MainTitle className="mb-1 mt-5 text-white md:mb-1.5">{title}</MainTitle>
      <p className="text-xsmall14 font-normal text-white/85 md:text-center md:text-small20">
        {description}
      </p>
      {visualExplanation}
    </div>
  );
};

const MarketingDifferentiatorsSection: React.FC = () => {
  return (
    <div className="flex w-full flex-col items-center bg-black px-5 md:px-0">
      {differentiators.map((item, index) => (
        <div key={index} className="w-full max-w-[1440px]">
          <Differentiator index={index + 1} {...item} />
        </div>
      ))}

      <div className="my-auto flex w-full min-w-60 flex-1 shrink basis-0 flex-col justify-center self-stretch">
        <div className="mt-14 flex w-80 max-w-full flex-col items-center">
          <div className="flex w-full max-w-xs flex-col items-center text-center">
            <Badge>차별점 2</Badge>
            <div className="mt-5 flex w-[294px] max-w-full flex-col items-center justify-center">
              <div className="text-2xl font-bold leading-none tracking-tight text-white">
                마케팅 실무 역량 Class
              </div>
              <div className="mt-1 text-sm leading-6 tracking-tight text-white">
                신입 마케터가 가장 막히는 실무 툴, <br />
                이젠 단 3회 수업으로 한 번에 끝냅니다.
              </div>
            </div>
          </div>
          <div className="mt-6 flex w-full max-w-xs flex-col items-center justify-center">
            <div className="flex w-full items-center gap-1">
              <div className="rounded my-auto flex-1 shrink basis-0 self-stretch overflow-hidden">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/24a913405ac64074b76cd0bc9ce0aa75/93b1400b07ed14a0bfc70e7cb13594bafca55047?placeholderIfAbsent=true"
                  className="aspect-[1.76] w-[104px] object-contain"
                />
                <div className="flex w-full flex-col items-center justify-center bg-white px-2 py-3">
                  <div className="flex flex-col items-center">
                    <div className="gap-1 self-stretch rounded-sm bg-black px-1 py-0.5 text-xs font-medium leading-tight tracking-normal text-white">
                      5월 1주차
                    </div>
                    <div className="flex flex-col items-center text-center text-zinc-800">
                      <div className="text-base font-bold tracking-normal text-zinc-800">
                        네이버웹툰
                      </div>
                      <div className="text-xs leading-none tracking-tight text-zinc-800">
                        퍼포먼스 마케터
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="rounded my-auto flex-1 shrink basis-0 self-stretch overflow-hidden">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/24a913405ac64074b76cd0bc9ce0aa75/72a7c6d88df1bf23047ef0224a2e850f3332b455?placeholderIfAbsent=true"
                  className="aspect-[1.76] w-[104px] object-contain"
                />
                <div className="flex w-full flex-col items-center justify-center bg-white px-2 py-3">
                  <div className="flex flex-col items-center">
                    <div className="gap-1 self-stretch rounded-sm bg-black px-1 py-0.5 text-xs font-medium leading-tight tracking-normal text-white">
                      5월 1주차
                    </div>
                    <div className="flex flex-col items-center text-center text-zinc-800">
                      <div className="text-base font-bold tracking-normal text-zinc-800">
                        클래스 101
                      </div>
                      <div className="text-xs leading-none tracking-tight text-zinc-800">
                        콘텐츠 마케터
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="rounded my-auto flex-1 shrink basis-0 self-stretch overflow-hidden">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/24a913405ac64074b76cd0bc9ce0aa75/1d4cd630ebcd2d2207424bd92a13007d17a6bcb0?placeholderIfAbsent=true"
                  className="aspect-[1.76] w-[104px] object-contain"
                />
                <div className="flex w-full flex-col items-center justify-center bg-white px-2 py-3">
                  <div className="flex flex-col items-center">
                    <div className="gap-1 self-stretch rounded-sm bg-black px-1 py-0.5 text-xs font-medium leading-tight tracking-normal text-white">
                      5월 2주차
                    </div>
                    <div className="flex flex-col items-center text-center text-zinc-800">
                      <div className="text-base font-bold tracking-normal text-zinc-800">
                        야놀자
                      </div>
                      <div className="text-xs leading-none tracking-tight text-zinc-800">
                        CRM 마케터
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-1 flex w-full items-center justify-center gap-1">
              <div className="rounded my-auto w-[104px] self-stretch overflow-hidden">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/24a913405ac64074b76cd0bc9ce0aa75/1d14e08c9f74462998c9412386bbfbbeef9770c8?placeholderIfAbsent=true"
                  className="aspect-[1.76] w-[104px] object-contain"
                />
                <div className="flex w-full flex-col items-center justify-center bg-white px-2 py-3">
                  <div className="flex flex-col items-center">
                    <div className="gap-1 self-stretch rounded-sm bg-black px-1 py-0.5 text-xs font-medium leading-tight tracking-normal text-white">
                      5월 3주차
                    </div>
                    <div className="flex flex-col items-center text-center text-zinc-800">
                      <div className="text-base font-bold tracking-normal text-zinc-800">
                        캐시노트
                      </div>
                      <div className="text-xs leading-none tracking-tight text-zinc-800">
                        그로스 마케터
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="rounded my-auto w-[104px] self-stretch overflow-hidden">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/24a913405ac64074b76cd0bc9ce0aa75/316792ff4487739e2a78e1c616899ef2a576608b?placeholderIfAbsent=true"
                  className="aspect-[1.76] w-[104px] object-contain"
                />
                <div className="flex w-full flex-col items-center justify-center bg-white px-2 py-3">
                  <div className="flex flex-col items-center">
                    <div className="gap-1 self-stretch rounded-sm bg-black px-1 py-0.5 text-xs font-medium leading-tight tracking-normal text-white">
                      5월 4주차
                    </div>
                    <div className="flex flex-col items-center whitespace-nowrap text-center text-zinc-800">
                      <div className="text-base font-bold tracking-normal text-zinc-800">
                        대학내일
                      </div>
                      <div className="text-xs leading-none tracking-tight text-zinc-800">
                        AE
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-14 flex w-80 max-w-full flex-col items-center">
          <div className="flex w-full max-w-xs flex-col items-center text-center">
            <Badge>차별점 3</Badge>
            <div className="mt-5 flex w-[294px] max-w-full flex-col items-center justify-center">
              <div className="text-2xl font-bold leading-8 tracking-tight text-white">
                4주 안에 서류 완성, <br />단 하나의 코스로 끝
              </div>
              <div className="mt-1 text-sm leading-6 tracking-tight text-white">
                4주 안에 경험 정리, 자소서, 포트폴���오까지 마케팅 직무에 꼭
                맞는 서류를 한 번에 완성하세요.
              </div>
            </div>
          </div>
          <div className="mt-6 w-full">
            <div className="flex w-full flex-col">
              <div className="w-full overflow-hidden rounded-md">
                <div className="w-full self-stretch whitespace-nowrap bg-zinc-300 px-2 py-2 text-center text-sm font-semibold leading-none tracking-tight text-zinc-500">
                  Before
                </div>
                <div className="flex w-full flex-col justify-center overflow-hidden rounded-none bg-neutral-100 px-1 py-2">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets/24a913405ac64074b76cd0bc9ce0aa75/28c40cc1def1160e4ce0149ce525a48c4bbc3cc6?placeholderIfAbsent=true"
                    className="aspect-[1.86] w-full object-contain"
                  />
                </div>
              </div>
              <div className="mt-1.5 self-start text-center text-base leading-6 tracking-normal text-white">
                캡쳐된 이미지로 경험이 나열된
                <br />
                평범한 포트폴리오
              </div>
            </div>
            <div className="mt-3 flex w-full flex-col justify-center overflow-hidden rounded-md text-center font-semibold text-white">
              <div className="w-full overflow-hidden whitespace-nowrap rounded-md text-sm leading-none tracking-tight">
                <div className="w-full self-stretch bg-blue-500 px-2 py-2 text-white">
                  After
                </div>
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/24a913405ac64074b76cd0bc9ce0aa75/c6db655f899ec6ec464b483499bb82ba59220211?placeholderIfAbsent=true"
                  className="aspect-[1.78] w-full object-contain"
                />
              </div>
              <div className="mt-1.5 self-center text-base leading-6 tracking-normal text-white">
                문제와 해결 전략, 성과까지
                <br />
                핵심 역량이 돋보이는 포트폴리오
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketingDifferentiatorsSection;
