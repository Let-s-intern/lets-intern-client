import EmptyContainer from '@/common/container/EmptyContainer';

interface MentorReviewSectionProps {
  reviewList: unknown[];
}

const MentorReviewSection = ({ reviewList }: MentorReviewSectionProps) => {
  return (
    <section
      id="mentor-reviews"
      className="flex w-full scroll-mt-[84px] flex-col gap-6 md:scroll-mt-[115px]"
    >
      <div className="flex items-baseline justify-between">
        <h2 className="text-medium22 text-neutral-0 font-bold">후기</h2>
        <span className="text-xsmall16 text-neutral-45">
          {reviewList.length}개의 후기
        </span>
      </div>

      {/* TODO: reviewList 항목 필드 구조가 확정되면 실제 후기 목록/평점 렌더링 추가 */}
      <EmptyContainer text="등록된 후기가 없습니다." />
    </section>
  );
};

export default MentorReviewSection;
