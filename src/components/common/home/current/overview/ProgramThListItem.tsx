import { Link } from 'react-router-dom';
import Badge from '../ui/Badge';
import { FaChevronRight } from 'react-icons/fa';
import clsx from 'clsx';

export interface ProgramThListItemProps {
  status: 'IN_PROGRESS' | 'BEFORE';
  title: string;
  openDate?: string;
}

const ProgramThListItem = ({
  status,
  title,
  openDate,
}: ProgramThListItemProps) => {
  const formatDateString = (dateString: string | undefined) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth();
    return `${year}년 ${month}월`;
  };

  return (
    <li
      className={clsx('flex h-[3.375rem] items-center justify-between px-3', {
        'bg-primary bg-opacity-10': status === 'IN_PROGRESS',
        'bg-neutral-100': status === 'BEFORE',
      })}
    >
      <div className="flex items-center gap-2">
        <h3 className="text-xs-1-semibold">{title}</h3>
        {status === 'IN_PROGRESS' ? (
          <Badge color="primary">모집 중</Badge>
        ) : (
          status === 'BEFORE' && (
            <span className="text-xxs-0.75 text-neutral-30">
              {formatDateString(openDate)} 오픈 예정
            </span>
          )
        )}
      </div>
      {status === 'IN_PROGRESS' ? (
        <button className="text-static-100 text-xs-0.875-semibold rounded-sm bg-primary px-4 py-2">
          신청하기
        </button>
      ) : (
        status === 'BEFORE' && (
          <Link
            to="#"
            className="text-neutral-30 text-xs-0.875-medium flex items-center gap-0.5"
          >
            <span>사전알림 신청</span>
            <i className="text-xxs-0.75 p-1">
              <FaChevronRight />
            </i>
          </Link>
        )
      )}
    </li>
  );
};

export default ProgramThListItem;
