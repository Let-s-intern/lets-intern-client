// 나의 패스 이용 탭 공용 프로그램 카드.
'use client';

import dayjs from '@/lib/dayjs';
import { twMerge } from '@/lib/twMerge';
import type { ProgramStatus } from '@/schema';

export type PassParticipation = 'BEFORE' | 'IN_PROGRESS' | 'DONE';

export interface PassProgramCardData {
  programId: number;
  title: string;
  thumbnail?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  beginning?: string | null;
  deadline?: string | null;
  programStatusType?: ProgramStatus | null;
  participation: PassParticipation;
  applicationId?: number | null;
}

const recruitmentPill = (item: PassProgramCardData): string | null => {
  if (item.participation !== 'BEFORE') return null;
  if (item.programStatusType === 'PREV') {
    return item.beginning
      ? `${dayjs(item.beginning).format('MM/DD')}~ 모집 예정`
      : '모집 예정';
  }
  if (item.programStatusType === 'PROCEEDING') {
    return item.deadline
      ? `~${dayjs(item.deadline).format('MM/DD')} 모집 마감`
      : '모집 중';
  }
  return null;
};

interface Props {
  item: PassProgramCardData;
  onClick?: () => void;
}

const PassProgramCard = ({ item, onClick }: Props) => {
  const isDone = item.participation === 'DONE';
  const pill = recruitmentPill(item);

  return (
    <div
      onClick={onClick}
      className="flex h-full cursor-pointer flex-col gap-3"
      data-program-text={item.title}
    >
      <img
        className={twMerge(
          'bg-neutral-80 md:rounded-xs aspect-[540/421] h-auto w-full rounded-sm object-cover',
          isDone && 'opacity-80 grayscale',
        )}
        src={item.thumbnail || undefined}
        alt=""
      />

      <div className="flex flex-1 flex-col justify-between gap-3">
        <h3 className="text-xsmall14 md:text-xsmall16 text-neutral-0 line-clamp-2 font-semibold">
          {item.title}
        </h3>

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1.5 tracking-[-0.4px]">
            <span className="text-xxsmall12 text-neutral-0 font-normal">
              진행기간
            </span>
            <span className="text-0.75-medium text-primary-dark">
              {dayjs(item.startDate).format('YY.MM.DD')} ~{' '}
              {dayjs(item.endDate).format('YY.MM.DD')}
            </span>
          </div>

          {pill && (
            <span className="text-xxsmall12 w-fit rounded-[3px] bg-[#F2ECFC] px-2 py-1 font-semibold text-[#8444FF]">
              {pill}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default PassProgramCard;
