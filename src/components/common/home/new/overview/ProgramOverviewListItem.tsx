import { useMediaQuery } from '@mui/material';
import { IProgram } from '../../../../../interfaces/interface';

import ProgramListItem from './ProgramListItem';

import { useQuery } from '@tanstack/react-query';

import axios from '../../../../../utils/axios';
import { useState, useCallback, useEffect } from 'react';
import LoadingContainer from '../../../ui/loading/LoadingContainer';
import EmptyContainer from '../../../ui/loading/EmptyContainer';
import ProgramListItemContainer from './ProgramListItemContainer';
import EmptyListItemContainer from './EmptyListItemContainer';

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

const emptyList = [
  {
    link: 'https://forms.gle/ddFtGQfBpGk7Jxpq9',
    thumbnail: '/images/home/challenge-thumbnail.png',
    title: '신규 챌린지',
    desc: '챌린지를 통해 경험정리부터 서류 지원, 면접 준비까지 완성할 수 있어요.',
    buttonCaption: '출시알림신청',
    buttonColor: 'bg-point',
  },
  {
    link: 'https://forms.gle/ddFtGQfBpGk7Jxpq9',
    thumbnail: '/images/home/live-thumbnail.png',
    title: 'LIVE 클래스',
    desc: 'LIVE 클래스를 통해 현직자에게 생생한 실무 이야기를 들으며, 성장해 나갈 수 있어요.',
    buttonCaption: '출시알림신청',
    buttonColor: 'bg-[#BBEDD8]',
  },
  {
    link: 'https://forms.gle/ddFtGQfBpGk7Jxpq9',
    thumbnail: '/images/home/vod-thumbnail.png',
    title: 'VOD 클래스',
    desc: 'VOD 클래스를 통해 부족했던 하드스킬 및 소프트스킬을 모두 업그레이드 할 수 있어요.',
    buttonCaption: '출시알림신청',
    buttonColor: 'bg-[#CACCFC]',
  },
];

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
    }
  }, [isLoading]);

  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => setLoading(false), 700);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  
  

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
      <ul className="w-full bg-neutral-90 grid grid-cols-1 grid-rows-3 gap-4 row overflow-y-scroll">
        {
          loading || isLoading ? (
            <div className='row-span-4 h-[536px] md:col-span-2 md:row-span-2 md:h-[380px] flex items-center justify-center'>
              <LoadingContainer />
            </div>
          ) : !data ? (
            <>
              <div className="flex flex-col items-center justify-center text-1 py-2 text-center text-neutral-0/40">
                혹시, 찾으시는 프로그램이 없으신가요?
                <span className="flex flex-col md:flex-row md:justify-center md:gap-1">
                  <span>출시 알림 신청을 통해 가장 먼저 신규 프로그램 소식을 받아보세요.</span>
                </span>
              </div>
              {
                emptyList.map((emptyItem) => (
                  <EmptyListItemContainer
                    key={emptyItem.title}
                    thumbnail={emptyItem.thumbnail}
                    title={emptyItem.title}
                    desc={emptyItem.desc}
                    link={emptyItem.link}
                    buttonCaption={emptyItem.buttonCaption}
                    buttonColor={emptyItem.buttonColor}
                  />
                ))
              }
            </>
          ) : (
            data.length < 1 ? (
              <>
                <div className="flex flex-col items-center justify-center text-1 py-2 text-center text-neutral-0/40">
                  혹시, 찾으시는 프로그램이 없으신가요?
                  <span className="flex flex-col md:flex-row md:justify-center md:gap-1">
                    <span>출시 알림 신청을 통해 가장 먼저 신규 프로그램 소식을 받아보세요.</span>
                  </span>
                </div>
                {
                  emptyList.map((emptyItem) => (
                    <EmptyListItemContainer
                      key={emptyItem.title}
                      thumbnail={emptyItem.thumbnail}
                      title={emptyItem.title}
                      desc={emptyItem.desc}
                      link={emptyItem.link}
                      buttonCaption={emptyItem.buttonCaption}
                      buttonColor={emptyItem.buttonColor}
                    />
                  ))
                }
              </>
            ) : (
              data.map((program) => (
                <ProgramListItemContainer
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
