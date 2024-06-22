import { useMediaQuery } from '@mui/material';
import { IProgram } from '../../../../../interfaces/interface';

import ProgramListItem from './ProgramListItem';

import { useQuery } from '@tanstack/react-query';

import axios from '../../../../../utils/axios';
import { useState, useCallback, useEffect } from 'react';
import LoadingContainer from '../../../ui/loading/LoadingContainer';
import EmptyContainer from '../../../ui/loading/EmptyContainer';

export interface ProgramOverviewListItemProps {
  title: string;
  description: string;
  imageColor?: 'blue' | 'green' | 'purple' | 'yellow';
}

interface DateInfo {
  year: number;
  month: number;
}

const getMonthStartEndDates = (year: number, month: number) => {
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0);
  const startDate = start.toISOString().split('T')[0] + 'T00:00:00';
  const endDate = end.toISOString().split('T')[0] + 'T23:59:59';
  return { startDate, endDate };
};

const getPreviousMonth = (year: number, month: number): DateInfo => {
  if (month === 1) {
    return { year: year - 1, month: 12 };
  } else {
    return { year, month: month - 1 };
  }
};

const getNextMonth = (year: number, month: number): DateInfo => {
  if (month === 12) {
    return { year: year + 1, month: 1 };
  } else {
    return { year, month: month + 1 };
  }
};

const ProgramOverviewListItem = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const now: DateInfo = {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
  };
  const [current, setCurrent] = useState<DateInfo>({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
  });
  const prevMonth = useCallback(
    () => getPreviousMonth(current.year, current.month),
    [current],
  );
  const nextMonth = useCallback(
    () => getNextMonth(current.year, current.month),
    [current],
  );
  const matches = useMediaQuery('(min-width: 768px)');

  const { isLoading, data } = useQuery<IProgram[]>({
    queryKey: ['HomeProgram', current],
    queryFn: async () => {
      const { startDate, endDate } = getMonthStartEndDates(
        current.year,
        current.month,
      );
      const res = await axios.get(`/program`, {
        params: {
          size: 4,
          startDate: startDate,
          endDate: endDate,
        },
      });
      console.log('res.data.data.programList', res.data.data.programList)
      return res.data.data.programList;
    },
  });

  useEffect(() => {
    if (isLoading) {
      setLoading(true);
    } else {
      const timer = setTimeout(() => setLoading(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);
  
  

  const goToPreviousMonth = () => {
    setCurrent(prevMonth());
  };

  const goToNextMonth = () => {
    setCurrent(nextMonth());
  };

  return (
    <div className="mt-6 overflow-hidden rounded-xs">
      <div className="flex items-center">
        {matches && (
          <div className="w-1/4 bg-neutral-80 py-3.5 text-center text-neutral-0/60">
            {`${prevMonth().year}년 ${prevMonth().month}월`}
          </div>
        )}
        <div className="flex w-full items-center justify-center gap-1 bg-primary-10 py-3.5 md:w-2/4">
          <img
            className={`w-5 ${(current.year === now.year && current.month === now.month)
                ? 'cursor-not-allowed opacity-30'
                : 'cursor-pointer'
              }`}
            onClick={() => {
              if (
                (current.year === now.year && current.month === now.month)
              ) {
                return;
              }
              goToPreviousMonth();
            }}
            src="/icons/Chevron_Left_MD.svg"
            alt="이전 달"
          />
          <span className="text-1">{`${current.year}년 ${current.month}월`}</span>
          <img
            className={`w-5 ${
              (current.year === now.year && current.month === now.month + 3) ||
              (now.month + 3 > 12 && current.year === now.year + 1 && current.month === now.month - 9)
                ? 'cursor-not-allowed opacity-30'
                : 'cursor-pointer'
            }`}
            onClick={() => {
              if (
                (current.year === now.year && current.month === now.month + 3) ||
                (now.month + 3 > 12 && current.year === now.year + 1 && current.month === now.month - 9)
              ) {
                return;
              }
              goToNextMonth();
            }}
            src="/icons/Chevron_Right_MD.svg"
            alt="다음 달"
          />
        </div>
        {matches && (
          <div className="w-1/4 bg-[#E8F9F2] py-3.5 text-center text-neutral-0/60">
            {`${nextMonth().year}년 ${nextMonth().month}월`}
          </div>
        )}
      </div>
      <ul className=" grid grid-cols-1 grid-rows-4 md:grid-rows-2 gap-4 md:grid-cols-2 overflow-y-scroll">
        {
          loading ? (
            <div className='row-span-4 h-[536px] md:col-span-2 md:row-span-2 md:h-[380px] flex items-center justify-center'>
              <LoadingContainer />
            </div>
          ) : !data ? (
            <div className='row-span-4 h-[536px] md:col-span-2 md:row-span-2 md:h-[380px] flex items-center justify-center'>
              <EmptyContainer />
            </div>
          ) : (
            data.length < 1 ? (
              <div className='row-span-4 h-[536px] md:col-span-2 md:row-span-2 md:h-[380px] flex items-center justify-center'>
                <EmptyContainer />
              </div>
            ) : (
              data.map((program) => (
                <ProgramListItem
                  key={program.programInfo.programType + program.programInfo.id}
                  program={program}
                />
              ))
            )
          )
        }
      </ul>
    </div>
  );
};

export default ProgramOverviewListItem;
