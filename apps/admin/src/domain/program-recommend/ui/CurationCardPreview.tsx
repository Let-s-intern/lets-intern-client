import { memo } from 'react';

/**
 * 어드민 큐레이션 카드 미리보기 (수정 불가).
 *
 * 사용자 페이지의 추천 카드와 동일한 시각 스타일(h-32 w-40 + 검은 30% 오버레이 +
 * 흰 텍스트)을 어드민 편집 화면에서 시각적으로만 확인하기 위한
 * presentational 컴포넌트.
 *
 * - 클릭/이벤트 없음 (`pointer-events-none`)
 * - 보조기술 노출 제외 (`aria-hidden`)
 */
const CurationCardPreview = () => {
  return (
    <div
      className="pointer-events-none flex flex-col"
      aria-hidden="true"
    >
      <p className="text-xxsmall12 mb-1 text-neutral-40">
        미리보기 (수정 불가)
      </p>
      <div
        className="rounded-xs h-32 w-40 overflow-hidden border bg-neutral-60"
        style={{
          backgroundImage: "url('/images/curation-entry-card.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="flex h-full items-center justify-center bg-black bg-opacity-30 p-2">
          <span className="text-xxsmall12 text-center text-white">
            맞춤 챌린지 탐색 큐레이션
          </span>
        </div>
      </div>
    </div>
  );
};

export default memo(CurationCardPreview);
