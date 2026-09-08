import SectionHeading from '@/domain/pass-certification/components/SectionHeading';

import { PASS_SECTION_ID } from './sectionIds';

/** FAQ 섹션 (구현 예정) */
export default function FaqSection() {
  return (
    <section
      id={PASS_SECTION_ID.faq}
      className="flex min-h-[60vh] scroll-mt-[56px] flex-col items-start justify-start gap-2 px-5 py-20 text-center md:scroll-mt-[60px] md:items-center"
    >
      <SectionHeading label="FAQ" title="궁금한 점이 있으신가요?" />
    </section>
  );
}
