interface DetailSaveBarProps {
  isDirty: boolean;
  isSaving: boolean;
  onSave: () => void;
  onRevert: () => void;
}

/**
 * 하단 고정 저장 바 (PRD §7).
 *
 * 저장·되돌리기를 화면 아래 한 자리에 고정한다. 탭마다 저장 버튼을 두면 멘토가
 * "이 탭만 저장되는 건가"를 판단해야 하는데, 저장은 항상 상세 페이지 전체다.
 *
 * 편집 진입점(탭 이동·미리보기)은 이 컴포넌트가 관여하지 않는다 — 잠금은 입력
 * 필드를 감싼 `fieldset` 이 하고, 이 바는 상태를 알리는 자리다.
 */
const DetailSaveBar = ({
  isDirty,
  isSaving,
  onSave,
  onRevert,
}: DetailSaveBarProps) => (
  // 사이드바(296px)와 우측 미리보기 컬럼(380px + gap-6)을 뺀 콘텐츠 영역 기준 폭.
  <div className="fixed bottom-6 left-0 right-0 z-50 px-4 md:px-8 lg:left-[296px] lg:pr-[436px]">
    <div className="shadow-05 flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3">
      <p
        role="status"
        className={`min-w-0 truncate text-sm font-medium ${
          isDirty ? 'text-system-error' : 'text-gray-500'
        }`}
      >
        {isDirty ? '저장하지 않은 변경사항이 있어요.' : '저장된 상태예요.'}
      </p>

      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={onRevert}
          disabled={!isDirty || isSaving}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors disabled:cursor-not-allowed disabled:opacity-40"
        >
          변경사항 되돌리기
        </button>
        <button
          type="button"
          onClick={onSave}
          disabled={!isDirty || isSaving}
          className="bg-primary hover:bg-primary-hover rounded-lg px-6 py-2.5 text-sm font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          {isSaving ? '저장 중...' : '변경사항 저장'}
        </button>
      </div>
    </div>
  </div>
);

export default DetailSaveBar;
