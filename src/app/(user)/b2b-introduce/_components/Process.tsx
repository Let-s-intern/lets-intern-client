'use client';

const steps = [
  '교육 문의 하기',
  '교육 담당자의 고민 미팅',
  '맞춤형 취업 교육 제안',
  '교육 과정 운영',
  '결과 리포트 전달',
];

export default function Process() {
  return (
    <ol className="mx-auto max-w-4xl">
      {steps.map((s, i) => (
        <li key={i} className="relative flex items-start gap-4 py-4">
          <span className="mt-0.5 inline-flex h-8 w-8 flex-none items-center justify-center rounded-full bg-[#6E7AFF] text-white text-0.875-semibold">
            {i + 1}
          </span>
          <div>
            <p className="text-1.125-medium">{s}</p>
            {i < steps.length - 1 && (
              <div className="mt-4 h-px w-full bg-neutral-200 md:ml-12" />
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}

