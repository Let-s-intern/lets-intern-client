import SectionHeader from '@/common/header/SectionHeader';
import SectionSubHeader from '@/common/header/SectionSubHeader';
import React from 'react';
import MainTitle from '../ui/MainTitle';
import Curriculums from './Curriculums';

const MarketingCurriculumSection: React.FC = () => {
  return (
    <section
      id="curriculum"
      className="flex scroll-mt-[56px] flex-col items-center bg-[#F0F4FF] px-5 pb-32 pt-16 md:scroll-mt-[60px] md:px-0 md:pb-24"
    >
      <SectionHeader className="mb-6 md:mb-[42px]">커리큘럼</SectionHeader>

      <div className="mb-[30px] flex w-full flex-col gap-2 md:mb-[50px] md:gap-3">
        <SectionSubHeader className="text-[#4A76FF]">
          현직자 피드백+서류 완성까지
        </SectionSubHeader>
        <MainTitle className="flex flex-col gap-3 md:gap-0">
          <span>
            실무 역량 Class 4회 <br className="md:hidden" />+ 현직자 세미나
            4회와 함께
          </span>
          <span>
            8회의 미션으로 만드는 <br className="md:hidden" />
            밀도 있는 4주간의 여정
          </span>
        </MainTitle>
      </div>

      <Curriculums />
    </section>
  );
};

export default MarketingCurriculumSection;
