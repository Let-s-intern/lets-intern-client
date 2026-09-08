'use client';

import PassCertificationForm from '@/domain/pass-certification/components/PassCertificationForm';

import { PASS_SECTION_ID } from './sectionIds';

export default function FormSection() {
  return (
    <section
      id={PASS_SECTION_ID.form}
      className="bg-neutral-90 flex scroll-mt-[56px] flex-col items-start md:items-center gap-4 px-5 py-10 md:scroll-mt-[60px] md:py-[84px]"
    >
      <h3 className="text-xsmall16 text-primary font-semibold">합격 인증 폼</h3>
      <div className="mt-2 flex w-full flex-col items-start gap-2 text-left md:mt-7 md:items-center md:gap-4 md:text-center">
        <h1 className="text-medium24 md:text-large32 text-neutral-0 font-bold">
          합격 인증하기
        </h1>
        <p className="text-xsmall14 md:text-small16 text-neutral-40">
          로그인 없이 작성할 수 있어요. VOD·PDF는 작성해주신 이메일로
          보내드려요.
        </p>
      </div>
      <PassCertificationForm />
    </section>
  );
}
