import React from 'react';
import { IProgram } from '../../../../../interfaces/Program.interface';
import ProgramStatusTag from '../../../program/programs/card/ProgramStatusTag';
import { PROGRAM_STATUS } from '../../../../../utils/programConst';
import { useNavigate } from 'react-router-dom';

const ProgramListItemContainer = ({program}:{program:IProgram}) => {
  const navigate = useNavigate();
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString().replaceAll(' ', '').slice(0, -1);
  };
  return (
    <div className='w-full flex items-center justify-center'>
      <div className='w-full bg-neutral-100 flex items-center justify-center p-2.5 rounded-md gap-x-4 border border-neutral-85 cursor-pointer'
        onClick={() => navigate(`/program/${program.programInfo.programType.toLowerCase()}/${program.programInfo.id}`)}
      >
        <img src={program.programInfo.thumbnail} alt='프로그램 썸네일' className='w-[120px] h-[120px] md:w-[179px] md:h-[150px] rounded-md object-cover'/>
        <div className='grow h-[120px] md:h-[150px] flex flex-col items-start py-2 justify-between'>
          <div className='w-full flex flex-col items-start justify-center gap-y-[6px]'>
            <ProgramStatusTag
              status={PROGRAM_STATUS[program.programInfo.programStatusType]}
            />
            <div className='w-full flex flex-col gap-y-[2px] items-start justify-center py-1'>
              <div className='font-semibold'>
                {program.programInfo.title}
              </div>
              <div className='text-sm font-medium text-neutral-30'>
                {program.programInfo.shortDesc}
              </div>
            </div>
          </div>
          <div className='w-full flex items-center justify-start gap-x-1'>
            <div className='text-xs text-neutral-0 font-medium'>진행기간</div>
            <div className='text-xs text-primary-dark font-medium'>
              {
                `${formatDate(program.programInfo.startDate,)} ~ ${formatDate(program.programInfo.endDate!)}`
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramListItemContainer;