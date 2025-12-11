import AboutHeader from './header/AboutHeader';
import CommunitySection from './section/CommunitySection';
import ContactSection from './section/ContactSection';
import EndSection from './section/EndSection';
import IntroSection from './section/introduction/IntroSection';
import PartnerSection from './section/PartnerSection';
import ProblemSection from './section/problem/ProblemSection';
import ProgramMenuSection from './section/program/ProgramMenuSection';
import ResultSection from './section/result/ResultSection';
import ReviewSection from './section/ReviewSection';
import SolutionSection from './section/solution/SolutionSection';

export default function AboutScreen() {
  return (
    <>
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
    </>
  );
}
