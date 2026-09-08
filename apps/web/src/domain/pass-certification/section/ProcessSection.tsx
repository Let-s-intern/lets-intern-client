import SectionHeading from '@/domain/pass-certification/components/SectionHeading';

import { PASS_SECTION_ID } from './sectionIds';

/** 인증 절차 4단계 (번호 원 색상은 arbitrary → inline style) */
const PROCESS_STEPS = [
  {
    no: 1,
    color: '#4A76FF',
    label: '지금 바로',
    title: '합격 인증 폼 작성',
    desc: '이름·연락처·이메일과 합격 회사/직무, 참여했던 렛츠커리어 프로그램을 입력해주세요.',
  },
  {
    no: 2,
    color: '#4D55F5',
    label: '함께 첨부',
    title: '인증 자료와 계좌 입력',
    desc: '합격 메일이나 사원증 사진을 올리고, 축하금을 받을 계좌를 남겨주세요.',
  },
  {
    no: 3,
    color: '#FE8064',
    label: '영업일 3일 내',
    title: '렛츠커리어 확인 후 자료 발송',
    desc: '인증이 확인되면 회사생활 TIP VOD와 PDF를 이메일로 보내드려요.',
  },
  {
    no: 4,
    color: '#13BCFE',
    label: '매월 6일',
    title: '축하 리워드 송금 · 인터뷰 섭외',
    desc: '매월 추첨된 10분께 1만원을 일괄 송금하고, 선순환에 동의하신 분께는 인터뷰 섭외 메일을 드려요.',
  },
];

/** 인증 절차 섹션 */
export default function ProcessSection() {
  return (
    <section
      id={PASS_SECTION_ID.process}
      className="scroll-mt-[56px] md:scroll-mt-[60px]"
    >
      <div className="mx-auto flex max-w-[1040px] flex-col items-center gap-4 px-5 py-10 md:gap-10 md:px-0 md:py-20">
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
              회원가입도, 로그인도 필요 없어요.{' '}
              <br className="block md:hidden" />
              아래 순서대로만 따라오세요.
            </>
          }
        />

        <ul className="divide-neutral-90 flex w-full flex-col gap-5 md:gap-0 md:divide-y">
          {PROCESS_STEPS.map((s) => (
            <li key={s.no} className="flex gap-4 py-0 md:gap-10 md:py-[26px]">
              <span
                className="text-xsmall14 md:text-small20 text-static-100 flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-bold md:h-12 md:w-12"
                style={{ backgroundColor: s.color }}
              >
                {s.no}
              </span>
              <div className="flex flex-col gap-1 md:gap-2">
                <span className="text-primary text-xsmall14 font-semibold">
                  {s.label}
                </span>
                <h4 className="text-xsmall16 md:text-medium22 text-neutral-0 font-bold">
                  {s.title}
                </h4>
                <p className="text-xsmall14 md:text-xsmall16 text-neutral-40">
                  {s.desc}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
