import { ReportReviewItem } from '@/types/interface';
import { maskingName } from '../program/program-detail/review/ProgramDetailReviewItem';

interface ReportInterviewCardProps {
  interview: ReportReviewItem;
  mainColor: string;
  subColor: string;
}

const ReportInterviewCard = ({
  interview,
  mainColor,
  subColor,
}: ReportInterviewCardProps) => {
  return (
    <div className="text-neutral-0 flex min-h-[344px] w-[90%] shrink-0 flex-col gap-y-3 rounded-[10px] bg-white p-4 pb-7 md:min-h-[386px] md:w-full">
      <div
        className="text-xsmall16 md:text-small18 flex w-full items-center justify-center rounded-[10px] p-2 font-semibold"
        style={{ backgroundColor: mainColor }}
      >
        {interview.title}
      </div>
      <div className="text-xsmall14 md:text-xsmall16 flex w-full flex-1 grow flex-col gap-y-6">
        <div
          className="flex w-full grow flex-col gap-y-5 rounded-[10px] px-5 py-3"
          style={{ backgroundColor: subColor }}
        >
          <p className="text-neutral-30 font-semibold">{`Q. ${interview.question}`}</p>
          <div className="flex w-full flex-1 flex-col gap-y-1 text-wrap">
            <p className="font-bold">{`A. ${interview.answer}`}</p>
            <p className="w-full flex-1 text-wrap font-medium">{`"${interview.detail}"`}</p>
          </div>
        </div>
        <div className="flex w-full items-center gap-x-3">
          <img
            src={
              interview.profile ?? '/images/program/program_default_profile.png'
            }
            alt={maskingName(interview.name)}
            className="h-12 w-12 rounded-full object-cover"
          />
          <div className="text-xxsmall12 text-neutral-0 md:text-xsmall14 flex flex-1 flex-col gap-y-1">
            <p>
              <span className="font-semibold">{interview.reportName} </span>
              서비스 이용
            </p>
            <p>{`${interview.job} 직무 ${maskingName(interview.name)}`}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportInterviewCard;
