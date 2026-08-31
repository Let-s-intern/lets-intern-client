/**
 * 웹 실제 팝업(`apps/web/src/domain/blog/ad/BlogPopup.tsx`)과 같은 모습으로 그린다.
 * 폭 400px, 모서리 16px, 하단 두 버튼까지 같은 값을 쓴다. 다르게 보이면 미리보기가 아니다.
 * 여기 버튼은 모양만이고 아무 동작도 하지 않는다.
 */
const BORDER_RADIUS_PX = 16;

export const BLOG_POPUP_IMAGE_NOTICE =
  '권장 이미지 폭 800px 이상, 세로 비율 자유. 웹에서는 최대 폭 400px(모바일 90vw)로 축소되어 표시됩니다. PNG 또는 JPG.';

/** 업로드 필드 아래에 고정으로 붙는 사이즈 고지 (PRD R7). */
export function BlogPopupImageNotice() {
  return (
    <p className="text-neutral-40 mt-1 text-xs">{BLOG_POPUP_IMAGE_NOTICE}</p>
  );
}

interface BlogPopupPreviewProps {
  imageUrl?: string | null;
}

export default function BlogPopupPreview({ imageUrl }: BlogPopupPreviewProps) {
  return (
    <div className="w-[400px]">
      <div
        className="shadow-02 overflow-hidden bg-white"
        style={{ borderRadius: `${BORDER_RADIUS_PX}px` }}
      >
        <div className="relative">
          {imageUrl ? (
            <img src={imageUrl} alt="" className="h-auto w-full" />
          ) : (
            <div className="bg-neutral-90 text-neutral-40 flex h-60 w-full items-center justify-center text-sm">
              이미지를 업로드하면 여기에 미리보기가 표시됩니다
            </div>
          )}
        </div>

        <div className="text-xsmall14 border-neutral-80 flex items-center border-t">
          <button
            type="button"
            disabled
            className="text-neutral-40 flex-1 py-3.5"
          >
            하루 동안 보지 않기
          </button>
          <button
            type="button"
            disabled
            className="border-neutral-80 text-neutral-0 flex-1 border-l py-3.5 font-semibold"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
