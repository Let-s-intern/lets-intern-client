import dayjs from '@/lib/dayjs';
import { ProgramInfo } from '@/schema';
import { ProgramClassificationKey } from '@/types/interface';
import axios from '@/utils/axios';
import {
  PROGRAM_CLASSIFICATION,
  PROGRAM_STATUS,
  PROGRAM_STATUS_KEY,
  PROGRAM_TYPE,
} from '@/utils/programConst';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { memo, useEffect, useState } from 'react';
import ProgramClassificationTag from './ProgramClassificationTag';
import ProgramStatusTag from './ProgramStatusTag';

interface ProgramCardProps {
  program: ProgramInfo;
}

const ProgramCard = ({ program }: ProgramCardProps) => {
  const router = useRouter();
  const [link, setLink] = useState(
    `/program/${program.programInfo.programType.toLowerCase()}/${
      program.programInfo.id
    }`,
  );

  useEffect(() => {
    const getVodLink = async () => {
      if (program.programInfo.programType !== PROGRAM_TYPE.VOD) return;
      // VOD 상세 조회
      try {
        const res = await axios.get(`/vod/${program.programInfo.id}`);
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
  }, [program.programInfo.programType, program.programInfo.id]);

  return (
    <div
      onClick={() => {
        if (program.programInfo.programType === PROGRAM_TYPE.VOD) {
          window.open(link);
        } else {
          router.push(link);
        }
      }}
      className="program_card flex w-full cursor-pointer flex-col overflow-hidden rounded-xs md:gap-4 md:rounded-md md:border md:border-neutral-85 md:p-2.5"
      data-program-text={program.programInfo.title}
    >
      <img
        className="aspect-[540/421] h-auto w-full bg-neutral-80 object-cover md:rounded-xs"
        src={program.programInfo.thumbnail || undefined}
        alt="프로그램 썸네일 배경"
      />
      <div className="flex flex-col gap-2 py-2">
        <div className="flex flex-wrap gap-2">
          <ProgramStatusTag
            status={PROGRAM_STATUS[program.programInfo.programStatusType]}
          />
          {program.classificationList.map((item) => (
            <ProgramClassificationTag
              key={item.programClassification}
              classification={
                PROGRAM_CLASSIFICATION[
                  item.programClassification as ProgramClassificationKey
                ]
              }
            />
          ))}
        </div>
        <h2
          className={clsx(
            {
              'text-neutral-40':
                program.programInfo.programStatusType ===
                PROGRAM_STATUS_KEY.POST,
            },
            'text-1-semibold',
          )}
        >
          {program.programInfo.title}
        </h2>
        <p
          className={clsx(
            program.programInfo.programStatusType === PROGRAM_STATUS_KEY.POST
              ? 'text-neutral-50'
              : 'text-neutral-30',
            'text-0.875 max-h-11 overflow-hidden',
          )}
        >
          {program.programInfo.shortDesc}
        </p>
        {/* VOD 클래스 & 마감된 프로그램 - 진행기간, 모집기간 없음 */}
        {program.programInfo.programStatusType !== PROGRAM_STATUS_KEY.POST &&
          program.programInfo.programType !== PROGRAM_TYPE.VOD && (
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-0.75-medium text-[0.69rem]">
                  모집기간
                </span>
                <span className="text-0.75-medium text-[0.69rem] text-primary-dark">
                  {dayjs(program.programInfo.beginning).format('YY.MM.DD')} ~{' '}
                  {dayjs(program.programInfo.deadline).format('YY.MM.DD')}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-0.75-medium w-fit text-[0.69rem]">
                  진행일정
                </span>
                <span className="text-0.75-medium text-[0.69rem] text-primary-dark">
                  {program.programInfo.programType === PROGRAM_TYPE.CHALLENGE
                    ? `${dayjs(program.programInfo.startDate).format(
                        'YY.MM.DD',
                      )} ~ ${dayjs(program.programInfo.endDate).format(
                        'YY.MM.DD',
                      )}`
                    : dayjs(program.programInfo.startDate).format('YY.MM.DD')}
                </span>
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

// 프로그램 ID와 프로그램 타입이 같으면 true
const isEqual = (prevProps: ProgramCardProps, nextProps: ProgramCardProps) =>
  prevProps.program.programInfo.id === nextProps.program.programInfo.id &&
  prevProps.program.programInfo.programType ===
    nextProps.program.programInfo.programType;

export default memo(ProgramCard, isEqual);
