import axios from '@/utils/axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IProgram } from '../../../../../types/Program.interface';
import {
  PROGRAM_STATUS,
  PROGRAM_TYPE,
} from '../../../../../utils/programConst';
import ProgramStatusTag from '../../../program/programs/card/ProgramStatusTag';

const ProgramListItemContainer = ({ program }: { program: IProgram }) => {
  const navigate = useNavigate();
  const [link, setLink] = useState(
    `/program/${program.programInfo.programType.toLowerCase()}/${
      program.programInfo.id
    }`,
  );

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

  useEffect(() => {
    (async () => await getVodLink())();
  }, []);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString().replaceAll(' ', '').slice(0, -1);
  };
  return (
    <div className="flex items-center justify-center w-full">
      <div
        className="calendar_program flex w-full cursor-pointer items-center justify-center gap-x-4 rounded-md border border-neutral-85 bg-neutral-100 p-2.5"
        onClick={() => {
          if (program.programInfo.programType === PROGRAM_TYPE.VOD) {
            window.open(link);
          } else {
            window.location.href = link;
          }
        }}
        data-program-text={program.programInfo.title}
      >
        <img
          src={program.programInfo.thumbnail}
          alt="프로그램 썸네일"
          className="h-[120px] w-[120px] rounded-md object-cover md:h-[150px] md:w-[179px]"
        />
        <div className="flex h-[120px] grow flex-col items-start justify-between py-2 md:h-[150px]">
          <div className="flex w-full flex-col items-start justify-center gap-y-[6px]">
            <ProgramStatusTag
              status={PROGRAM_STATUS[program.programInfo.programStatusType]}
            />
            <div className="flex w-full flex-col items-start justify-center gap-y-[2px] py-1">
              <div className="font-semibold line-clamp-1">
                {program.programInfo.title}
              </div>
              <div className="text-sm font-medium line-clamp-1 text-neutral-30">
                {program.programInfo.shortDesc}
              </div>
            </div>
          </div>
          <div
            className={`flex w-full items-center justify-start gap-x-1 ${program.programInfo.programType === 'VOD' ? 'hidden' : ''}`}
          >
            <div className="text-xs font-medium text-neutral-0">진행기간</div>
            <div className="text-xs font-medium text-primary-dark">
              {`${formatDate(program.programInfo.startDate)} ~ ${formatDate(
                program.programInfo.endDate!,
              )}`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramListItemContainer;
