import ProblemSection from './components/ProblemSection';
import Header from './components/Header';
import SolutionSection from './components/SolutionSection';
import ProgramMenuSection from './components/ProgramMenuSection';
import ResultSection from './components/ResultSection';
import EndSection from './components/EndSection';

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
