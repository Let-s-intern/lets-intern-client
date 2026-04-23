import dayjs from '@/lib/dayjs';
import { ProgramType } from '../../../../types/common';
import { ProgramDate } from '../section/ApplySection';

interface DateToggleProps {
  programDate: ProgramDate;
  programType: ProgramType;
}

const Row = ({
  title,
  value,
}: {
  title: React.ReactNode;
  value: React.ReactNode;
}) => (
  <div className="flex items-center justify-between px-1.5 py-2">
    <span className="text-neutral-0 text-opacity-[74%]">{title}</span>
    <span className="text-right font-medium text-neutral-0 text-opacity-[94%]">
      {value}
    </span>
  </div>
);

const DateToggle = ({ programDate, programType }: DateToggleProps) => {
  return (
    <div className="rounded-sm bg-neutral-100">
      <div className="flex items-center justify-center gap-0.5 rounded-sm bg-neutral-0 bg-opacity-5 px-1.5 py-4 text-xsmall14 font-semibold text-neutral-0 text-opacity-[74%]">
        프로그램 일정
      </div>
      <div className="px-2">
        <Row
          title="모집 마감"
          value={dayjs(programDate.deadline).format('MM.DD (ddd) HH:mm')}
        />
        {programType === 'challenge' && (
          <Row
            title="OT 일시"
            value={dayjs(programDate.startDate).format('MM.DD (ddd) HH:mm')}
          />
        )}
        <Row
          title="진행 기간"
          value={
            programType === 'live' ? (
              <>
                {dayjs(programDate.startDate).format('MM.DD (ddd) HH:mm')}
                <br /> ~{' '}
                {dayjs(programDate.endDate).format('MM.DD (ddd) HH:mm')}
              </>
            ) : (
              dayjs(programDate.startDate).format(`MM.DD (ddd)`) +
              ' ~ ' +
              dayjs(programDate.endDate).format(`MM.DD (ddd)`)
            )
          }
        />
      </div>
    </div>
  );
};

export default DateToggle;
