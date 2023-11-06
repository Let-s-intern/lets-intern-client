import { Link } from 'react-router-dom';

import programs from '../data/programs.json';

interface CardProps {
  id: number;
  category: string;
  title: string;
  startDate: string;
  endDate: string;
  imageUrl: string;
}

interface BadgeButtonProps {
  category: string;
  disabled?: boolean;
  onClick?: () => void;
}

const BadgeButton = ({ category, disabled, onClick }: BadgeButtonProps) => {
  return (
    <button
      className={`rounded-full px-3 py-1 font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:ring-offset-2 sm:px-5 sm:text-lg ${
        disabled
          ? 'bg-gray-200 text-gray-400 hover:bg-gray-300'
          : 'bg-indigo-500 text-white hover:bg-indigo-700'
      }`}
      onClick={onClick}
    >
      {category}
    </button>
  );
};

const Card = ({
  id,
  category,
  title,
  startDate,
  endDate,
  imageUrl,
}: CardProps) => {
  return (
    <Link
      to={`/program/${id}`}
      className="mx-auto w-full overflow-hidden rounded-xl shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="aspect-video w-full rounded-xl bg-white">
        <img
          className="h-full w-full overflow-hidden object-cover"
          src={imageUrl}
          alt="Random"
        />
      </div>
      <div className="flex flex-col justify-between px-6 py-4">
        <div>
          <span className="font-semibold text-indigo-500">{category}</span>
          <h2 className="mb-2 text-xl font-bold">{title}</h2>
        </div>
        <p className="text-gray-400">
          {startDate}
          <br />
          {endDate}
        </p>
      </div>
    </Link>
  );
};

const Program = () => {
  return (
    <main className="container mx-auto p-4">
      <div className="flex gap-2 sm:gap-3">
        <BadgeButton category="All" />
        <BadgeButton category="챌린지" disabled />
        <BadgeButton category="부트캠프" disabled />
        <BadgeButton category="렛츠-챗 세션" disabled />
      </div>
      <section className="mt-5">
        <h1 className="text-2xl font-bold">현재 모집중이에요</h1>
        <p className="text-gray-500">
          아래에서 모집중인 프로그램을 확인해보세요!
        </p>
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {programs.map((program) => (
            <Card
              key={program.id}
              id={program.id}
              category={program.category}
              title={program.title}
              startDate={program.startDate}
              endDate={program.endDate}
              imageUrl={program.imageUrl}
            />
          ))}
        </div>
      </section>
      <section className="mt-10 md:mt-16">
        <h1 className="text-2xl font-bold">아쉽지만 마감되었어요</h1>
        <p className="text-gray-500">
          더 많은 프로그램들이 준비되어 있으니 걱정마세요!
        </p>
        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {programs.map((program) => (
            <Card
              key={program.id}
              id={program.id}
              category={program.category}
              title={program.title}
              startDate={program.startDate}
              endDate={program.endDate}
              imageUrl={program.imageUrl}
            />
          ))}
        </div>
      </section>
    </main>
  );
};

export default Program;
