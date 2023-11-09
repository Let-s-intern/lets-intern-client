import SectionTitle from '../../components/SectionTitle';
import ProgramListSlider from '../../components/ProgramListSlider';
import programs from '../../data/programs.json';

const Application = () => {
  return (
    <>
      <section>
        <SectionTitle>신청완료</SectionTitle>
        <ProgramListSlider programs={programs} cardType="신청 완료" />
      </section>
      <section>
        <SectionTitle className="mt-10">참여중</SectionTitle>
        <ProgramListSlider programs={programs} cardType="참여 중" />
      </section>
      <section>
        <SectionTitle className="mt-10">참여완료</SectionTitle>
        <ProgramListSlider programs={programs} cardType="참여 완료" />
      </section>
    </>
  );
};

export default Application;
