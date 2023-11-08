import { Link } from 'react-router-dom';

import Program from '../interfaces/program';

interface CardProps {
  program: Program;
  className?: string;
}

const Card = ({ program, className }: CardProps) => {
  return (
    <Link
      to={`/program/${program.id}`}
      className={`mx-auto overflow-hidden rounded-xl shadow-lg transition-all sm:hover:-translate-y-1 sm:hover:shadow-xl${
        className ? ` ${className}` : ''
      }`}
    >
      <div className="aspect-video w-full rounded-xl bg-white">
        <img
          className="h-full w-full overflow-hidden object-cover"
          src={program.imageUrl}
          alt="Random"
        />
      </div>
      <div className="flex flex-col justify-between px-6 py-4">
        <div>
          <span className="font-semibold text-indigo-500">
            {program.category}
          </span>
          <h2 className="mb-2 text-xl font-bold">{program.title}</h2>
        </div>
        <p className="text-gray-400">
          {program.startDate}
          <br />
          {program.endDate}
        </p>
      </div>
    </Link>
  );
};

export default Card;
