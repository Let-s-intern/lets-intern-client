import CommunitySection from './CommunitySection';
import ContactSection from './ContactSection';
import EndSection from './EndSection';
import AboutHeader from './header/AboutHeader';
import IntroSection from './introduction/IntroSection';
import PartnerSection from './PartnerSection';
import ProblemSection from './problem/ProblemSection';
import ProgramMenuSection from './program/ProgramMenuSection';
import ResultSection from './result/ResultSection';
import ReviewSection from './ReviewSection';
import SolutionSection from './solution/SolutionSection';

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
