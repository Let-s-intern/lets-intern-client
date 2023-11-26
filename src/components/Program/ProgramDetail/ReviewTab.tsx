interface ReviewTabProps {
  reviewList: any;
}

const ReviewTab = ({ reviewList }: ReviewTabProps) => {
  return reviewList.length === 0 ? (
    <div className="text-center">리뷰가 없습니다.</div>
  ) : (
    reviewList.map((review: any) => <div>Review</div>)
  );
};

export default ReviewTab;
