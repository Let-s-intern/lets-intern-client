import { useState } from 'react';
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md';

import { ProgramDate } from '../section/ApplySection';
import { ProgramType } from '../../../../../pages/common/program/ProgramDetail';

interface DateToggleProps {
  programDate: ProgramDate;
  programType: ProgramType;
}

const DateToggle = ({ programDate, programType }: DateToggleProps) => {
  const [isContentOpen, setIsContentOpen] = useState(false);

  const handleToggleClick = () => {
    setIsContentOpen(!isContentOpen);
  };

  const formatDateString = (dateString: string) => {
    const date = new Date(dateString);
    return `${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}.${date.getDate()} (${date.toLocaleDateString('ko-KR', {
      weekday: 'short',
    })}) ${date.getHours() >= 12 ? '오후' : '오전'} ${
      date.getHours() >= 12 ? date.getHours() - 12 : date.getHours()
    }시 ${date.getMinutes() !== 0 && `${date.getMinutes()}분`}`;
  };

  const formatDurationString = (dateString: string) => {
    const date = new Date(dateString);
    return `${(date.getMonth() + 1).toString().padStart(2, '0')}.${date
      .getDate()
      .toString()
      .padStart(2, '0')} (${date.toLocaleDateString('ko-KR', {
      weekday: 'short',
    })})`;
  };

  return (
    <div className="rounded-sm bg-neutral-100">
      <div
        className="flex cursor-pointer items-center justify-center gap-0.5 rounded-sm bg-neutral-0 bg-opacity-5 px-1.5 py-4 text-neutral-0 text-opacity-[74%]"
        onClick={handleToggleClick}
      >
        <span className="font-semibold">일정 보기</span>
        <span className="text-[1.5rem]">
          {isContentOpen ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
        </span>
      </div>
      {isContentOpen && (
        <div className="px-2">
          <div className="flex items-center justify-between p-1.5">
            <span className="text-neutral-0 text-opacity-[74%]">모집 마감</span>
            <span className="font-medium text-neutral-0 text-opacity-[94%]">
              {formatDateString(programDate.deadline)}
            </span>
          </div>
          {programType === 'challenge' && (
            <div className="flex items-center justify-between p-1.5">
              <span className="text-neutral-0 text-opacity-[74%]">OT 일시</span>
              <span className="font-medium text-neutral-0 text-opacity-[94%]">
                {formatDurationString(programDate.startDate)} 오전 10시
              </span>
            </div>
          )}
          <div className="flex items-center justify-between p-1.5">
            <span className="text-neutral-0 text-opacity-[74%]">진행 기간</span>
            <span className="font-medium text-neutral-0 text-opacity-[94%]">
              {formatDurationString(programDate.startDate)} ~{' '}
              {formatDurationString(programDate.endDate)}
              {/* 05.25 (토) ~ 06.21 (금) */}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateToggle;
