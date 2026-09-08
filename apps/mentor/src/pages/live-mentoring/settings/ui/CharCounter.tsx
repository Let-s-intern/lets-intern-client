interface CharCounterProps {
  value: string;
  max: number;
}

/**
 * 글자수 카운터.
 *
 * `maxLength` 는 **새 입력만** 막는다. 이미 저장돼 있던 값이 상한보다 길면 그대로 남는데,
 * 카운터가 늘 회색이면 멘토는 초과 상태를 모른 채 저장하고 서버에서 잘리거나 거부당한다.
 * 초과분을 경고색으로 드러낸다.
 */
const CharCounter = ({ value, max }: CharCounterProps) => {
  const over = value.length > max;
  return (
    <span
      className={`shrink-0 text-xs ${over ? 'text-system-error font-medium' : 'text-neutral-50'}`}
      role={over ? 'alert' : undefined}
    >
      {value.length}/{max}
    </span>
  );
};

export default CharCounter;
