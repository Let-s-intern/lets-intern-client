'use client';

import PassCertificationForm from '@/domain/pass-certification/components/PassCertificationForm';
import SectionHeading from '@/domain/pass-certification/components/SectionHeading';

import { PASS_SECTION_ID } from './sectionIds';

export default function FormSection() {
  return (
    <section
      id={PASS_SECTION_ID.form}
      className="bg-neutral-90 flex scroll-mt-[56px] flex-col items-start gap-4 px-5 py-10 md:scroll-mt-[60px] md:items-center md:py-[84px]"
    >
      <SectionHeading
        label="합격 인증 폼"
        title="합격 인증하기"
        description={
          <>
            로그인 없이 작성할 수 있어요. <br className="block md:hidden" />
            VOD·PDF는 작성해주신 이메일로 보내드려요.
          </>
        }
      />
      <PassCertificationForm />
    </section>
  );
}
