import { useUpdateAdminProgramReview } from '@/api/review';
import { Row } from '@/router-pages/admin/review/AdminChallengeReviewListPage';
import { Switch } from '@mui/material';

const VisibilityToggle = ({ row }: { row: Row }) => {
  const { mutate } = useUpdateAdminProgramReview({
    errorCallback: (error) => {
      alert(error);
    },
  });

  const handleToggle = () => {
    mutate({
      type: 'CHALLENGE_REVIEW',
      reviewId: row.reviewInfo.reviewId,
      isVisible: !row.reviewInfo.isVisible,
    });
  };

  return (
    <Switch
      checked={row.reviewInfo.isVisible ?? false}
      onChange={handleToggle}
    />
  );
};

export default VisibilityToggle;
