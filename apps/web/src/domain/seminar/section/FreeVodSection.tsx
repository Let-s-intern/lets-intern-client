/**
 * S5 무료 참여 안내 섹션 — "누구나 무료로 참여 가능한 라이브 세미나".
 * 검정 배경(바로 아래 S6 차별점 그라데이션 최상단과 이어짐) 위 카피 + 라이브 세미나 슬라이드 예시. 정적 RSC.
 */
// 좌→우 그라데이션 텍스트 (bg-clip-text). 데스크톱 한 줄 / 모바일 두 줄에서 재사용.
const GRADIENT_TEXT =
  'bg-gradient-to-r from-[#7FDDFF] to-[#7395FF] bg-clip-text text-transparent';

const FreeVodSection = () => {
  return (
    <section className="w-full bg-black px-5 py-16 md:py-24">
      <div className="mx-auto flex w-full max-w-[1120px] flex-col items-center gap-12">
        <div className="flex flex-col items-center gap-3 break-keep text-center">
          <p className="text-xsmall14 md:text-xsmall16 text-primary-light font-semibold">
            취업 고민, <br className="md:hidden" />
            렛츠커리어 &amp; 현직자와 함께 해결해요!
          </p>
          <h2 className="text-small20 md:text-xlarge30 font-bold text-neutral-100">
            누구나 무료로 참여 가능한
            <br />
            {/* 데스크톱(한 줄): 전체를 감싼 하나의 연속 그라데이션 */}
            <span className={`${GRADIENT_TEXT} hidden md:inline`}>
              라이브 세미나에서 직무 현직자와 취업 고민 끝!
            </span>
            {/* 모바일(두 줄): 두 문구 각각 독립 그라데이션 ('끝!' 고아 방지 줄바꿈) */}
            <span className={`${GRADIENT_TEXT} md:hidden`}>
              라이브 세미나에서
            </span>
            <br className="md:hidden" />
            <span className={`${GRADIENT_TEXT} md:hidden`}>
              직무 현직자와 취업 고민 끝!
            </span>
          </h2>
        </div>

        <img
          src="/images/seminar/free-live/seminar-preview.webp"
          alt="라이브 세미나 미리보기"
          loading="lazy"
          className="w-full max-w-[820px] rounded-lg"
        />
      </div>
    </section>
  );
};

export default FreeVodSection;
