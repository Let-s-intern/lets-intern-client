import clsx from 'clsx';

import Button from '../button/Button';

interface Props {
  day: number;
  date: string;
  count?: number;
  totalCount: number;
  isEnd?: boolean;
  status: 'DONE' | 'WAITING' | 'NOT_STARTED';
}

const MissionResultItem = ({
  day,
  date,
  count = 0,
  totalCount,
  isEnd = false,
  status,
}: Props) => {
  return (
    <div className="font-pretendard">
      <div className="border-b-2 border-zinc-100 py-2 text-center">
        <span>{!isEnd ? `${day}일차` : '완주'}</span>
      </div>
      <div className="text-center">
        <span className="text-sm">{date}</span>
      </div>
      <div className="mt-4 flex justify-center">
        <div className="flex items-end justify-center">
          <span
            className={clsx('block -translate-y-1 text-3xl font-bold', {
              invisible: status === 'NOT_STARTED',
            })}
          >
            {count}
          </span>
          <span className="block">/{totalCount}</span>
        </div>
      </div>
      <div className="mt-2 flex h-12 flex-col items-center justify-between font-notosans">
        {status === 'DONE' ? (
          <>
            <Button>확인완료</Button>
            <Button>미션확인</Button>
          </>
        ) : status === 'WAITING' ? (
          <>
            <Button>확인대기</Button>
            <Button>미션확인</Button>
          </>
        ) : (
          status === 'NOT_STARTED' && <Button>대기</Button>
        )}
      </div>
    </div>
  );
};

export default MissionResultItem;
