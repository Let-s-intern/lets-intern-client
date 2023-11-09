import programs from '../data/programs.json';
import SectionTitle from '../components/SectionTitle';
import ProgramListSlider from '../components/ProgramListSlider';
import TabBar from '../components/TabBar';
import TabItem from '../components/TabItem';

const Programs = () => {
  return (
    <main className="container mx-auto p-5">
      <TabBar itemCount={4}>
        <TabItem active>모든 프로그램</TabItem>
        <TabItem>챌린지</TabItem>
        <TabItem>부트캠프</TabItem>
        <TabItem>렛츠-챗</TabItem>
      </TabBar>
      <section className="mt-10">
        <SectionTitle fontWeight="bold">현재 모집중이에요</SectionTitle>
        <p className="text-gray-500">
          아래에서 모집중인 프로그램을 확인해보세요!
        </p>
        <ProgramListSlider programs={programs} style="active" />
      </section>
      <section className="mt-5">
        <SectionTitle fontWeight="bold">아쉽지만 마감되었어요</SectionTitle>
        <p className="text-gray-500">
          더 많은 프로그램들이 준비되어 있으니 걱정마세요!
        </p>
        <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {programs.map((program) => (
            <div
              className="w-full cursor-pointer rounded-lg border-[1.5px] border-gray-200 bg-white pb-10 pt-8 text-center text-[#9A99A4]"
              key={program.id}
            >
              <span>{program.category}</span>
              <h2 className="mt-2 text-2xl font-medium">
                {program.title}
                <br />
                모집 마감
              </h2>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Programs;
