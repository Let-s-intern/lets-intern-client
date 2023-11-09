import SectionTitle from '../../components/SectionTitle';
import ProgramListSlider from '../../components/ProgramListSlider';
import programs from '../../data/programs.json';

const Review = () => {
  return (
    <div className="mt-7">
      <section>
        <SectionTitle>후기를 기다리고 있어요</SectionTitle>
        <ProgramListSlider programs={programs} cardType="참여 완료" />
      </section>
      <section>
        <SectionTitle className="mt-10">작성한 후기 확인하기</SectionTitle>
        <ProgramListSlider programs={programs} cardType="참여 완료" />
      </section>
    </div>
  );
};

export default Review;
