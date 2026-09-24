import { FLOATING_BAR_BODY, FLOATING_BAR_WRAP } from '../constants';

interface SettingsActionBarProps {
  onPrev: () => void;
  onNext: () => void;
  /** 앞으로 갈 스텝이 있는지. 없으면 버튼을 잠근다. */
  hasPrev: boolean;
  /**
   * 뒤로 갈 스텝이 **존재**하는지. 없으면(진짜 마지막 스텝) 그 자리에 공개 버튼이 온다.
   *
   * 잠겨서 못 가는 것과 아예 없는 것을 섞으면 안 된다 — 섞었더니 첫 세팅에서 다음
   * 스텝이 잠긴 순간 「공개하기」가 떴다. 아직 아무것도 안 쓴 멘토에게 공개를 권한 셈이다.
   */
  hasNext: boolean;
  /** 다음 스텝이 아직 잠겨 있는지. 버튼은 「다음으로」인 채로 눌리지만 않는다. */
  nextDisabled?: boolean;
  /** 마지막 스텝에서 「다음으로」 자리에 오는 공개 버튼. */
  publish: { label: string; disabled: boolean; onClick: () => void };
}

/**
 * 스텝 이동 버튼의 크기.
 *
 * 이 바에서 누를 것은 이 둘뿐이라 시안처럼 크게 잡는다 — 화면 아래 끝에 떠 있는 버튼은
 * 작을수록 겨냥하기 어렵다.
 *
 * 폭은 `flex-1` 로 바를 반씩 나눠 갖는다. 둘이 같은 규칙이라 늘 같은 폭이고,
 * 「다음으로」가 마지막 스텝에서 「공개하기」로 바뀌어도 자리가 흔들리지 않는다.
 */
const stepButton =
  'flex-1 rounded-lg px-10 py-3.5 text-base font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50';

/**
 * 설정 화면 하단에 떠 있는 스텝 이동 바 — 모든 스텝이 이 하나를 쓴다(LC-3273).
 *
 * **저장하지 않은 변경이 있으면 이 바 대신 저장 버튼이 같은 자리에 온다**
 * (`SaveFloatingButton`, LC-3288). 둘을 함께 두지 않는 이유는 지금 해야 할 일이 늘
 * 하나이기 때문이다 — 고친 게 있으면 저장이고, 없으면 다음 스텝이다. 나란히 두면
 * 저장하지 않고 넘어가는 길이 남고, 넘어가고 나면 무엇을 안 저장했는지 화면에서 사라진다.
 *
 * 저장 상태 문구도 저장 버튼으로 옮겼다. 상태를 말해 주는 자리와 누를 자리는 붙어
 * 있어야 한다.
 */
const SettingsActionBar = ({
  onPrev,
  onNext,
  hasPrev,
  hasNext,
  nextDisabled = false,
  publish,
}: SettingsActionBarProps) => (
  <div className={FLOATING_BAR_WRAP}>
    <div className={FLOATING_BAR_BODY}>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onPrev}
          disabled={!hasPrev}
          className={`${stepButton} border border-gray-300 bg-white text-gray-700 hover:bg-gray-50`}
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
            disabled={nextDisabled}
            className={`${stepButton} bg-primary hover:bg-primary-hover text-white`}
          >
            다음으로
          </button>
        ) : (
          <button
            type="button"
            onClick={publish.onClick}
            disabled={publish.disabled}
            className={`${stepButton} bg-primary hover:bg-primary-hover text-white`}
          >
            {publish.label}
          </button>
        )}
      </div>
    </div>
  </div>
);

export default SettingsActionBar;
