import clsx from 'clsx';
import Badge from '../ui/Badge';

export interface ProgramGridItemProps {
  imgColor: 'blue' | 'green' | 'gray' | 'yellow';
  status: 'BEFORE' | 'IN_PROGRESS' | 'DONE';
  title: string;
  description: string;
  isAllDay: boolean;
  startDate?: string;
  endDate?: string;
}

const ProgramGridItem = ({
  imgColor,
  status,
  title,
  description,
  isAllDay,
  startDate,
  endDate,
}: ProgramGridItemProps) => {
  const formatDateString = (dateString: string | undefined) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear().toString().slice(-2);
    const month =
      date.getMonth() + 1 > 9 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`;
    const day = date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`;
    const weekDay = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];
    return `${year}.${month}.${day}(${weekDay})`;
  };

  return (
    <li className="flex flex-col items-start gap-2">
      <div className="rounded-xs h-40 w-full overflow-hidden">
        <img
          src={clsx({
            '/images/home/program-green.svg': imgColor === 'green',
            '/images/home/program-blue.svg': imgColor === 'blue',
            '/images/home/program-gray.svg': imgColor === 'gray',
            '/images/home/program-yellow.svg': imgColor === 'yellow',
          })}
          alt="프로그램 이미지"
          className="h-full w-full object-cover object-top"
        />
      </div>
      {status === 'BEFORE' ? (
        <Badge color="secondary">사전알림 신청</Badge>
      ) : status === 'IN_PROGRESS' ? (
        <Badge color="primary">모집 중</Badge>
      ) : (
        status === 'DONE' && <Badge color="gray">마감</Badge>
      )}
      <h2 className="text-xs-1-semibold text-neutral-0 lg:text-md-1.375-semibold">
        {title}
      </h2>
      <p className="text-xs-0.875 lg:text-xs-1 text-neutral-30">
        {description}
      </p>
      <p className="text-xxs-0.75-medium lg:text-xs-0.875-medium text-neutral-0">
        {isAllDay
          ? '상시모집 중'
          : `${formatDateString(startDate)}~${formatDateString(endDate)}`}
      </p>
    </li>
  );
};

export default ProgramGridItem;
