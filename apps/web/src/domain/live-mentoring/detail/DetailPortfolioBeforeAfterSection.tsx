import DetailSection from './DetailSection';

/**
 * 포트폴리오 Before/After — 모든 멘토 상세에 고정으로 나오는 섹션.
 *
 * 멘토가 세팅하는 「결과 사례」와 생김새는 같지만 내용은 렛츠커리어가 정한 예시라
 * 멘토 설정과 무관하게 항상 보인다. 결과 사례를 세팅했으면 그 바로 아래에 온다.
 */
const DetailPortfolioBeforeAfterSection = () => (
  <DetailSection
    dark
    title="논리적이고 구조적으로 작성하는 방법에 대해 확실하게 알려드립니다"
  >
    <div className="mx-auto grid w-full max-w-[840px] grid-cols-1 gap-x-5 gap-y-3 md:grid-cols-2">
      {/* 좁은 화면에서 [전 카드][전 설명][후 카드][후 설명] 순서가 되도록 order 로 묶는다 */}
      <div className="order-1 self-end overflow-hidden rounded-md">
        <p className="text-neutral-30 text-xsmall14 bg-neutral-75 py-2.5 text-center font-semibold">
          Before
        </p>
        <div className="bg-neutral-85 p-4">
          <img
            src="/images/live-mentoring/portfolio-before.webp"
            alt="구조 없이 나열된 포트폴리오 예시"
            className="w-full rounded-sm bg-white"
          />
        </div>
      </div>

      <div className="order-3 mt-5 self-end overflow-hidden rounded-md md:order-2 md:mt-0">
        <p className="bg-primary text-xsmall14 py-2.5 text-center font-semibold text-white">
          After
        </p>
        <div className="bg-primary-20 p-4">
          <img
            src="/images/live-mentoring/portfolio-after.webp"
            alt="전달 메시지가 분명하게 구조화된 포트폴리오 예시"
            className="w-full rounded-sm bg-white"
          />
        </div>
      </div>

      <p className="text-xsmall14 order-2 text-center text-white/70 md:order-3">
        전혀 구조화 되어 있지 않고, 무엇을 강조하고 싶은지 모르겠는 포트폴리오
      </p>
      <p className="text-xsmall14 order-4 text-center font-medium text-white">
        ✓ 전달하고자 하는 메세지가 확실하고, 논리적/구조적으로 작성되어있는
        포트폴리오
      </p>
    </div>
  </DetailSection>
);

export default DetailPortfolioBeforeAfterSection;
