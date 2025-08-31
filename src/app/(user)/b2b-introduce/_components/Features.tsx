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
      '렛츠커리어는 교육 파트너의 취업 교육 대상, 목적, 직무, 예산에 맞는 서류 작성 교육, 현직자 강의, 1:1 서류 첨삭 등 다양한 프로그램을 제공합니다.',
    align: 'left',
  },
  {
    title: '현직자 멘토와 함께 설계한 커리큘럼',
    desc:
      '최신 트렌드를 반영한 현직자 멘토의 인사이트로 커리큘럼을 설계하고, 실무형 과제와 피드백을 제공합니다.',
    align: 'right',
  },
  {
    title: '직무별 최신 합격 서류 제공',
    desc:
      '직무별 실제 합격 사례 기반의 이력서·자기소개서·포트폴리오 레퍼런스를 제공하여 빠르게 따라 쓸 수 있도록 돕습니다.',
    align: 'left',
  },
  {
    title: '동기부여 장치로 수료율 향상',
    desc:
      '마일스톤·리워드·그룹 스터디 등 참여 동기부여 장치를 운영하여 교육 참여율과 수료율을 높입니다.',
    align: 'right',
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
