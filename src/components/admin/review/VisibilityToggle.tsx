import { ReviewType, useUpdateAdminProgramReview } from '@/api/review';
import { Row } from '@/router-pages/admin/review/AdminChallengeReviewListPage';
import { Switch } from '@mui/material';

const VisibilityToggle = ({ type, row }: { type: ReviewType; row: Row }) => {
  const { mutate } = useUpdateAdminProgramReview({
    errorCallback: (error) => {
      alert(error);
    },
  });

  const handleToggle = () => {
    mutate({
      type,
      reviewId:
        type !== 'MISSION_REVIEW'
          ? (row.reviewInfo.reviewId ?? 0)
          : (row.reviewInfo.attendanceId ?? 0),
      isVisible:
        type !== 'MISSION_REVIEW'
          ? !row.reviewInfo.isVisible
          : !row.reviewInfo.reviewIsVisible,
    });
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
