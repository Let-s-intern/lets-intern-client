import ProblemSection from './Section/ProblemSection';
import TopSection from './Section/TopSection';
import SolutionSection from './Section/SolutionSection';
import ProgramMenuSection from './Section/ProgramMenuSection';
import ResultSection from './Section/ResultSection';
import EndSection from './Section/EndSection';
import BottomSection from './Section/BottomSection';

import './About.scss';

const About = () => {
  return (
    <div className="about-page">
      <main>
        <TopSection />
        <ProblemSection />
        <SolutionSection />
        <ProgramMenuSection />
        <ResultSection />
        <EndSection />
        <BottomSection />
      </main>
    </div>
  );
};

export default About;
