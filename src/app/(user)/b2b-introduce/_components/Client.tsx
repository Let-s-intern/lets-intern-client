'use client';

import { Break } from '@components/Break';
// TODO:
// - GTM 이벤트(뷰/클릭/제출/성공) 연결
// - “기업소개서 받기” 실제 링크 연결
// - OG 전용 이미지 생성/교체
// - 실제 파트너 로고/캡처 삽입 및 next/image 최적화
// Hero 뱃지 아이콘 위치 수정

// import { Break } from '@components/Break';
import heroBg from '../_images/hero-bg.png';
import CaseStudies from './CaseStudies';
import ClientTestimonials from './ClientTestimonials';
import Features from './Features';
import FinalCTA from './FinalCTA';
import Hero from './Hero';
import LogoRail from './LogoRail';
import MentorMarquee from './MentorMarquee';
import Metrics from './Metrics';
import PainPoints from './PainPoints';
import Process from './Process';
import StudentTestimonials from './StudentTestimonials';

export default function Client() {
  const CONTACT_LINK = '#contact';
  return (
    <main className="w-full text-neutral-900">
      {/* Hero */}
      <section className="relative w-full overflow-hidden pt-8">
        <div
          className="relative mx-auto max-w-[1336px] rounded-none bg-cover bg-center px-4 py-36 md:rounded-lg"
          style={{
            backgroundImage: `url("${heroBg.src}")`,
          }}
        >
          <Hero primaryHref={CONTACT_LINK} />
        </div>
      </section>

      {/* Intro copy + logo rail */}
      <section id="intro" className="w-full">
        <div className="mx-auto max-w-[1120px] py-24 md:py-32">
          <div className="text-center">
            <p className="text-center text-xsmall16 font-medium text-primary-90">
              교육 파트너 소개
            </p>
            <h2 className="mt-7 break-keep text-[40px] font-bold text-static-0">
              교육생의 취업을 원하는 기관이라면,
              <br />
              렛츠커리어를 선택했습니다
            </h2>
            <p className="text-1.125 mt-7 break-keep text-neutral-40">
              다양한 부트캠프 운영 기관과 협력하여 교육생들의 취업 교육을
              담당했습니다.
              <Break /> 교육 파트너와 함께한 성과를 통해 렛츠커리어의 검증된
              취업 교육을 확인하세요.
            </p>
          </div>
          <div className="mt-12">
            <LogoRail />
          </div>
        </div>
      </section>

      {/* Metrics + cards */}
      <section className="w-full bg-[#F7F9FF]">
        <div className="mx-auto max-w-[1120px] py-24 md:py-32">
          <div className="text-center">
            <p className="inline-block bg-primary-5 text-center text-xsmall16 font-medium text-primary-90">
              성과로 이어지는 렛츠커리어 서류 교육
            </p>
            <h2 className="mt-7 break-keep text-[40px] font-bold text-static-0">
              경험정리, 직무탐색부터 서류 완성 이후까지 관리
            </h2>
            <p className="text-1.125 mt-7 break-keep text-neutral-40">
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
        <div className="mx-auto max-w-[1120px] py-24 md:py-32">
          <p className="text-center text-xsmall16 font-medium text-primary-90">
            혹시 이런 고민들을 갖고 있지 않으신가요?
          </p>
          <h2 className="mt-7 break-keep text-center text-[40px] font-bold text-static-0">
            이런 고민을 갖고있는 교육 운영 담당자분들께 추천드려요
          </h2>
          <div className="mt-16">
            <PainPoints />
          </div>
        </div>
      </section>

      {/* Features/Programs */}
      <section className="w-full">
        <div className="mx-auto max-w-[1120px] py-24 md:py-32">
          <p className="text-center text-xsmall16 font-medium text-primary-90">
            렛츠커리어 취업 교육 솔루션
          </p>
          <h2 className="mt-7 break-keep text-center text-[40px] font-bold text-static-0">
            교육 기관의 목표에 맞는 최적의 교육을 제공합니다
          </h2>

          <div className="mt-24">
            <Features />
          </div>
        </div>
      </section>

      {/* Process section - Full width background */}
      <Process />

      {/* Case studies */}
      <section className="w-full">
        <div className="mx-auto max-w-[1120px] py-24 text-center md:py-32">
          <p className="text-xsmall16 font-medium text-primary-90">
            고객사 사례
          </p>
          <h2 className="mt-7 break-keep text-[40px] font-bold text-static-0">
            다양한 산업 및 직무, 목적에 맞춘
            <Break />
            렛츠커리어 취업교육 사례
          </h2>
          <p className="text-1.125 mt-7 break-keep text-neutral-40">
            렛츠커리어와 함께한 성공사례를 만나보세요.
          </p>

          <div className="mt-16">
            <CaseStudies />
          </div>
        </div>
      </section>

      {/* Mentors marquee */}
      <section className="w-full">
        <div className="mx-auto py-24 text-center md:py-32">
          <p className="text-xsmall16 font-medium text-primary-90">
            렛츠커리어 현직자 멘토
          </p>
          <h2 className="mt-7 break-keep text-[40px] font-bold text-static-0">
            다양한 산업·직무 현직자 멘토풀로, <Break />
            교육생에게 최신 합격 트렌드를 제공합니다.
          </h2>
          <p className="text-1.125 mt-7 break-keep text-neutral-40">
            렛츠커리어는 마케팅, PM, 개발등 다양한 직무의 현직자 멘토풀을
            보유하고 있습니다. <Break />
            현직자 멘토풀을 통해 교육생들에게 최신 합격 트렌드를 기반으로 한
            <Break />
            1:1 멘토링, 특강, 서류 첨삭을 제공합니다.
          </p>
          <div className="mt-16">
            <MentorMarquee />
          </div>
        </div>
      </section>

      {/* Testimonials - Students */}
      <section className="w-full bg-[#F7F9FF]">
        <div className="mx-auto max-w-[1120px] py-24 md:py-32">
          <StudentTestimonials />
        </div>
      </section>

      {/* Testimonials - Clients */}
      <section className="w-full bg-[#F7F9FF]">
        <div className="mx-auto max-w-[1120px] py-24 md:py-32">
          <ClientTestimonials />
        </div>
      </section>

      {/* Final CTA (inline, same as Hero) */}
      <section className="w-full bg-[#F7F9FF]">
        <div className="mx-auto max-w-[1120px] py-24 md:py-32">
          <FinalCTA />
        </div>
      </section>
    </main>
  );
}
