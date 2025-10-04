import { usePatchAdminAttendance } from '@/api/attendance';
import { ReviewType, useUpdateAdminProgramReview } from '@/api/review';
import { Row } from '@/components/admin/pages/review/AdminChallengeReviewListPage';
import { Switch } from '@mui/material';

const VisibilityToggle = ({ type, row }: { type: ReviewType; row: Row }) => {
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
