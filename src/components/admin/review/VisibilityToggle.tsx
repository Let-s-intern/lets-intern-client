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
      reviewId: row.reviewInfo.reviewId,
      isVisible: !row.reviewInfo.isVisible,
    });
  };

  return (
    <Switch
      className="ignore-click"
      checked={row.reviewInfo.isVisible ?? false}
      onChange={handleToggle}
    />
  );
};

export default VisibilityToggle;
