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
  /** 진행기간 표시 문자열. 없으면 라인 생략(가이드북). 탭마다 포맷 다름(챌린지=날짜, 라이브=시각 포함) */
  periodText?: string;
  beginning?: string | null;
  deadline?: string | null;
  programStatusType?: ProgramStatus | null;
  participation: PassParticipation;
  applicationId?: number | null;
  /** 챌린지 대시보드 입장 가능 여부(시작한 챌린지만). 시작 전이면 상세로 보낸다 */
  canEnterDashboard?: boolean;
  /** 올인원패스 혜택으로 구매·참여한 프로그램이면 true */
  isMembershipApplied?: boolean;
  isDownloaded?: boolean;
  contentUrl?: string | null;
  contentFileUrl?: string | null;
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
          'aspect-[540/421] h-auto w-full rounded-sm bg-neutral-80 object-cover md:rounded-xs',
          isDone && 'opacity-80 grayscale',
        )}
        src={item.thumbnail || undefined}
        alt=""
      />

      <div className="flex flex-1 flex-col justify-between gap-2.5">
        <div className="flex flex-col gap-1.5">
          <h3 className="line-clamp-2 text-xsmall14 font-semibold text-neutral-0 md:text-xsmall16">
            {item.title}
          </h3>
        </div>

        <div className="flex flex-col gap-2">
          {item.periodText && (
            <div className="flex items-center gap-1.5 tracking-[-0.4px]">
              <span className="text-xxsmall12 font-normal text-neutral-0">
                진행기간
              </span>
              <span className="text-0.75-medium text-primary-dark">
                {item.periodText}
              </span>
            </div>
          )}

          {pill && (
            <span className="w-fit rounded-[3px] bg-[#F2ECFC] px-2 py-1 text-xxsmall12 font-semibold text-[#8444FF]">
              {pill}
            </span>
          )}
          {item.isMembershipApplied && (
            <span className="w-fit rounded-xxs bg-[#edeffe] px-2 py-1 text-xxsmall12 font-medium text-[#4A76FF]">
              패스 혜택
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default PassProgramCard;
