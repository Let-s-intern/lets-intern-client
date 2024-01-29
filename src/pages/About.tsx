import AboutHeader from '../components/header/AboutHeader';
import EndSection from '../components/section/about/EndSection';
import ProblemSection from '../components/section/about/ProblemSection';
import ProgramMenuSection from '../components/section/about/ProgramMenuSection';
import ResultSection from '../components/section/about/ResultSection';
import SolutionSection from '../components/section/about/SolutionSection';

const About = () => {
  return (
    <>
      <AboutHeader />
      <main>
        <ProblemSection />
        <SolutionSection />
        <ProgramMenuSection />
        <ResultSection />
        <EndSection />
        {/* <BottomSection /> */}
      </main>
    </>
  );
};

export default About;
