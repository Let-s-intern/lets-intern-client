import { memo } from 'react';

import Input from '@/common/input/v1/Input';

/**
 * 어드민 큐레이션 카드 미리보기 (수정 불가).
 *
 * 사용자 페이지의 추천 카드와 동일한 시각 스타일(h-32 w-40 + 검은 30% 오버레이 +
 * 흰 텍스트)을 어드민 편집 화면에서 시각적으로만 확인하기 위한
 * presentational 컴포넌트. 어드민의 추천 프로그램 행(`ProgramRecommendItem`)과
 * 동일한 가로 행 구조(좌측 썸네일 + 우측 제목/CTA Input)로 표시한다.
 *
 * - 클릭/이벤트 없음 (`pointer-events-none`)
 * - 보조기술 노출 제외 (`aria-hidden`)
 * - 모든 Input은 `disabled` 상태로 수정 불가
 */
const CurationCardPreview = () => {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xxsmall12 text-neutral-40">미리보기 (수정 불가)</span>
      <div
        className="pointer-events-none flex items-center gap-2 opacity-90"
        aria-hidden="true"
      >
        {/* 좌측 썸네일 */}
        <div
          className="rounded-xs h-32 w-40 flex-none border bg-neutral-60"
          style={{
            backgroundImage: "url('/images/curation-entry-card.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="text-xxsmall12 flex h-full items-center justify-center bg-black bg-opacity-30 p-2">
            <span className="text-white">맞춤 챌린지 탐색 큐레이션</span>
          </div>
        </div>
        {/* 우측 제목 / CTA Input */}
        <div className="flex w-full max-w-xl flex-col gap-2">
          <Input
            label="제목"
            type="text"
            value="맞춤 챌린지 탐색 큐레이션"
            size="small"
            disabled
          />
          <Input
            label="CTA"
            type="text"
            value="나에게 맞는 프로그램을 찾자!"
            size="small"
            disabled
          />
        </div>
      </div>
    </div>
  );
};

export default memo(CurationCardPreview);
