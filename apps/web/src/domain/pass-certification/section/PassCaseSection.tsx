import SectionHeading from '@/domain/pass-certification/components/SectionHeading';

import { PASS_SECTION_ID } from './sectionIds';

/** 합격자 섹션 (구현 예정) */
export default function PassCaseSection() {
  return (
    <section
      id={PASS_SECTION_ID.passCase}
      className="bg-neutral-95 flex min-h-[60vh] scroll-mt-[56px] flex-col items-start justify-start gap-2 px-5 py-20 text-center md:scroll-mt-[60px] md:items-center"
    >
      <SectionHeading
        label="렛츠커리어 합격자"
        title={
          <>
            대기업부터 스타트업까지,
            <br />
            누적 <span className="text-primary">155</span>건의 합격 소식
          </>
        }
        description={
          <>
            먼저 인증해주신 렛츠커리어 동료들의 합격 소식이에요.{' '}
            <br className="block md:hidden" />
            다음 주인공은 여러분입니다.
          </>
        }
      />
    </section>
  );
}
