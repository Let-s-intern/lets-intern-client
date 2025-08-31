'use client';

type Block = {
  title: string;
  desc: string;
  align: 'left' | 'right';
};

const blocks: Block[] = [
  {
    title: '맞춤형 취업교육',
    desc:
      '맞춤형으로 프로그램 난이도/직군/진로 단계에 맞춰 커리큘럼을 설계합니다. 워크숍, 실습, 강연, 1:1 세션까지 운영합니다.',
    align: 'left',
  },
  {
    title: '현직자 멘토와 함께 설계한 커리큘럼',
    desc:
      '현직자 네트워크와 함께 직무 탐색, 역량, 과제형 프로젝트 등 교육생의 취업 실력을 끌어올립니다.',
    align: 'right',
  },
  {
    title: '운영/성과 관리',
    desc:
      '참여도, 진도, 과제, 만족도 등 주요 지표를 점검하고 보고합니다. 운영 부담을 최소화합니다.',
    align: 'left',
  },
];

export default function Features() {
  return (
    <div className="space-y-10">
      {blocks.map((b, i) => (
        <FeatureRow key={i} {...b} />)
      )}
    </div>
  );
}

function FeatureRow({ title, desc, align }: Block) {
  const image = <div className="aspect-[16/11] w-full rounded-xl bg-neutral-200" />;
  const text = (
    <div className="w-full">
      <p className="text-0.875-medium text-[#6E7AFF]">프로그램 하이라이트</p>
      <h3 className="mt-2 text-1.375-semibold">{title}</h3>
      <p className="mt-2 text-1.125 text-neutral-600">{desc}</p>
    </div>
  );
  return (
    <div className="grid items-center gap-6 md:grid-cols-2">
      {align === 'left' ? (
        <>
          {image}
          {text}
        </>
      ) : (
        <>
          {text}
          {image}
        </>
      )}
    </div>
  );
}

