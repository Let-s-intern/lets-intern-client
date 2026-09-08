import { FLOATING_BAR_BODY, FLOATING_BAR_WRAP } from '../constants';

interface SaveFloatingButtonProps {
  /**
   * 지금 보내면 서버가 거절할 이유(`describeAutosaveBlock`). 있으면 버튼을 잠그고
   * 그 이유를 위에 남긴다 — 눌러서 400 을 받아 보고 알게 하면 무엇을 고쳐야 하는지
   * 화면에 남지 않는다.
   */
  blockedReason: string | null;
  /** 저장 요청이 나가는 중인지. */
  isSaving: boolean;
  /** 마지막 저장이 실패한 이유. 성공했거나 시도 전이면 null. */
  errorMessage: string | null;
  onSave: () => void;
}

/**
 * 변경이 있을 때만 뜨는 저장 버튼.
 *
 * 예전에는 입력이 멎으면 알아서 저장했다(LC-3282). 그때 없앤 저장 버튼을 되살린다 —
 * 멘토가 "지금 저장된 건가"를 문구로만 짐작해야 했고, 상세 스텝은 필수 항목이 반쯤
 * 찬 순간이 길어 저장이 계속 막히는데 그 사실이 버튼 없이 문구로만 흘렀다.
 *
 * 스텝 이동 바(`SettingsActionBar`)와 **같은 자리를 나눠 쓴다.** 변경이 있으면 이 버튼이,
 * 없으면 스텝 이동이 온다. 언제 어느 쪽을 그릴지는 페이지가 정한다.
 */
const SaveFloatingButton = ({
  blockedReason,
  isSaving,
  errorMessage,
  onSave,
}: SaveFloatingButtonProps) => {
  const message = blockedReason ?? errorMessage;

  return (
    <div className={FLOATING_BAR_WRAP}>
      <div className={FLOATING_BAR_BODY}>
        {message && (
          <p className="text-system-error truncate text-sm font-medium">
            {message}
          </p>
        )}

        <button
          type="button"
          onClick={onSave}
          disabled={Boolean(blockedReason) || isSaving}
          className="bg-primary hover:bg-primary-hover w-full rounded-lg px-10 py-3.5 text-base font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSaving ? '저장 중…' : '저장하기'}
        </button>
      </div>
    </div>
  );
};

export default SaveFloatingButton;
