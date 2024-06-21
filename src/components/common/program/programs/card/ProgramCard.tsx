import { Link, useNavigate } from 'react-router-dom';
import { memo, useEffect, useState } from 'react';

import {
  IProgram,
  ProgramClassificationKey,
} from '../../../../../interfaces/interface';
import ProgramStatusTag from './ProgramStatusTag';
import {
  PROGRAM_TYPE,
  PROGRAM_STATUS,
  PROGRAM_CLASSIFICATION,
  PROGRAM_STATUS_KEY,
} from '../../../../../utils/programConst';
import ProgramClassificationTag from './ProgramClassificationTag';
import axios from '../../../../../utils/axios';
import clsx from 'clsx';

interface ProgramCardProps {
  program: IProgram;
}

const ProgramCard = ({ program }: ProgramCardProps) => {
  const navigate = useNavigate();
  const [link, setLink] = useState(
    `/program/${program.programInfo.programType.toLowerCase()}/${
      program.programInfo.id
    }`,
  );

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString().replaceAll(' ', '').slice(0, -1);
  };

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
      console.error(error);
    }
  };

  useEffect(() => {
    (async () => await getVodLink())();
  }, []);

  return (
    <div
      onClick={() => {
        program.programInfo.programType === PROGRAM_TYPE.VOD ? window.open(link) : navigate(link);
      }}
      className="flex w-full flex-col overflow-hidden rounded-xs md:gap-4 md:rounded-md md:border md:border-neutral-85 md:p-2.5"
    >
      <img
        className="h-32 w-full bg-neutral-80 object-cover md:h-44 md:rounded-xs"
        src={program.programInfo.thumbnail}
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
            'text-1-semibold max-h-[52px]',
          )}
        >
          {program.programInfo.title}
        </h2>
        <p
          className={`text-0.875 max-h-11 overflow-hidden ${
            program.programInfo.programStatusType === PROGRAM_STATUS_KEY.POST
              ? 'text-neutral-50'
              : 'text-neutral-30'
          }`}
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
                  {formatDate(program.programInfo.beginning!)}~
                  {formatDate(program.programInfo.deadline!)}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-0.75-medium w-fit text-[0.69rem]">
                  진행일정
                </span>
                <span className="text-0.75-medium text-[0.69rem] text-primary-dark">
                  {program.programInfo.programType === PROGRAM_TYPE.CHALLENGE
                    ? `${formatDate(
                        program.programInfo.startDate,
                      )}~${formatDate(program.programInfo.endDate!)}`
                    : formatDate(program.programInfo.startDate)}
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
//export default ProgramCard;
