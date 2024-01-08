import ProblemSection from './Section/ProblemSection';
import Header from './Section/Header';
import SolutionSection from './Section/SolutionSection';
import ProgramMenuSection from './Section/ProgramMenuSection';
import ResultSection from './Section/ResultSection';
import EndSection from './Section/EndSection';

import './About.scss';

const About = () => {
  return (
    <div className="about-page">
      <Header />
      <main>
        <ProblemSection />
        <SolutionSection />
        <ProgramMenuSection />
        <ResultSection />
        <EndSection />
        {/* <BottomSection /> */}
      </main>
    </div>
  );
};

export default About;
