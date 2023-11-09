import { Link } from 'react-router-dom';

import Program from '../interfaces/program';

interface CardProps {
  program: Program;
  cardType?: '신청 완료' | '참여 중' | '참여 완료' | '';
  className?: string;
}

const subtextColor: Record<string, string> = {
  '신청 완료': 'text-shade-2',
  '참여 중': 'text-primary',
  '참여 완료': 'text-shade-4',
  '': 'text-primary',
};

const badgeColor: Record<string, string> = {
  '신청 완료': 'bg-shade-2 text-neutral-white',
  '참여 중': 'bg-primary text-neutral-white',
  '참여 완료': 'bg-shade-4 text-neutral-white',
};

const Card = ({ program, cardType = '', className }: CardProps) => {
  return (
    <Link
      to={`/program/${program.id}`}
      className="group mx-auto flex aspect-[3/4] w-60 flex-col justify-between overflow-hidden rounded-md bg-neutral-silver px-6 py-6 text-neutral-grey transition-all hover:bg-shade-2 hover:text-white active:bg-shade-2 active:text-white"
    >
      <div>
        <div>
          <span
            className={`text-sm font-medium group-hover:text-white${
              cardType ? ` ${subtextColor[cardType]}` : ' text-primary'
            }`}
          >
            {program.category}
          </span>
          {cardType && (
            <span
              className={`ml-2 inline-block w-16 rounded py-[2px] text-center text-xs font-medium ${badgeColor[cardType]}`}
            >
              {cardType}
            </span>
          )}
        </div>
        <h2 className="mt-2 break-keep text-2xl font-medium">
          {program.title}
        </h2>
      </div>
      <p className="">
        {program.startDate}
        <br />
        {program.endDate}
      </p>
    </Link>
  );
};

export default Card;
