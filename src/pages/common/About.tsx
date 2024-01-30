import AboutHeader from '../../components/common/header/AboutHeader';
import EndSection from '../../components/common/section/about/EndSection';
import ProblemSection from '../../components/common/section/about/ProblemSection';
import ProgramMenuSection from '../../components/common/section/about/ProgramMenuSection';
import ResultSection from '../../components/common/section/about/ResultSection';
import SolutionSection from '../../components/common/section/about/SolutionSection';

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
