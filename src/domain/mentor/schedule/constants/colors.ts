/** 챌린지 컬러 팔레트 — 캘린더 바, 피드백 카드에서 공통 사용 (총 10색) */
export const CHALLENGE_COLORS = [
  // 1. Orange
  {
    border: 'border-[#fdad00]',
    line: 'bg-[#fdad00]',
    badge: 'bg-[#fdad00]',
    text: 'text-[#a87100]',
    body: 'bg-[#fff3d9]',
  },
  // 2. Sky
  {
    border: 'border-[#14bcff]',
    line: 'bg-[#14bcff]',
    badge: 'bg-[#14bcff]',
    text: 'text-[#006a94]',
    body: 'bg-[#eefaff]',
  },
  // 3. Green
  {
    border: 'border-green-400',
    line: 'bg-green-400',
    badge: 'bg-green-400',
    text: 'text-green-700',
    body: 'bg-green-50',
  },
  // 4. Purple
  {
    border: 'border-purple-400',
    line: 'bg-purple-400',
    badge: 'bg-purple-400',
    text: 'text-purple-700',
    body: 'bg-purple-50',
  },
  // 5. Pink
  {
    border: 'border-pink-400',
    line: 'bg-pink-400',
    badge: 'bg-pink-400',
    text: 'text-pink-700',
    body: 'bg-pink-50',
  },
  // 6. Red
  {
    border: 'border-red-400',
    line: 'bg-red-400',
    badge: 'bg-red-400',
    text: 'text-red-700',
    body: 'bg-red-50',
  },
  // 7. Teal
  {
    border: 'border-teal-400',
    line: 'bg-teal-400',
    badge: 'bg-teal-400',
    text: 'text-teal-700',
    body: 'bg-teal-50',
  },
  // 8. Indigo
  {
    border: 'border-indigo-400',
    line: 'bg-indigo-400',
    badge: 'bg-indigo-400',
    text: 'text-indigo-700',
    body: 'bg-indigo-50',
  },
  // 9. Fuchsia
  {
    border: 'border-fuchsia-400',
    line: 'bg-fuchsia-400',
    badge: 'bg-fuchsia-400',
    text: 'text-fuchsia-700',
    body: 'bg-fuchsia-50',
  },
  // 10. Lime
  {
    border: 'border-lime-400',
    line: 'bg-lime-400',
    badge: 'bg-lime-400',
    text: 'text-lime-700',
    body: 'bg-lime-50',
  },
];

export const getColor = (colorIndex: number) =>
  CHALLENGE_COLORS[colorIndex % CHALLENGE_COLORS.length];
