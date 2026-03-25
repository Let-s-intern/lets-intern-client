import dayjs from '@/lib/dayjs';
import { ProgramInfo } from '@/schema';
import axios from '@/utils/axios';
import {
  PROGRAM_BADGE_STATUS,
  PROGRAM_STATUS_KEY,
  PROGRAM_TYPE,
} from '@/utils/programConst';
import { useRouter } from 'next/navigation';
import { memo, useEffect, useState } from 'react';
import DeadlineBadge from './DeadlineBadge';
import NewBadge from './NewBadge';
import ProgramStatusTag from './ProgramStatusTag';

interface ProgramCardProps {
  program: ProgramInfo;
}

const ALWAYS_AVAILABLE_LABEL = '상시 판매';

const ProgramCard = ({ program }: ProgramCardProps) => {
  const router = useRouter();
  const { programInfo } = program;
  const isPost = programInfo.programStatusType === PROGRAM_STATUS_KEY.POST;
  const isAlwaysAvailable =
    programInfo.programType === PROGRAM_TYPE.VOD ||
    programInfo.programType === PROGRAM_TYPE.GUIDEBOOK;

  const [link, setLink] = useState(
    `/program/${programInfo.programType.toLowerCase()}/${programInfo.id}`,
  );

  useEffect(() => {
    const getVodLink = async () => {
      if (programInfo.programType !== PROGRAM_TYPE.VOD) return;
      try {
        const res = await axios.get(`/vod/${programInfo.id}`);
        if (res.status === 200) {
          setLink(res.data.data.vodInfo.link);
          return res.data.data;
        }
        throw new Error(`${res.status} ${res.statusText}`);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    };

    (async () => await getVodLink())();
  }, [programInfo.programType, programInfo.id]);

  return (
    <div
      onClick={() => {
        if (programInfo.programType === PROGRAM_TYPE.VOD) {
          window.open(link);
        } else {
          router.push(link);
        }
      }}
      className="program_card flex w-full cursor-pointer flex-col gap-3 overflow-hidden"
      data-program-text={programInfo.title}
    >
      {/* 썸네일 + 모집 종료 dim */}
      <div className="relative">
        <img
          className="aspect-[540/421] h-auto w-full rounded-sm bg-neutral-80 object-cover md:rounded-xs"
          src={programInfo.thumbnail || undefined}
          alt="프로그램 썸네일 배경"
        />
        {isPost && (
          <div className="absolute inset-0 rounded-sm bg-neutral-0/40 md:rounded-xs" />
        )}
        {!isPost && !isAlwaysAvailable && (
          <DeadlineBadge deadline={programInfo.deadline ?? undefined} />
        )}
      </div>
      <div className="flex flex-col gap-3">
        <h2 className="text-1-semibold text-xsmall14 md:text-xsmall16">
          {programInfo.title}
        </h2>
        <div className="flex flex-col gap-4">
          {!isAlwaysAvailable && (
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1 tracking-[-0.4px] md:gap-1.5">
                <span className="text-xxsmall12 font-normal text-neutral-0">
                  모집기간
                </span>
                <span className="text-0.75-medium text-primary-dark">
                  {dayjs(programInfo.beginning).format('YY.MM.DD')} ~{' '}
                  {dayjs(programInfo.deadline).format('YY.MM.DD')}
                </span>
              </div>
              <div className="flex items-center gap-1 tracking-[-0.4px] md:gap-1.5">
                <span className="text-xxsmall12 font-normal text-neutral-0">
                  진행기간
                </span>
                <span className="text-0.75-medium text-primary-dark">
                  {programInfo.programType === PROGRAM_TYPE.CHALLENGE
                    ? `${dayjs(programInfo.startDate).format('YY.MM.DD')} ~ ${dayjs(programInfo.endDate).format('YY.MM.DD')}`
                    : dayjs(programInfo.startDate).format('YY.MM.DD')}
                </span>
              </div>
            </div>
          )}

          <div className="mt-1 flex flex-wrap gap-1.5">
            {isAlwaysAvailable ? (
              <ProgramStatusTag status={ALWAYS_AVAILABLE_LABEL} />
            ) : (
              <ProgramStatusTag
                status={PROGRAM_BADGE_STATUS[programInfo.programStatusType]}
              />
            )}
            {!isPost && (
              <NewBadge beginning={programInfo.beginning ?? undefined} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const isEqual = (prevProps: ProgramCardProps, nextProps: ProgramCardProps) =>
  prevProps.program.programInfo.id === nextProps.program.programInfo.id &&
  prevProps.program.programInfo.programType ===
    nextProps.program.programInfo.programType;

export default memo(ProgramCard, isEqual);
