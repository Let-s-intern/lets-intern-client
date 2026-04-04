/** 챌린지 컬러 팔레트 — 캘린더 바, 피드백 카드에서 공통 사용 */
export const CHALLENGE_COLORS = [
  {
    border: 'border-[#fdad00]',
    line: 'bg-[#fdad00]',
    badge: 'bg-[#fdad00]',
    text: 'text-[#fdad00]',
    body: 'bg-[#fff3d9]',
    bodyLight: 'bg-[#fffaef]',
  },
  {
    border: 'border-[#14bcff]',
    line: 'bg-[#14bcff]',
    badge: 'bg-[#14bcff]',
    text: 'text-[#14bcff]',
    body: 'bg-[#eefaff]',
    bodyLight: 'bg-[#f4fbff]',
  },
  {
    border: 'border-green-400',
    line: 'bg-green-400',
    badge: 'bg-green-400',
    text: 'text-green-400',
    body: 'bg-green-50',
    bodyLight: 'bg-[#f4fbf4]',
  },
  {
    border: 'border-purple-400',
    line: 'bg-purple-400',
    badge: 'bg-purple-400',
    text: 'text-purple-400',
    body: 'bg-purple-50',
    bodyLight: 'bg-[#f7f4fb]',
  },
];

export const getColor = (colorIndex: number) =>
  CHALLENGE_COLORS[colorIndex % CHALLENGE_COLORS.length];
