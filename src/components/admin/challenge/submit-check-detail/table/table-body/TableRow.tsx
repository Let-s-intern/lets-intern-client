import clsx from 'clsx';

import { Link } from 'react-router-dom';

interface Props {
  attendance: any;
  th: number;
  bgColor: 'DARK' | 'LIGHT';
}

const TableRow = ({ attendance, th, bgColor }: Props) => {
  const statusToText: any = {
    CREATED: '미제출',
    PASSED: '제출',
    WRONG: '잘못된 제출',
    UPDATED: '수정된 제출',
    LATED: '지각 제출',
  };

  return (
    <div
      className={clsx('flex justify-between', {
        'bg-[#F1F1F1]': bgColor === 'DARK',
        'bg-[#F7F7F7]': bgColor === 'LIGHT',
      })}
    >
      <div className="flex-1 overflow-hidden text-ellipsis border-r border-[#D9D9D9] py-3 text-center">
        {th}
      </div>
      <div className="flex-1 overflow-hidden text-ellipsis border-r border-[#D9D9D9] py-3 text-center">
        {attendance.userName}
      </div>
      <div className="flex-1 overflow-hidden text-ellipsis border-r border-[#D9D9D9] py-3 text-center">
        {attendance.userEmail}
      </div>
      <div className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap border-r border-[#D9D9D9] py-3 text-center">
        {attendance.userAccountType} {attendance.userAccountNumber}
      </div>
      <div className="flex-1 overflow-hidden text-ellipsis border-r border-[#D9D9D9] py-3 text-center">
        {statusToText[attendance.status]}
      </div>
      <div className="flex flex-1 justify-center overflow-hidden text-ellipsis border-r border-[#D9D9D9] py-3 text-center">
        <Link
          to={attendance.link}
          target="_blank"
          className="rounded border border-zinc-600 px-4 py-[2px] text-xs duration-200 hover:bg-neutral-700 hover:text-white"
        >
          확인
        </Link>
      </div>
      <div className="flex-1 overflow-hidden text-ellipsis border-r border-[#D9D9D9] py-3 text-center">
        {attendance.isRefunded ? '환급완료' : '환급대기'}
      </div>
      <div className="flex-1 overflow-hidden text-ellipsis py-3 text-center">
        {attendance.comment}
      </div>
    </div>
  );
};

export default TableRow;
