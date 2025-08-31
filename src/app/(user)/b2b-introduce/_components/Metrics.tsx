'use client';

export default function Metrics() {
  const stats = [
    { label: '교육 만족도', value: '4.6점' },
    { label: '누적 참여자 수', value: '5,000+명' },
    { label: '수료율', value: '80+%' },
    { label: '누적 후기 개수', value: '3,300+개' },
    { label: '렛츠커리어 인스타그램 팔로워 수', value: '1.8M' },
    { label: '렛츠커리어 커뮤니티 참여자 수', value: '2,500+명' },
  ];

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-6">
        {stats.map((s, i) => (
          <div
            key={i}
            className="rounded-xl bg-white p-4 text-center shadow-sm"
          >
            <div className="text-1.375-semibold">{s.value}</div>
            <div className="text-0.875 text-neutral-600">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <article className="rounded-xl bg-white p-4 shadow-sm">
          <div className="aspect-[16/9] w-full rounded-lg bg-neutral-200" />
          <h3 className="text-1.125-bold mt-3">취업 트렌드 콘텐츠 상시 제공</h3>
          <p className="text-0.875 mt-1 text-neutral-600">
            렛츠커리어 자체 블로그 및 인스타그램을 통해 취업 시장 트렌드에 맞는
            콘텐츠를 제공합니다.
          </p>
        </article>
        <article className="rounded-xl bg-white p-4 shadow-sm">
          <div className="aspect-[16/9] w-full rounded-lg bg-neutral-200" />
          <h3 className="text-1.125-bold mt-3">
            취업 여정에 맞는 서류 작성 교육
          </h3>
          <p className="text-0.875 mt-1 text-neutral-600">
            경험정리부터 직무탐색, 서류 3중 완성 및 면접 전까지 취업 여정에 맞춘
            교육을 제공합니다.
          </p>
        </article>
        <article className="rounded-xl bg-white p-4 shadow-sm">
          <div className="aspect-[16/9] w-full rounded-lg bg-neutral-200" />
          <h3 className="text-1.125-bold mt-3">교육 참여 후 후속 관리</h3>
          <p className="text-0.875 mt-1 text-neutral-600">
            교육 마무리 후에도 무제한 질문응답과 커뮤니티를 통해 취업 성공까지
            함께합니다.
          </p>
        </article>
      </div>
    </div>
  );
}
