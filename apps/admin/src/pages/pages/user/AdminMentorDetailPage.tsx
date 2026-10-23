import { Button } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

import Heading from '@/domain/admin/ui/heading/Heading';
import MentorDetailEditor from '@/domain/admin/user/mentor-detail/ui/MentorDetailEditor';
import MentorPickStatus from '@/domain/mentor/pick/ui/MentorPickStatus';
import MentorReviewExposureSection from '@/domain/mentor/review-exposure/ui/MentorReviewExposureSection';

export default function AdminMentorDetailPage() {
  const params = useParams<{ mentorId: string }>();
  const navigate = useNavigate();
  const mentorId = Number(params.mentorId || 0);

  return (
    <section className="p-5">
      <div className="mb-4 flex items-center gap-4">
        <Button
          variant="outlined"
          size="small"
          onClick={() => navigate('/mentors')}
        >
          목록으로
        </Button>
        <Heading>멘토 상세 정보</Heading>
      </div>

      <MentorDetailEditor
        mentorId={mentorId}
        headerSlot={<MentorPickStatus mentorId={mentorId} />}
      />

      {/* 표가 넓어 반쪽 칸에서는 후기 내용이 잘린다. 그리드 밖에서 전체 폭을 쓴다 */}
      <div className="mt-8">
        <MentorReviewExposureSection mentorId={mentorId} />
      </div>
    </section>
  );
}
