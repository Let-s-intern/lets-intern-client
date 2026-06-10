/** 원본 이미지(payback-personal-statement-blank.png) 크기 기준 좌표계 */
const VIEW_WIDTH = 772;
const VIEW_HEIGHT = 600;

/** 티켓 내 "Pay back" 텍스트와 동일한 색상 (이미지에서 샘플링) */
const TEXT_COLOR = '#2AA7D8';

/** 티켓 기울기에 맞춘 금액 텍스트 위치·회전 (이미지에서 측정) */
const TEXT_CENTER_X = 402;
const TEXT_CENTER_Y = 306;
const TEXT_ROTATE_DEG = -15.6;
const TEXT_FONT_SIZE = 92;

interface PaybackTicketProps {
  deposit: number;
  className?: string;
}

/**
 * 자소서 챌린지 페이백 티켓.
 * 금액이 없는 티켓 이미지 위에 서버에서 받아온 페이백 금액(deposit)을
 * SVG 텍스트로 렌더링하여, 금액 변경 시 이미지 교체 없이 자동 반영된다.
 */
const PaybackTicket = ({ deposit, className }: PaybackTicketProps) => {
  return (
    <svg
      viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
      className={className}
      role="img"
      aria-label={`페이백 ${deposit / 10000}만원`}
    >
      <image
        href="/images/payback-personal-statement-blank.png"
        width={VIEW_WIDTH}
        height={VIEW_HEIGHT}
      />
      <text
        x={TEXT_CENTER_X}
        y={TEXT_CENTER_Y}
        transform={`rotate(${TEXT_ROTATE_DEG} ${TEXT_CENTER_X} ${TEXT_CENTER_Y})`}
        textAnchor="middle"
        dominantBaseline="central"
        fill={TEXT_COLOR}
        fontSize={TEXT_FONT_SIZE}
        fontWeight={700}
      >
        {deposit.toLocaleString()}원
      </text>
    </svg>
  );
};

export default PaybackTicket;
