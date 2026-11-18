import { useAdminLiveMentoringDetailPageQuery } from '@/api/live-mentoring/liveMentoringDetailPage';
import ProgramCategoryField from './ProgramCategoryField';

/** 1:1 LIVE 멘토링은 화면이 멘토 id 로 열리므로, 상세페이지 응답의 멘토링 id 로 노출 분류를 붙인다 */
const LiveMentoringCategoryField = ({ mentorId }: { mentorId: number }) => {
  const { data } = useAdminLiveMentoringDetailPageQuery(mentorId);
  const liveMentoringId = data?.mentoring?.liveMentoringId;

  if (!liveMentoringId) return null;
  return (
    <ProgramCategoryField
      targetType="LIVE_MENTORING"
      targetId={liveMentoringId}
    />
  );
};

export default LiveMentoringCategoryField;
