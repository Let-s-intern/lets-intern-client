'use client';

import { Break } from '@components/Break';
// TODO:
// - GTM 이벤트(뷰/클릭/제출/성공) 연결
// - “기업소개서 받기” 실제 파일/링크 연결
// - OG 전용 이미지 생성/교체
// - 실제 파트너 로고/캡처 삽입 및 next/image 최적화
// Hero 뱃지 아이콘 아이콘 수정

// import { Break } from '@components/Break';
import Features from './Features';
import FinalCTA from './FinalCTA';
import Hero from './Hero';
import Metrics from './Metrics';
import PainPoints from './PainPoints';
import Process from './Process';
import Testimonials from './Testimonials';

export default function Client() {
  const CONTACT_LINK = '#contact';
  return (
    <main className="w-full text-neutral-900">
      {/* Hero */}
      <Hero primaryHref={CONTACT_LINK} />

      {/* Intro copy + mock logo rail */}
      <section id="intro" className="w-full">
        <div className="mw-1180 py-16 md:py-20">
          <div className="text-center">
            <p className="text-center text-xsmall16 font-medium text-primary-90">
              교육 파트너 소개
            </p>
            <h2 className="mt-7 text-[40px] font-bold text-static-0">
              교육생의 취업을 원하는 기관이라면,
              <br />
              렛츠커리어를 선택했습니다
            </h2>
            <p className="text-1.125 mt-7 text-neutral-40">
              다양한 부트캠프 운영 기관과 협력하여 교육생들의 취업 교육을
              담당했습니다.
              <Break /> 교육 파트너와 함께한 성과를 통해 렛츠커리어의 검증된
              취업 교육을 확인하세요.
            </p>
          </div>
          <div className="mt-10 rounded-xl bg-neutral-100/80 p-8">
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="h-14 rounded-md bg-neutral-200/90"
                  aria-hidden
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Metrics + cards */}
      <section className="w-full bg-[#F7F9FF]">
        <div className="mw-1180 py-16 md:py-24">
          <div className="text-center">
            <p className="text-center text-xsmall16 font-medium text-primary-90 bg-primary-5 inline-block">
              성과로 이어지는 렛츠커리어 서류 교육
            </p>
            <h2 className="mt-7 text-[40px] font-bold text-static-0">
              경험정리, 직무탐색부터 서류 완성 이후까지 관리
            </h2>
            <p className="text-1.125 mt-7 text-neutral-40">
              수많은 취업준비생들과 교육 파트너가 렛츠커리어와 함께하는
              이유입니다.
            </p>
          </div>
          <div className="mt-10">
            <Metrics />
          </div>
        </div>
      </section>

      {/* Pain points */}
      <section className="w-full">
        <div className="mw-1180 py-16 md:py-20">
          <p className="text-center text-xsmall16 font-medium text-primary-90">
            혹시 이런 고민들을 갖고 있지 않으신가요?
          </p>
          <h2 className="mt-7 text-[40px] font-bold text-static-0 text-center">
            이런 고민을 갖고있는 교육 운영 담당자분들께 추천드려요
          </h2>
          <div className="mt-10">
            <PainPoints />
          </div>
        </div>
      </section>

      {/* Features/Programs */}
      <section className="w-full">
        <div className="mw-1180 py-16 md:py-24">
          <p className="text-center text-xsmall16 font-medium text-primary-90">
            설정하신 목표에 맞춘 교육 설계
          </p>
          <h2 className="mt-7 text-[40px] font-bold text-static-0 text-center">
            교육 기관의 목표에 맞는 최적의 교육을 제공합니다
          </h2>
          <div className="mt-12">
            <Features />
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="w-full bg-white">
        <div className="mw-1180 py-16 md:py-24">
          <p className="text-center text-xsmall16 font-medium text-primary-90">
            맞춤형 취업 교육을 위한 단계
          </p>
          <h2 className="mt-7 text-[40px] font-bold text-static-0 text-center">
            렛츠커리는 교육 파트너의 취업 교육 대상, 목적, 직무에 맞춰서 맞춤형
            서류 작성 교육을 제공합니다.
          </h2>
          <div className="mt-10">
            <Process />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="w-full bg-[#F7F9FF]">
        <div className="mw-1180 py-16 md:py-24">
          <Testimonials />
        </div>
      </section>

      {/* Final CTA */}
      <section className="w-full bg-[#F7F9FF]">
        <div className="mw-1180 py-16 md:py-24">
          <FinalCTA href={CONTACT_LINK} />
        </div>
      </section>
    </main>
  );
}
