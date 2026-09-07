import { FLOATING_BAR_BODY, FLOATING_BAR_WRAP } from '../constants';
import {
  autosaveMessage,
  isAutosaveAttention,
  type AutosaveStatus,
} from '../useAutosave';

interface SettingsActionBarProps {
  /** 지금 스텝의 실시간 저장 상태. 저장 대상이 스텝마다 달라 호출부가 넘긴다. */
  status: AutosaveStatus;
  onPrev: () => void;
  onNext: () => void;
  /** 앞으로 갈 스텝이 있는지. 없으면 버튼을 잠근다. */
  hasPrev: boolean;
  /** 뒤로 갈 스텝이 있는지. 없으면(마지막 스텝) 그 자리에 공개 버튼이 온다. */
  hasNext: boolean;
  /** 마지막 스텝에서 「다음으로」 자리에 오는 공개 버튼. */
  publish: { label: string; disabled: boolean; onClick: () => void };
}

/**
 * 설정 화면 하단 고정 바 — 모든 스텝이 이 하나를 쓴다(LC-3273).
 *
 * 예전에는 `저장` 과 오픈 버튼이 여기 있었다. 저장은 입력이 멎으면 알아서 나가고
 * (LC-3282), 오픈은 스텝과 무관한 화면 전체의 상태라 머리의 공개/비공개 토글로
 * 옮겼다(LC-3283). 남은 일은 스텝 이동이라, 바가 그것만 한다.
 *
 * 왼쪽에는 저장이 지금 어디까지 갔는지 한 줄로 남긴다 — 누를 버튼이 사라졌으니
 * "저장이 되긴 한 건가"를 화면이 대신 말해 줘야 한다.
 */
const SettingsActionBar = ({
  status,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
  publish,
}: SettingsActionBarProps) => (
  <div className={FLOATING_BAR_WRAP}>
    <div className={FLOATING_BAR_BODY}>
      {/*
        `role="status"` 를 주지 않는다. 오픈 종료 배너가 이미 그 역할이라, 한 화면에
        live region 이 둘이 되면 무엇을 읽어야 할지 갈린다.
      */}
      <p
        className={`flex min-w-0 items-center gap-2 text-sm font-medium ${
          isAutosaveAttention(status) ? 'text-system-error' : 'text-gray-500'
        }`}
      >
        <span className="truncate">{autosaveMessage(status)}</span>
      </p>

      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={onPrev}
          disabled={!hasPrev}
          className="rounded-lg border border-gray-300 bg-white px-8 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          이전으로
        </button>
        {/*
          마지막 스텝에서는 갈 곳이 없다. 잠긴 「다음으로」 를 두는 대신 마지막에 할 일을
          그 자리에 놓는다 — 스텝을 끝까지 따라온 멘토가 다음에 하려는 건 공개다.
        */}
        {hasNext ? (
          <button
            type="button"
            onClick={onNext}
            className="bg-primary hover:bg-primary-hover rounded-lg px-8 py-2.5 text-sm font-medium text-white transition-colors"
          >
            다음으로
          </button>
        ) : (
          <button
            type="button"
            onClick={publish.onClick}
            disabled={publish.disabled}
            className="bg-primary hover:bg-primary-hover rounded-lg px-8 py-2.5 text-sm font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            {publish.label}
          </button>
        )}
      </div>
    </div>
  </div>
);

export default SettingsActionBar;
