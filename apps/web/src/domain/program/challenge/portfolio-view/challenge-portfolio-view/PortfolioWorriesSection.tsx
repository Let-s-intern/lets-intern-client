'use client';

import SectionSubHeader from '../../../../../common/header/SectionSubHeader';
import MainTitle from '../../ui/MainTitle';

const PortfolioWorriesSection: React.FC = () => {
  return (
    <section className="w-full bg-[#4A76FF] px-5 py-20 md:px-10 md:py-32 lg:px-0">
      <div className="mb-[30px] flex flex-col items-start gap-2 md:mb-[50px] md:items-center md:gap-3">
        <SectionSubHeader className="text-left font-normal text-white md:text-center">
          이젠 진짜 만들기 시작해야하는데...
        </SectionSubHeader>
        <MainTitle className="text-left text-white md:text-center">
          필수 서류 중 하나인 포폴, <br className="md:hidden" />
          혼자 만들 때 어떠셨나요?
        </MainTitle>
      </div>

      <div className="mx-auto flex w-full max-w-[1000px] flex-col items-stretch gap-3 max-md:max-w-full md:flex-row md:px-0">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            {
              icon: '😨',
              content:
                '경험을 많이 보여주는 것과 하나를 자세히 적는 것 중 어떤게 더 좋은 구성인지 모르겠어요ㅠㅠ',
            },
            {
              icon: '😭',
              content:
                '실질적인 성과가 없는 활동이라 매력적으로 보이지 않을까 걱정이에요.',
            },
            {
              icon: '😥',
              content:
                '포폴 가독성이 좋은지, 설득력 있게 전개되는지 확신이 없어요...! ',
            },
          ].map((item) => (
            <div
              key={item.content}
              className="flex items-center gap-5 rounded-md bg-white px-6 py-4 text-left md:flex-col md:px-8 md:py-5 md:text-center"
            >
              <p className="text-xxlarge36">{item.icon}</p>
              <p className="text-xsmall16 break-keep font-medium">
                {item.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PortfolioWorriesSection;
