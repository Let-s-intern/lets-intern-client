import SectionHeading from '@/domain/pass-certification/components/SectionHeading';

import { PASS_SECTION_ID } from './sectionIds';

/** 인증 절차 섹션 (구현 예정) */
export default function ProcessSection() {
  return (
    <section
      id={PASS_SECTION_ID.process}
      className="flex min-h-[60vh] scroll-mt-[56px] flex-col items-start justify-start gap-2 px-5 py-20 text-center md:scroll-mt-[60px] md:items-center"
    >
      <SectionHeading
        label="인증 절차"
        title={
          <>
            <span className="text-primary">5분</span>이면 끝나는
            <br />
            합격 인증 4단계
          </>
        }
        description={
          <>
            회원가입도, 로그인도 필요 없어요. <br className="block md:hidden" />
            아래 순서대로만 따라오세요.
          </>
        }
      />
    </section>
  );
}
