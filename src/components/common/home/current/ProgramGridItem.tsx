import clsx from 'clsx';

export interface ProgramGridItemProps {
  data: {
    imgColor: 'blue' | 'green' | 'gray' | 'yellow';
    status: 'BEFORE' | 'IN_PROGRESS' | 'DONE';
    title: string;
    description: string;
    isAllDay: boolean;
    startDate?: string;
    endDate?: string;
  };
}

const ProgramGridItem = ({ data }: ProgramGridItemProps) => {
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
            '/images/home/program-green.svg': data.imgColor === 'green',
            '/images/home/program-blue.svg': data.imgColor === 'blue',
            '/images/home/program-gray.svg': data.imgColor === 'gray',
            '/images/home/program-yellow.svg': data.imgColor === 'yellow',
          })}
          alt="프로그램 이미지"
          className="h-full w-full object-cover object-top"
        />
      </div>
      <span
        className={clsx(
          'rounded-xs text-xxs-0.75-medium lg:text-xs-0.875-medium border bg-opacity-10 px-2 py-0.5',
          {
            'border-secondary text-secondary bg-secondary bg-opacity-10':
              data.status === 'BEFORE',
            'border-primary bg-primary bg-opacity-10 text-primary':
              data.status === 'IN_PROGRESS',
            'border-neutral-40 text-neutral-40 bg-neutral-40 bg-opacity-[0.12]':
              data.status === 'DONE',
          },
        )}
      >
        {data.status === 'BEFORE'
          ? '사전알림 신청'
          : data.status === 'IN_PROGRESS'
          ? '모집 중'
          : data.status === 'DONE' && '마감'}
      </span>
      <h2 className="text-xs-1-semibold text-neutral-0 lg:text-md-1.375-semibold">
        {data.title}
      </h2>
      <p className="text-xs-0.875 lg:text-xs-1 text-neutral-30">
        {data.description}
      </p>
      <p className="text-xxs-0.75-medium lg:text-xs-0.875-medium text-neutral-0">
        {data.isAllDay
          ? '상시모집 중'
          : `${formatDateString(data.startDate)}~${formatDateString(
              data.endDate,
            )}`}
      </p>
    </li>
  );
};

export default ProgramGridItem;
