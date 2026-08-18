interface DetailSaveBarProps {
  /** 서버 `mentoring.editable`. false 면 저장 대신 안내와 보기 링크만 남는다. */
  editable: boolean;
  /** 수정 불가일 때 왼쪽에 띄울 안내. 왜 못 고치는지는 상황마다 다르다. */
  lockedMessage: string;
  /** 공개 상세 페이지 주소. 사용자 정보를 아직 못 받았으면 null. */
  publicDetailHref: string | null;
  isDirty: boolean;
  isSaving: boolean;
  onSave: () => void;
  onRevert: () => void;
}

const barClass =
  'shadow-05 flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3';
// 사이드바(296px)와 우측 미리보기 컬럼(380px + gap-6)을 뺀 콘텐츠 영역 기준 폭.
const wrapClass =
  'fixed bottom-6 left-0 right-0 z-50 px-4 md:px-8 lg:left-[296px] lg:pr-[436px]';

/**
 * 하단 고정 저장 바 (PRD §7).
 *
 * 저장·되돌리기를 화면 아래 한 자리에 고정한다. 탭마다 저장 버튼을 두면 멘토가
 * "이 탭만 저장되는 건가"를 판단해야 하는데, 저장은 항상 상세 페이지 전체다.
 *
 * 편집 진입점(탭 이동·미리보기)은 이 컴포넌트가 관여하지 않는다 — 잠금은 입력
 * 필드를 감싼 `fieldset` 이 하고, 이 바는 상태를 알리는 자리다.
 *
 * 수정 불가 상태에서도 **보기 경로는 남긴다.** 저장을 막는 것과 자기 페이지를 못 보게
 * 하는 것은 다른 일이다.
 */
const DetailSaveBar = ({
  editable,
  lockedMessage,
  publicDetailHref,
  isDirty,
  isSaving,
  onSave,
  onRevert,
}: DetailSaveBarProps) => {
  if (!editable) {
    return (
      <div className={wrapClass}>
        <div className={barClass}>
          <p
            role="status"
            className="min-w-0 text-sm font-medium text-gray-600"
          >
            {lockedMessage}
          </p>
          {publicDetailHref === null ? null : (
            <a
              href={publicDetailHref}
              target="_blank"
              rel="noopener noreferrer"
              className="border-primary text-primary hover:bg-primary shrink-0 whitespace-nowrap rounded-lg border bg-white px-5 py-2.5 text-sm font-semibold transition-colors hover:text-white"
            >
              멘토링 상세 페이지 보기
            </a>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={wrapClass}>
      <div className={barClass}>
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
};

export default DetailSaveBar;
