import { memo } from 'react';

/**
 * 어드민 큐레이션 카드 미리보기 (수정 불가).
 *
 * 사용자 노출 카드(`apps/web` `curationTrailingSlide`)와 동일한 비주얼을
 * 어드민 편집 화면에서 시각적으로만 확인하기 위한 presentational 컴포넌트.
 *
 * - 클릭/이벤트 없음 (`pointer-events-none`)
 * - 보조기술 노출 제외 (`aria-hidden`)
 */
const CurationCardPreview = () => {
  return (
    <div className="flex flex-col" aria-hidden="true">
      <p className="text-xxsmall12 mb-1 text-neutral-50">미리보기 (수정 불가)</p>
      <div className="w-48">
        <div
          className="rounded-sm aspect-[4/3] w-full bg-cover bg-center"
          style={{ backgroundImage: "url('/images/curation-entry-card.png')" }}
        />
        <button
          type="button"
          disabled
          className="text-xsmall14 mt-2 w-full cursor-not-allowed rounded-xs bg-[#FF6F1F] py-2.5 text-white pointer-events-none"
        >
          나에게 맞는 프로그램을 찾자!
        </button>
      </div>
    </div>
  );
};

export default memo(CurationCardPreview);
