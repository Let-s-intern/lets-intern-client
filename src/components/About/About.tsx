import ProblemSection from './Section/ProblemSection';
import TopSection from './Section/TopSection';
import SolutionSection from './Section/SolutionSection';
import ProgramMenuSection from './Section/ProgramMenuSection';

import './About.scss';

const About = () => {
  return (
    <div className="about-page">
      <main>
        <TopSection />
        <ProblemSection />
        <SolutionSection />
        <ProgramMenuSection />
      </main>
    </div>
  );
};

export default About;
