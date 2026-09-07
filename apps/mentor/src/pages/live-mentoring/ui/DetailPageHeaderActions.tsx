import type { LiveMentoringOpenAction } from '../open-settings/useLiveMentoringOpenAction';

interface DetailPageHeaderActionsProps {
  openAction: LiveMentoringOpenAction;
  /** 공개 상세 주소. 아직 사용자 정보를 못 받았으면 null 이라 바로가기를 잠근다. */
  publicUrl: string | null;
  /** 공개로 켤 수 없는 이유. null 이면 켤 수 있다. */
  blockedReason: string | null;
}

/**
 * 설정 화면 머리의 오른쪽 — 상세 페이지 바로가기와 공개/비공개 토글 (LC-3283).
 *
 * 오픈은 원래 하단 바의 버튼이었다. 하단 바가 스텝 이동(이전/다음)으로 바뀌면서
 * (LC-3282) 갈 곳이 필요했고, "지금 공개 중인가"는 스텝과 무관한 **화면 전체의 상태**라
 * 머리에 두는 편이 맞다. 어느 스텝에 있든 같은 자리에서 보이고 켜고 끌 수 있다.
 *
 * 바로가기는 `<a>` 가 아니라 버튼이다. 이 화면은 미저장 이탈을 막으려고 앱 내부
 * 링크 클릭을 캡처 단계에서 가로채는데, `VITE_WEB_URL` 이 비면 공개 주소가 같은
 * 오리진이 되어 그 가로채기에 걸린다.
 */
const DetailPageHeaderActions = ({
  openAction,
  publicUrl,
  blockedReason,
}: DetailPageHeaderActionsProps) => {
  const isPublic = openAction.currentOpening !== undefined;
  const canToggle = !openAction.disabled;

  return (
    <div className="flex flex-col items-start gap-1.5 md:items-end">
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={publicUrl === null}
          onClick={() =>
            publicUrl && window.open(publicUrl, '_blank', 'noopener')
          }
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          상세 페이지 바로가기
        </button>

        <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2">
          <span
            className={`text-sm font-medium ${
              isPublic ? 'text-primary' : 'text-gray-500'
            }`}
          >
            {isPublic ? '공개' : '비공개'}
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={isPublic}
            aria-label="상세 페이지 공개"
            disabled={!canToggle}
            onClick={openAction.onClick}
            className={`relative h-6 w-11 shrink-0 rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
              isPublic ? 'bg-primary' : 'bg-neutral-70'
            }`}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${
                isPublic ? 'left-[1.375rem]' : 'left-0.5'
              }`}
            />
          </button>
        </div>
      </div>

      {/*
        토글이 무엇을 바꾸는지 **멘토가 겪는 일**로 적는다. "목록에 노출된다" 는 화면
        용어라 그게 좋은 건지 나쁜 건지 판단이 안 선다. 멘토에게 이 토글은 "지금부터
        멘토링을 파는가" 하나다.
      */}
      <p className="text-xs text-gray-500">
        {blockedReason ??
          (isPublic
            ? '멘토링을 판매 중이에요. 멘티가 신청할 수 있어요.'
            : '공개하면 멘토링 판매가 시작돼요.')}
      </p>
    </div>
  );
};

export default DetailPageHeaderActions;
