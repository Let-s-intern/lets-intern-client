interface IntroductionProps {
  value: string;
  onChange: (value: string) => void;
}

export default function Introduction({ value, onChange }: IntroductionProps) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 md:p-6">
      <h2 className="mb-4 text-base font-semibold text-gray-900">한줄 소개</h2>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="한줄 소개를 입력해주세요"
        className="h-32 w-full resize-none rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
      />
    </section>
  );
}
