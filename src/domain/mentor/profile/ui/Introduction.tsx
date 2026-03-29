'use client';

interface IntroductionProps {
  value: string;
  onChange: (value: string) => void;
}

export default function Introduction({ value, onChange }: IntroductionProps) {
  return (
    <section>
      <h2 className="mb-2 text-lg font-semibold">한줄 소개</h2>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="한줄 소개를 입력해주세요"
        className="h-32 w-full resize-none rounded border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-500"
      />
    </section>
  );
}
