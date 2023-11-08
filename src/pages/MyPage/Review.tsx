import SectionTitle from '../../components/SectionTitle';
import ProgramListSlider from '../../components/ProgramListSlider';
import programs from '../../data/programs.json';

const Review = () => {
  return (
    <div>
      <section>
        <SectionTitle>후기작성을 기다리고 있어요!</SectionTitle>
        <ProgramListSlider programs={programs} />
      </section>
      <section>
        <SectionTitle className="mt-10">작성한 후기 보기</SectionTitle>
        <ProgramListSlider programs={programs} />
      </section>
    </div>
  );
};

export default Review;
