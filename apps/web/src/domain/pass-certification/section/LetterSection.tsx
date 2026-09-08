import SectionHeading from '@/domain/pass-certification/components/SectionHeading';

/** 편지 섹션 (구현 예정) */
export default function LetterSection() {
  return (
    <section className="bg-neutral-95 flex min-h-[60vh] flex-col items-start justify-start gap-2 px-5 py-20 text-center md:items-center">
      <SectionHeading
        label="렛츠커리어 대표 멘토이자 CEO 쥬디의 편지"
        title="합격하신 여러분께"
      />
    </section>
  );
}
