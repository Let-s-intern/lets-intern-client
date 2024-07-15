import { useMediaQuery } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { IProgram } from '../../../../../types/interface';

import { useCallback, useEffect, useState } from 'react';
import axios from '../../../../../utils/axios';
import { REMINDER_LINK } from '../../../../../utils/programConst';
import LoadingContainer from '../../../ui/loading/LoadingContainer';
import EmptyListItemContainer from './EmptyListItemContainer';
import ProgramListItemContainer from './ProgramListItemContainer';

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
    link: REMINDER_LINK,
    thumbnail: '/images/home/challenge-thumbnail.png',
    title: '신규 챌린지',
    desc: '챌린지를 통해 경험정리부터 서류 지원, 면접 준비까지 완성할 수 있어요.',
    buttonCaption: '출시알림신청',
    buttonColor: 'bg-point',
  },
  {
    link: REMINDER_LINK,
    thumbnail: '/images/home/live-thumbnail.png',
    title: 'LIVE 클래스',
    desc: 'LIVE 클래스를 통해 현직자에게 생생한 실무 이야기를 들으며, 성장해 나갈 수 있어요.',
    buttonCaption: '출시알림신청',
    buttonColor: 'bg-[#BBEDD8]',
  },
  {
    link: REMINDER_LINK,
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
          startDate,
          endDate,
        },
      });
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
      const timer = setTimeout(() => setLoading(false), 300);
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
    <div className="mt-6 overflow-hidden bg-neutral-90 p-5 md:mx-5 md:rounded-xs md:p-0">
      <div className="flex items-center">
        {matches && (
          <div className="w-1/4 bg-neutral-80 py-3.5 text-center text-neutral-0/60">
            {`${prevMonth().year}년 ${prevMonth().month}월`}
          </div>
        )}
        <div className="flex w-full items-center justify-center gap-1 bg-primary-10 py-3.5 md:w-2/4">
          <img
            className={`w-5 ${
              current.year === now.year && current.month === now.month
                ? 'cursor-not-allowed opacity-30'
                : 'cursor-pointer'
            }`}
            onClick={() => {
              if (current.year === now.year && current.month === now.month) {
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
              (now.month + 3 > 12 &&
                current.year === now.year + 1 &&
                current.month === now.month - 9)
                ? 'cursor-not-allowed opacity-30'
                : 'cursor-pointer'
            }`}
            onClick={() => {
              if (
                (current.year === now.year &&
                  current.month === now.month + 3) ||
                (now.month + 3 > 12 &&
                  current.year === now.year + 1 &&
                  current.month === now.month - 9)
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
      <ul className="grid w-full grid-cols-1 gap-4 overflow-y-auto md:grid-cols-2">
        {loading || isLoading ? (
          <div className="row-span-4 flex h-[172px] items-center justify-center md:col-span-2">
            <LoadingContainer text="프로그램 조회 중" />
          </div>
        ) : !data ? (
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
        ) : data.length < 1 ? (
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
        ) : (
          data.map((program) => (
            <ProgramListItemContainer
              key={program.programInfo.programType + program.programInfo.id}
              program={program}
            />
          ))
        )}
      </ul>
    </div>
  );
};

export default ProgramOverviewListItem;
