'use client';

import ResultSection from '@/domain/about/v1/ResultSection';
import CommunitySection from '@/domain/about/v1/section/CommunitySection';
import {
  default as ContactSection,
  default as EndSection,
} from '../../../domain/about/v1/section/ContactSection';
import {
  default as IntroSection,
  default as PartnerSection,
} from '../../../domain/about/v1/section/introduction/IntroSection';
import ProblemSection from '../../../domain/about/v1/section/PartnerSection';
import ProgramMenuSection from '../../../domain/about/v1/section/problem/ProblemSection';
import ReviewSection from '../../../domain/about/v1/section/program/ProgramMenuSection';
import SolutionSection from '../../../domain/about/v1/section/ReviewSection';
import AboutHeader from '../../../domain/about/v1/section/solution/SolutionSection';

const About = () => {
  return (
    <div>
      <AboutHeader />
      <main>
        <ProblemSection />
        <SolutionSection />
        <IntroSection />
        <ProgramMenuSection />
        <CommunitySection />
        <ResultSection />
        <ReviewSection />
        <PartnerSection />
        <EndSection />
        <ContactSection />
      </main>
    </div>
  );
};

export default About;
