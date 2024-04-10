import clsx from 'clsx';
import Badge from '../ui/Badge';

export interface ProgramGridItemProps {
  imageColor: 'blue' | 'green' | 'gray' | 'yellow';
  status: 'BEFORE' | 'IN_PROGRESS' | 'DONE';
  title: string;
  description: string;
  allDay?: boolean;
  startDate?: string;
  endDate?: string;
}

const ProgramGridItem = ({
  imageColor,
  status,
  title,
  description,
  allDay,
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
      <div className="h-40 w-full overflow-hidden rounded-xs">
        <img
          src={clsx({
            '/images/home/program-green.svg': imageColor === 'green',
            '/images/home/program-blue.svg': imageColor === 'blue',
            '/images/home/program-gray.svg': imageColor === 'gray',
            '/images/home/program-yellow.svg': imageColor === 'yellow',
          })}
          alt="프로그램 이미지"
          className="h-full w-full object-cover object-top"
        />
      </div>
      {status === 'BEFORE' ? (
        <Badge color="secondary" responsive>
          사전알림 신청
        </Badge>
      ) : status === 'IN_PROGRESS' ? (
        <Badge color="primary" responsive>
          모집 중
        </Badge>
      ) : (
        status === 'DONE' && (
          <Badge color="gray" responsive>
            마감
          </Badge>
        )
      )}
      <h2 className="text-1-semibold lg:text-1.375-semibold text-neutral-0">
        {title}
      </h2>
      <p className="text-0.875 lg:text-1 text-neutral-30">{description}</p>
      <p className="text-0.75-medium lg:text-0.875-medium text-neutral-0">
        {allDay
          ? '상시 모집 중'
          : `${formatDateString(startDate)}~${formatDateString(endDate)}`}
      </p>
    </li>
  );
};

export default ProgramGridItem;
