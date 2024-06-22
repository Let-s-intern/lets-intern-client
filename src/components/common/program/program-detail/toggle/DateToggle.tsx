import { useState } from 'react';
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md';

import { ProgramDate } from '../section/ApplySection';
import { ProgramType } from '../../../../../pages/common/program/ProgramDetail';
import dayjs from 'dayjs';

interface DateToggleProps {
  programDate: ProgramDate;
  programType: ProgramType;
}

const DateToggle = ({ programDate, programType }: DateToggleProps) => {

  return (
    <div className="rounded-sm bg-neutral-100">
      <div
        className="flex cursor-pointer items-center justify-center gap-0.5 rounded-sm bg-neutral-0 bg-opacity-5 px-1.5 py-4 text-neutral-0 text-opacity-[74%]"
      >
        <span className="font-semibold">프로그램 일정</span>
      </div>
        <div className="px-2">
          <div className="flex items-center justify-between p-1.5">
            <span className="text-neutral-0 text-opacity-[74%]">모집 마감</span>
            <span className="font-medium text-neutral-0 text-opacity-[94%]">
              {dayjs(programDate.deadline).format(
                `MM.DD (ddd) A hh시${
                  dayjs(programDate.deadline).minute() !== 0 ? ' mm분' : ''
                }`,
              )}
            </span>
          </div>
          {programType === 'challenge' && (
            <div className="flex items-center justify-between p-1.5">
              <span className="text-neutral-0 text-opacity-[74%]">OT 일시</span>
              <span className="font-medium text-neutral-0 text-opacity-[94%]">
                {dayjs(programDate.startDate).format('MM.DD (ddd)')} 오전 10시
              </span>
            </div>
          )}
          <div className="flex items-center justify-between p-1.5">
            <span className="shrink-0 text-neutral-0 text-opacity-[74%]">
              진행 기간
            </span>
            <span className="text-end font-medium text-neutral-0 text-opacity-[94%]">
              {programType === 'live' ? (
                <>
                  {dayjs(programDate.startDate).format(`MM.DD (ddd) A hh시`)}
                  <br /> ~{' '}
                  {dayjs(programDate.endDate).format(`MM.DD (ddd) A hh시`)}
                </>
              ) : (
                dayjs(programDate.startDate).format(`MM.DD (ddd)`) +
                ' ~ ' +
                dayjs(programDate.endDate).format(`MM.DD (ddd)`)
              )}
            </span>
          </div>
        </div>
    </div>
  );
};

export default DateToggle;
