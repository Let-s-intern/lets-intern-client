import { PASS_SECTION_ID } from './sectionIds';

/** 리워드 섹션 (구현 예정) */
export default function RewardSection() {
  return (
    <section
      id={PASS_SECTION_ID.reward}
      className="flex min-h-[60vh] scroll-mt-[56px] flex-col items-start justify-start gap-2 px-5 py-20 text-center md:scroll-mt-[60px] md:items-center"
    >
      <h3 className="text-xsmall16 text-primary font-semibold">
        합격 인증 리워드
      </h3>
      <h2 className="text-medium24 text-neutral-0 font-bold">리워드 섹션</h2>
      <p className="text-xsmall14 text-neutral-40">(구현 예정)</p>
    </section>
  );
}
