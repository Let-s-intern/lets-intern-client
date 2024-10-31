import { ProgramBlogReview } from '@/types/interface';

/**
 * TODO: 파일 어디론가 옮기기.
 */
const ProgramDetailBlogReviewSection = ({
  review,
}: {
  review: ProgramBlogReview;
}) => {
  return (
    <div>
      <h2>프로그램 후기</h2>
      <div>
        {review.list.map((item) => (
          <div key={item.id}>
            <img src={item.thumbnail} alt={item.title} />
            <h3>{item.title}</h3>
            <p>{item.category}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgramDetailBlogReviewSection;
