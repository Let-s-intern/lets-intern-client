import { PAST_SEMINAR_MENTORS } from '../data/pastSeminars';
import PastSeminarCard from '../ui/PastSeminarCard';

/**
 * S8 지난 세미나 멘토 하이라이트 — 멘토 4인 큐레이션(멘토별 통이미지).
 * 모바일·데스크톱 모두 세로 스택. 모바일은 세로형 카드, 데스크톱은 가로형 카드. 정적 RSC.
 */
const PastSeminarShowcaseSection = () => {
  return (
    <section className="w-full bg-[#EFEFEF] px-5 py-16 md:py-24">
      <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-10">
        <div className="flex flex-col items-center gap-3 text-center">
          <p className="text-xsmall14 md:text-xsmall16 text-neutral-45 font-semibold">
            지난 인기 세미나
          </p>
          <h2 className="text-small20 md:text-large26 text-neutral-0 font-bold">
            지난 인기 무료 세미나 둘러보기
          </h2>
        </div>

        <div className="flex flex-col gap-6 md:gap-10">
          {PAST_SEMINAR_MENTORS.map((mentor) => (
            <PastSeminarCard key={mentor.id} mentor={mentor} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PastSeminarShowcaseSection;
