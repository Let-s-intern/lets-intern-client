'use client';

import { Break } from '@components/Break';

export default function PainPoints() {
  const items = [
    {
      title: '부트캠프 마무리 후 취업 교육이 어려워요.',
      desc: (
        <>
          교육생들이 부트캠프에서 배운 내용이나 진행한 프로젝트를
          <Break />
          서류에 녹이는 방법을 교육하기 어려워요.
        </>
      ),
    },
    {
      title: '최신 트렌드가 반영된 취업 교육이 필요해요',
      desc: (
        <>
          요즘 IT 스타트업이나, 기업에서 어떤 인재를 원하는지
          <Break />
          그에 맞게 서류를 어떻게 작성해야 하는지 교육하기 어려워요.
        </>
      ),
    },
    {
      title: '전반적인 취업 교육 참여 및 만족도 관리가 어려워요.',
      desc: (
        <>
          자체적으로 취업 교육을 진행했을 때,
          <Break />
          교육생들의 참여도가 매우 낮거나 수료하는 비율이 너무 낮아요.
        </>
      ),
    },
  ];

  return (
    <div className="flex justify-center">
      <ul className="grid gap-8">
        {items.map((it, i) => (
          <li key={i} className="flex items-start gap-4">
            <span
              className={`mt-1 flex h-[34px] w-[34px] items-center justify-center rounded-full text-small20 font-semibold text-neutral-0 ${
                i === 0
                  ? 'bg-primary-20'
                  : i === 1
                    ? 'bg-primary-30'
                    : 'bg-primary-40'
              }`}
            >
              {i + 1}
            </span>
            <div>
              <p className="text-[26px] font-semibold text-neutral-0">
                {it.title}
              </p>
              <p className="mt-3 break-keep text-small20 text-neutral-40">
                {it.desc}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
