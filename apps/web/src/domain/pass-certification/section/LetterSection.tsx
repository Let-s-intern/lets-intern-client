import SectionHeading from '@/domain/pass-certification/components/SectionHeading';

import { PASS_SECTION_ID } from './sectionIds';

/** 편지 섹션 (구현 예정) */
export default function LetterSection() {
  return (
    <section
      id={PASS_SECTION_ID.letter}
      className="bg-neutral-95 flex min-h-[60vh] scroll-mt-[56px] flex-col items-start justify-start gap-2 px-5 py-20 text-center md:scroll-mt-[60px] md:items-center"
    >
      <SectionHeading
        label="렛츠커리어 대표 멘토이자 CEO 쥬디의 편지"
        title="합격하신 여러분께"
      />
    </section>
  );
}
