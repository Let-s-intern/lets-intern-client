'use client';

export default function PainPoints() {
  const items = [
    '부트캠프 마무리 후 취업 교육이 어려워요.',
    '최신 트렌드가 반영된 취업 교육이 필요해요.',
    '전반적인 취업 교육 참여 및 만족도 관리가 어려워요.',
  ];

  return (
    <ul className="mx-auto grid max-w-3xl gap-6">
      {items.map((t, i) => (
        <li key={i} className="flex items-start gap-4">
          <span className="mt-1 inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#6E7AFF] text-white text-0.875-semibold">
            {i + 1}
          </span>
          <p className="text-1.125">{t}</p>
        </li>
      ))}
    </ul>
  );
}
