import { Link } from 'react-router-dom';

import Program from '../interfaces/program';

interface CardProps {
  program: Program;
  cardType?: '신청 완료' | '참여 중' | '참여 완료' | '';
  className?: string;
  closed?: boolean;
  loading?: boolean;
}

const typeToCategory: Record<string, string> = {
  BOOTCAMP: '부트캠프',
  CHALLENGE_HALF: '챌린지',
  LETS_CHAT: '렛츠챗',
};

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

const Card = ({
  program,
  cardType = '',
  closed,
  loading,
  className,
}: CardProps) => {
  if (closed) {
    return (
      <div
        className={`w-full cursor-pointer rounded-lg border-[1.5px] border-gray-200 bg-white pb-10 pt-8 text-center text-[#9A99A4]${
          className ? ` ${className}` : ''
        }`}
      >
        <span>{!loading ? typeToCategory[program.type] : ' '}</span>
        <h2 className="mt-2 text-2xl font-medium">
          {/* {program.title} */}
          <br />
          모집 마감
        </h2>
      </div>
    );
  }

  return (
    <Link
      to={!loading ? `/program/${program.id}` : ' '}
      className={`group mx-auto flex aspect-[3/4] w-60 flex-col justify-between overflow-hidden rounded-md bg-neutral-silver px-6 py-6 text-neutral-grey transition-all hover:bg-shade-2 hover:text-white active:bg-shade-2 active:text-white${
        className ? ` ${className}` : ''
      }`}
    >
      <div>
        <div>
          <span
            className={`text-sm font-medium group-hover:text-white${
              cardType ? ` ${subtextColor[cardType]}` : ' text-primary'
            }`}
          >
            {!loading ? typeToCategory[program.type] : 'Loading...'}
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
          {/* {program.title} */}
        </h2>
      </div>
      <p className="">
        {!loading ? program.startDate : ' '}
        <br />
        {!loading ? program.dueDate : ' '}
      </p>
    </Link>
  );
};

export default Card;
