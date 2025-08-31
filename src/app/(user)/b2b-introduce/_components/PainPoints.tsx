'use client';

export default function PainPoints() {
  const items = [
    {
      title: '부트캠프 마무리 후 취업 교육이 어려워요.',
      desc: '교육생들이 부트캠프에서 배운 내용이나 진행한 프로젝트를 서류에 녹이는 방법을 교육하기 어려워요.',
    },
    {
      title: '최신 트렌드가 반영된 취업 교육이 필요해요',
      desc: '요즘 IT 스타트업이나, 기업에서 어떤 인재를 원하는지 그에 맞게 서류를 어떻게 작성해야하는지 교육하기 어려워요.',
    },
    {
      title: '전반적인 취업 교육 참여 및 만족도 관리가 어려워요.',
      desc: '체계적으로 취업 교육을 진행했음에도 교육생들의 참여도가 매우 낮거나 수료율이 낮아요.',
    },
  ];

  return (
    <ul className="mx-auto grid max-w-3xl gap-6">
      {items.map((it, i) => (
        <li key={i} className="flex items-start gap-4">
          <span className="text-0.875-semibold mt-1 inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#6E7AFF] text-white">
            {i + 1}
          </span>
          <div>
            <p className="text-1.125-bold">{it.title}</p>
            <p className="text-0.875 mt-1 text-neutral-600">{it.desc}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
