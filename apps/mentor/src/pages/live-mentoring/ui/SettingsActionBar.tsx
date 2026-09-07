import { FLOATING_BAR_BODY, FLOATING_BAR_WRAP } from '../constants';
import type { LiveMentoringOpenAction } from '../open-settings/useLiveMentoringOpenAction';

interface SettingsActionBarProps {
  /** 왼쪽 안내 문구. 스텝마다 저장 대상이 달라 문구도 호출부가 정한다. */
  status: string;
  /** 미저장 변경이 있으면 안내를 경고색으로 그리고 저장 버튼을 켠다. */
  isDirty: boolean;
  canSave: boolean;
  isSaving: boolean;
  onSave: () => void;
  openAction: LiveMentoringOpenAction;
}

/**
 * 설정 화면 하단 고정 바 — 모든 스텝이 이 하나를 쓴다(LC-3273).
 *
 * 오픈 설정과 상세 페이지 설정이 한 화면이 되면서(LC-3264) 하단 바만 두 벌로 남아 있었다.
 * 오픈 설정에서는 `저장`·`오픈하기`, 상세 스텝에서는 `상세 페이지 보기`·`변경사항 되돌리기`·
 * `변경사항 저장` 이라, 같은 화면인데 스텝을 옮길 때마다 아래 버튼이 통째로 바뀌었다.
 *
 * 지금은 어느 스텝에서도 `저장` 과 오픈 버튼 두 개다. 저장 대상은 스텝이 정하고
 * (오픈 설정은 제목·타입·진행시간, 상세 스텝은 상세 페이지 템플릿), 오픈 버튼은
 * `useLiveMentoringOpenAction` 이 스텝과 무관하게 같은 것을 준다.
 */
const SettingsActionBar = ({
  status,
  isDirty,
  canSave,
  isSaving,
  onSave,
  openAction,
}: SettingsActionBarProps) => (
  <div className={FLOATING_BAR_WRAP}>
    <div className={FLOATING_BAR_BODY}>
      {/*
        `role="status"` 를 주지 않는다. 오픈 종료 배너가 이미 그 역할이라, 한 화면에
        live region 이 둘이 되면 무엇을 읽어야 할지 갈린다. 저장 여부는 저장 버튼의
        활성 상태로도 드러난다.
      */}
      <p
        className={`flex min-w-0 items-center gap-2 text-sm font-medium ${
          isDirty ? 'text-system-error' : 'text-gray-500'
        }`}
      >
        <span className="truncate">{status}</span>
      </p>

      <div className="flex shrink-0 items-center gap-2">
        {/* 저장할 변경사항이 있을 때만 파란색으로 바뀐다 — 눌러야 할 버튼이 색으로 드러난다. */}
        <button
          type="button"
          onClick={onSave}
          disabled={!canSave || isSaving}
          className={
            canSave
              ? 'bg-primary hover:bg-primary-hover rounded-lg px-8 py-2.5 text-sm font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50'
              : 'rounded-lg border border-gray-300 bg-white px-8 py-2.5 text-sm font-medium text-gray-700 transition-colors disabled:cursor-not-allowed disabled:opacity-50'
          }
        >
          {isSaving ? '저장 중...' : '저장'}
        </button>
        <button
          type="button"
          onClick={openAction.onClick}
          disabled={openAction.disabled}
          className={`rounded-lg px-8 py-2.5 text-sm font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
            openAction.tone === 'danger'
              ? 'bg-system-error hover:opacity-90'
              : 'bg-primary hover:bg-primary-hover'
          }`}
        >
          {openAction.label}
        </button>
      </div>
    </div>
  </div>
);

export default SettingsActionBar;
