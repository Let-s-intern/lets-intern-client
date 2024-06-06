import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { memo, useState } from 'react';

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

interface ProgramCardProps {
  program: IProgram;
}

const ProgramCard = ({ program }: ProgramCardProps) => {
  const [link, setLink] = useState(
    `/program/${program.programInfo.programType.toLowerCase()}/${
      program.programInfo.id
    }`,
  );

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString().replaceAll(' ', '').slice(0, -1);
  };

  const getVodLink = async () => {
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

  const { isLoading } = useQuery({
    queryKey: ['vod', program.programInfo.id],
    queryFn: getVodLink,
  });

  if (isLoading) return <></>;

  return (
    <Link
      to={link}
      className="min-w-40 flex flex-col overflow-hidden rounded-xs md:gap-4 md:rounded-md md:border md:border-neutral-85 md:p-2.5"
    >
      <img
        className="h-32 bg-neutral-80 object-cover md:h-64 md:rounded-xs"
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
              classification={
                PROGRAM_CLASSIFICATION[
                  item.programClassification as ProgramClassificationKey
                ]
              }
            />
          ))}
        </div>
        <h2 className="text-1-semibold">{program.programInfo.title}</h2>
        <p className="text-0.875 max-h-11 overflow-hidden text-neutral-30">
          {program.programInfo.shortDesc}
        </p>
        {/* VOD 클래스 + 마감된 프로그램은 진행일정, 모집마감 없음 */}
        {program.programInfo.programStatusType !== PROGRAM_STATUS_KEY.POST &&
          program.programInfo.programType !== PROGRAM_TYPE.VOD && (
            <div>
              {/* 모집 중인 프로그램만 모집마감일자 표시 */}
              {program.programInfo.programStatusType ===
                PROGRAM_STATUS_KEY.PROCEEDING && (
                <div className="flex gap-1.5">
                  <span className="text-0.75-medium">모집마감</span>
                  <span className="text-0.75-medium text-primary-dark">
                    ~{formatDate(program.programInfo.deadline!)}
                  </span>
                </div>
              )}
              <div className="flex gap-1.5">
                <span className="text-0.75-medium">진행일정</span>
                <span className="text-0.75-medium text-primary-dark">
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
    </Link>
  );
};
const isEqual = (prevProps: ProgramCardProps, nextProps: ProgramCardProps) =>
  prevProps.program.programInfo.id === nextProps.program.programInfo.id &&
  prevProps.program.programInfo.programType ===
    nextProps.program.programInfo.programType;

export default memo(ProgramCard, isEqual);
