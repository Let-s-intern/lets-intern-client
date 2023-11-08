import programs from '../data/programs.json';
import BadgeButton from '../components/BadgeButton';
import Card from '../components/Card';
import SectionTitle from '../components/SectionTitle';

const Program = () => {
  return (
    <main className="container mx-auto p-5">
      <div className="flex gap-2 sm:gap-3">
        <BadgeButton category="All" />
        <BadgeButton category="챌린지" disabled />
        <BadgeButton category="부트캠프" disabled />
        <BadgeButton category="렛츠-챗 세션" disabled />
      </div>
      <section className="mt-5">
        <SectionTitle>현재 모집중이에요</SectionTitle>
        <p className="text-gray-500">
          아래에서 모집중인 프로그램을 확인해보세요!
        </p>
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {programs.map((program) => (
            <Card key={program.id} program={program} />
          ))}
        </div>
      </section>
      <section className="mt-10 md:mt-16">
        <SectionTitle>아쉽지만 마감되었어요</SectionTitle>
        <p className="text-gray-500">
          더 많은 프로그램들이 준비되어 있으니 걱정마세요!
        </p>
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {programs.map((program) => (
            <Card key={program.id} program={program} />
          ))}
        </div>
      </section>
    </main>
  );
};

export default Program;
