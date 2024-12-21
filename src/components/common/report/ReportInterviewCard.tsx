import { reportInterviewType } from '@/data/reportConstant';
import { maskingName } from '../program/program-detail/review/ProgramDetailReviewItem';

interface ReportInterviewCardProps {
  interview: reportInterviewType;
  mainColor: string;
  subColor: string;
}

const ReportInterviewCard = ({
  interview,
  mainColor,
  subColor,
}: ReportInterviewCardProps) => {
  return (
    <div className="flex w-[90%] shrink-0 flex-col gap-y-3 rounded-[10px] bg-white p-5 pb-7 md:w-full">
      <div
        className="flex w-full items-center justify-center rounded-[10px] p-2 text-xsmall16 font-semibold md:text-small18"
        style={{ backgroundColor: mainColor }}
      >
        {interview.title}
      </div>
      <div className="flex w-full grow flex-col gap-y-6 text-xsmall14 md:text-xsmall16">
        <div
          className="flex w-full grow flex-col gap-y-5 rounded-[10px] px-5 py-3"
          style={{ backgroundColor: subColor }}
        >
          <p className="font-semibold">{`Q. ${interview.question}`}</p>
          <div className="flex w-full flex-col gap-y-1">
            <p className="font-bold">{`A. ${interview.answer.title}`}</p>
            <p className="font-medium">{`"${interview.answer.content}"`}</p>
          </div>
        </div>
        <div className="flex w-full items-center gap-x-3">
          <img
            src={interview.user.img}
            alt={maskingName(interview.user.name)}
            className="h-12 w-12 rounded-full object-cover"
          />
          <div className="flex flex-1 flex-col gap-y-1 text-xxsmall12 text-neutral-0 md:text-xsmall14">
            <p>
              <span className="font-semibold">
                {interview.user.reportName}{' '}
              </span>
              서비스 이용
            </p>
            <p>{`${interview.user.job} 직무 ${maskingName(interview.user.name)}`}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportInterviewCard;
