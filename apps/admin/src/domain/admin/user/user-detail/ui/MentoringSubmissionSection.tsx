import type { UserLiveMentoringSubmission } from '@/schema';
import MentoringSubmissionCard from './MentoringSubmissionCard';

interface Props {
  list?: UserLiveMentoringSubmission[] | null;
}

/** 멘토링 제출 탭. 서버 배포 전 응답에는 목록이 없어 빈 목록과 같이 다룬다. */
const MentoringSubmissionSection = ({ list }: Props) => {
  if (!list || list.length === 0) {
    return <div>1:1 멘토링 제출 내역이 없습니다.</div>;
  }

  return (
    <ul className="flex flex-col gap-y-3">
      {list.map((submission) => (
        <li
          key={submission.applicationId}
          className="rounded-xs border border-[#E4E4E7] p-4"
        >
          <h3 className="mb-3 font-semibold">
            {submission.productNameSnapshot ?? '1:1 멘토링'}
          </h3>
          <MentoringSubmissionCard submission={submission} />
        </li>
      ))}
    </ul>
  );
};

export default MentoringSubmissionSection;
