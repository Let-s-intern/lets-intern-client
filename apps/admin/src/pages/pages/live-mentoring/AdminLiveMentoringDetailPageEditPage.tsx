import { Button } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

import AdminLiveMentoringDetailPageEditor from '@/domain/live-mentoring/detail-page/AdminLiveMentoringDetailPageEditor';

export default function AdminLiveMentoringDetailPageEditPage() {
  const params = useParams<{ mentorId: string }>();
  const navigate = useNavigate();
  const mentorId = Number(params.mentorId);
  const isValidMentorId = Number.isInteger(mentorId) && mentorId > 0;

  return (
    <section className="p-5">
      <Button
        variant="outlined"
        size="small"
        className="mb-4"
        onClick={() => navigate('/live-mentoring')}
      >
        목록으로
      </Button>

      {isValidMentorId ? (
        <AdminLiveMentoringDetailPageEditor
          key={mentorId}
          mentorId={mentorId}
        />
      ) : (
        <p className="text-xsmall14 text-neutral-40 py-16">
          잘못된 멘토 주소입니다.
        </p>
      )}
    </section>
  );
}
