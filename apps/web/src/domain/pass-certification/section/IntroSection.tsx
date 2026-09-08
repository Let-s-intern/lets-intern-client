'use client';

import { scrollToSection } from '@/common/nav/scrollToSection';

import { PASS_SECTION_ID } from './sectionIds';

const INTRO_GRADIENT =
  'linear-gradient(144deg, #000 0%, #191B4C 55%, #3B2FD6 100%)';

const FEATURES = [
  {
    title: '회사생활 TIP VOD & PDF',
    desc: 'CEO 쥬디 멘토 직접 제작 · 전원 제공',
  },
  { title: '1만원 축하 리워드', desc: '매월 추첨 10분 · 6일 일괄 송금' },
  { title: '합격자 인터뷰 기회', desc: '희망자 한정 · 후배들의 멘토 되어주기' },
  { title: '로그인 없이 5분', desc: '회원가입 없이 폼 작성으로 끝' },
];

/** 히어로/인트로 섹션 */
export default function IntroSection() {
  return (
    <section
      className="text-static-100 relative overflow-hidden"
      style={{ background: INTRO_GRADIENT }}
    >
      {/* 뒤 반투명 로고 (웹) */}
      <img
        src="/images/pass-certification/intro-bg.svg"
        alt=""
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden h-full w-full object-cover md:block"
      />

      <div className="relative mx-auto flex w-full flex-col items-start gap-6 px-5 pb-10 pt-10 text-left md:max-w-[1000px] md:items-center md:gap-10 md:px-0 md:pb-10 md:pt-20 md:text-center">
        {/* 뱃지 */}
        <span className="border-static-100/35 bg-static-100/5 text-xxsmall12 md:text-xsmall14 rounded-full border px-5 py-2 font-medium md:font-semibold">
          매월 10분께 축하 리워드 1만원 지급 중
        </span>
        <div className="flex flex-col gap-6">
          {/* 헤딩 */}
          <h2 className="text-medium24 font-bold leading-snug md:text-[54px] md:leading-[66px]">
            인턴&신입 합격을 인증하면,
            <br />
            <span className="text-primary-xlight">회사생활 TIP</span>부터{' '}
            <span className="text-[#FEBDAD]">축하금</span>까지
            <br />
            렛츠커리어가 챙겨드려요
          </h2>

          {/* 서브텍스트 */}
          <p className="text-static-100/85 text-xsmall14 md:text-small18 leading-6 md:leading-7">
            새로운 커리어를 향해 첫 발걸음을 내딛으신 점 축하드려요.
            <br />
            로그인 없이 5분, 사원증이나 합격 메일 한 장이면 인증 끝!
          </p>
        </div>
        {/* 섹션 이동 버튼 */}
        <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row">
          <button
            type="button"
            onClick={() => scrollToSection(PASS_SECTION_ID.form)}
            className="bg-primary hover:bg-primary-hover text-xsmall14 md:text-xsmall16 rounded-md px-6 py-3.5 font-semibold shadow-[0_8px_24px_rgba(0,0,0,0.18)] transition-colors md:px-11 md:py-4"
          >
            합격 소식 들려주기
          </button>
          <button
            type="button"
            onClick={() => scrollToSection(PASS_SECTION_ID.reward)}
            className="border-static-100/45 bg-static-100/15 text-xsmall14 md:text-xsmall16 hover:bg-static-100/20 rounded-md border px-6 py-3.5 font-semibold transition-colors md:px-11 md:py-4"
          >
            리워드 먼저 보기
          </button>
        </div>

        {/* 리워드 카드 4개 */}
        <div className="mt-4 grid w-full grid-cols-2 gap-3.5 md:mt-8 md:grid-cols-4">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="bg-static-100 flex flex-col gap-1.5 rounded-lg px-[22px] py-5 text-left shadow-[0_8px_24px_rgba(0,0,0,0.18)]"
            >
              <h3 className="text-xsmall14 md:text-xsmall16 text-neutral-0 min-h-[40px] font-bold md:min-h-0">
                {f.title}
              </h3>
              <p className="text-xxsmall12 md:text-xsmall14 text-neutral-45 font-normal tracking-tight">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
