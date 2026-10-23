import { Navigate, useParams } from 'react-router-dom';

/**
 * 예전 주소 `/live-mentoring/:mentorId/detail-page`.
 * 상세페이지 수정은 1:1 화면의 「상세페이지」 탭으로 옮겼다. 북마크가 깨지지 않게 그 탭으로 보낸다.
 */
export default function AdminLiveMentoringDetailPageEditPage() {
  const { mentorId } = useParams<{ mentorId: string }>();
  const params = new URLSearchParams({ tab: 'detailPage' });
  if (mentorId) params.set('mentorId', mentorId);
  return <Navigate to={`/live-mentoring?${params.toString()}`} replace />;
}
