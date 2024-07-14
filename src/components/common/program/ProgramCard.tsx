import clsx from 'clsx';
import { Dayjs } from 'dayjs';

import { Link } from 'react-router-dom';

const ProgramCard = ({
  endDate,
  id,
  shortDesc,
  startDate,
  thumbnail,
  title,
  type,
}: {
  type: 'challenge' | 'live';
  id: number;
  title: string;
  thumbnail: string;
  shortDesc: string;
  startDate: Dayjs;
  endDate: Dayjs;
}) => {
  const programLink = `/program/${type.toLowerCase()}/${id}`;

  return (
    <div
      className={clsx(
        'flex w-full flex-col items-start gap-4 overflow-hidden rounded-xs md:flex-row md:border md:border-neutral-85 md:p-2.5',
      )}
      data-program-text={title}
    >
      <div className="flex w-full flex-1 flex-col gap-2 md:flex-row md:gap-4">
        <Link to={programLink} className="hover:opacity-80">
          <img
            src={thumbnail}
            alt={`${title} 썸네일`}
            className="h-[7.5rem] w-full bg-primary-light object-cover md:h-[9rem] md:w-[11rem] md:rounded-xs"
          />
        </Link>
        <div className="flex flex-1 flex-col gap-2 py-2">
          <div className="flex justify-between">
            <h2 className="font-semibold">
              <Link to={programLink} className="hover:underline">
                {title}
              </Link>
            </h2>
          </div>
          <p className="text-sm text-neutral-30">{shortDesc}</p>
          <div className="flex items-center gap-1.5 md:justify-end">
            <span className="text-xs text-neutral-0">진행일정</span>
            <span className="text-xs font-medium text-primary-dark">
              {type === 'challenge'
                ? `${startDate.format('YY.MM.DD')} ~ ${endDate.format(
                    'YY.MM.DD',
                  )}`
                : startDate.format('YY.MM.DD')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramCard;
