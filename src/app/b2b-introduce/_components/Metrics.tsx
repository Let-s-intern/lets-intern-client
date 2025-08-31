'use client';

export default function Metrics() {
  const stats = [
    { label: '고객 만족도', value: '4.6' },
    { label: '누적 참여자수', value: '15,000명' },
    { label: '스코어', value: '80%+' },
    { label: '누적 후기 개수', value: '3,300+개' },
    { label: '연수기간 조회수', value: '1.8M' },
    { label: '자유자막 조회수', value: '2,500+명' },
  ];

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-6">
        {stats.map((s, i) => (
          <div key={i} className="rounded-xl bg-white p-4 text-center shadow-sm">
            <div className="text-1.375-semibold">{s.value}</div>
            <div className="text-0.875 text-neutral-600">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <article key={i} className="rounded-xl bg-white p-4 shadow-sm">
            <div className="aspect-[16/9] w-full rounded-lg bg-neutral-200" />
            <h3 className="mt-3 text-1.125-bold">콘텐츠/프로그램 샘플 타이틀</h3>
            <p className="mt-1 text-0.875 text-neutral-600">
              세부 이미지는 추후 교체합니다. 현재는 목업 이미지를 표시합니다.
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}

