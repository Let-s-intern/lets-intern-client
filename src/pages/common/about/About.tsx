import AboutHeader from '../../../components/common/about/header/AboutHeader';
import EndSection from '../../../components/common/about/section/EndSection';
import ProblemSection from '../../../components/common/about/section/ProblemSection';
import ProgramMenuSection from '../../../components/common/about/section/ProgramMenuSection';
import ResultSection from '../../../components/common/about/section/ResultSection';
import SolutionSection from '../../../components/common/about/section/SolutionSection';

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
