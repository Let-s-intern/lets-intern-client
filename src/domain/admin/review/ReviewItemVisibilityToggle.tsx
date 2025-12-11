import { ReviewType, useUpdateAdminProgramReviewItem } from '@/api/review';
import { Row } from '@/domain/admin/pages/review/AdminChallengeReviewListPage';
import { Switch } from '@mui/material';

const ReviewItemVisibilityToggle = ({
  type,
  row,
  questionType,
}: {
  type: ReviewType;
  row: Row;
  questionType: string;
}) => {
  const { mutate } = useUpdateAdminProgramReviewItem({
    errorCallback: (error) => {
      alert(error);
    },
  });

  const reviewItem = row.reviewItemList?.find(
    (item) => item.questionType === questionType,
  );
  if (!reviewItem) return '-';

  const handleToggle = () => {
    mutate({
      type,
      reviewItemId: reviewItem.reviewItemId,
      isVisible: !reviewItem.isVisible,
    });
  };

  return (
    <Switch
      className="ignore-click"
      checked={reviewItem.isVisible ?? false}
      onChange={handleToggle}
      disabled={!row.reviewInfo.isVisible} // 부모 리뷰가 노출될 때만 토글 활성화
    />
  );
};

export default ReviewItemVisibilityToggle;
