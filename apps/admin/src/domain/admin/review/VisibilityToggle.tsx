import { usePatchAdminAttendance } from '@/api/attendance/attendance';
import {
  getAdminProgramReviewQueryKey,
  ReviewType,
  useUpdateAdminProgramReview,
} from '@/api/review/review';
import { Row } from '@/domain/admin/pages/review/AdminChallengeReviewListPage';
import { Switch } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';

const VisibilityToggle = ({ type, row }: { type: ReviewType; row: Row }) => {
  const queryClient = useQueryClient();

  const { mutate: updateReview } = useUpdateAdminProgramReview({
    errorCallback: (error) => {
      alert(error);
    },
  });

  const patchAdminAttendance = usePatchAdminAttendance();

  const handleToggle = async () => {
    if (type !== 'MISSION_REVIEW') {
      updateReview({
        type,
        reviewId: row.reviewInfo.reviewId ?? 0,
        isVisible: !row.reviewInfo.isVisible,
      });
    } else {
      await patchAdminAttendance.mutateAsync({
        attendanceId: row.reviewInfo.attendanceId ?? 0,
        reviewIsVisible: !row.reviewInfo.reviewIsVisible,
      });
      // usePatchAdminAttendance 자체는 review 캐시를 invalidate 하지 않으므로
      // 미션 후기 노출여부 토글은 호출처에서 직접 무효화하여 즉시 반영.
      await queryClient.invalidateQueries({
        queryKey: getAdminProgramReviewQueryKey('MISSION_REVIEW'),
      });
    }
  };

  return (
    <Switch
      className="ignore-click"
      checked={
        type !== 'MISSION_REVIEW'
          ? (row.reviewInfo.isVisible ?? false)
          : (row.reviewInfo.reviewIsVisible ?? false)
      }
      onChange={handleToggle}
    />
  );
};

export default VisibilityToggle;
