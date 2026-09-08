import SectionHeading from '@/domain/pass-certification/components/SectionHeading';

import { PASS_SECTION_ID } from './sectionIds';

const PASS_CASES = [
  {
    logo: 'cj',
    name: 'CJ',
    logoClass: 'h-7 w-7 md:h-[46px] md:w-[54px]',
    category: '대기업 · 정규직',
    title: '콘텐츠 마케팅',
    desc: '자기소개서 챌린지 수강',
  },
  {
    logo: 'wrtn',
    name: '뤼튼',
    logoClass: 'h-7 w-7 md:h-6 md:w-auto',
    category: 'IT 스타트업 · 인턴',
    title: '퍼포먼스 마케팅',
    desc: '사이드 프로젝트 참여',
  },
  {
    logo: 'hancom',
    name: 'HANCOM',
    logoClass: 'w-9 md:h-6 md:w-auto',
    category: 'IT · 정규직',
    title: '서비스 기획',
    desc: '포트폴리오 챌린지, 면접 챌린지 수강',
  },
  {
    logo: 'kt',
    name: 'kt',
    logoClass: 'h-7 w-7 md:h-6 md:w-auto',
    category: '금융 · 인턴',
    title: '데이터 분석',
    desc: '경험 정리 완성 챌린지 수강',
  },
];

/** 합격자 섹션 */
export default function PassCaseSection() {
  return (
    <section
      id={PASS_SECTION_ID.passCase}
      className="bg-neutral-95 scroll-mt-[56px] md:scroll-mt-[60px]"
    >
      <div className="mx-auto flex max-w-[1040px] flex-col items-center gap-4 px-5 py-10 md:gap-9 md:px-0 md:py-20">
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

        <ul className="grid w-full max-w-[1040px] grid-cols-1 gap-4 md:grid-cols-4">
          {PASS_CASES.map((c) => (
            <li
              key={c.name}
              className="border-neutral-80 bg-static-100 flex items-center gap-4 rounded-lg border p-4 md:flex-col md:items-stretch md:gap-0 md:rounded-xl md:p-0"
            >
              <div className="bg-primary-5 flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-sm md:h-[88px] md:w-full md:rounded-none">
                <img
                  src={`/images/pass-certification/${c.logo}-logo.png`}
                  alt={c.name}
                  className={`${c.logoClass} object-contain`}
                />
              </div>

              <div className="flex flex-1 flex-col justify-center gap-1 md:justify-start md:gap-2 md:px-[22px] md:py-5">
                <span className="bg-primary-10 text-primary text-xxsmall12 self-start rounded-full px-2 py-1 font-semibold md:px-2.5">
                  {c.category}
                </span>
                <h4 className="text-xsmall16 text-neutral-0 font-semibold">
                  {c.title}
                </h4>
                <p className="text-xsmall14 text-neutral-40 font-light">
                  {c.desc}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
