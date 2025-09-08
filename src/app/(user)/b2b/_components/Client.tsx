'use client';

import { Break } from '@components/Break';
import { motion } from 'motion/react';
import SectionHeader from './SectionHeader';
// TODO:
// - GTM 이벤트(뷰/클릭/제출/성공) 연결
// - OG 전용 이미지 생성/교체
// - search console 이나 네이버 등에 등록

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
import StickyCTA from './StickyCTA';
import StudentTestimonials from './StudentTestimonials';

export default function Client() {
  return (
    <main className="w-full text-neutral-900">
      {/* Hero */}
      <section className="relative w-full overflow-hidden md:pt-8">
        <motion.div
          className="relative mx-auto max-w-[1336px] rounded-none bg-cover bg-center px-4 pb-12 pt-36 md:rounded-lg md:py-36"
          style={{
            backgroundImage: `url("${heroBg.src}")`,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Hero />
        </motion.div>
      </section>

      {/* Intro copy + logo rail */}
      <section id="intro" className="w-full">
        <div className="mw-1180 py-16 md:py-32">
          <SectionHeader
            align="center"
            kicker="교육 파트너 소개"
            title={
              <>
                교육생의 취업을 원하는 기관이라면,
                <br />
                렛츠커리어를 선택했습니다
              </>
            }
            desc={
              <>
                다양한 부트캠프 운영 기관과 협력하여 교육생들의 취업 교육을
                담당했습니다.
                <Break /> 교육 파트너와 함께한 성과를 통해 렛츠커리어의 검증된
                취업 교육을 확인하세요.
              </>
            }
          />
          <motion.div
            className="mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '0px 0px -10% 0px' }}
            transition={{ duration: 0.6 }}
          >
            <LogoRail />
          </motion.div>
        </div>
      </section>

      {/* Metrics + cards */}
      <section className="w-full bg-[#F7F9FF]">
        <div className="mw-1180 py-16 md:py-32">
          <SectionHeader
            align="center"
            kicker="성과로 이어지는 렛츠커리어 서류 교육"
            kickerBg
            title={<>경험정리, 직무탐색부터 서류 완성 이후까지 관리</>}
            desc={
              <>
                수많은 취업준비생들과 교육 파트너가 렛츠커리어와 함께하는
                이유입니다.
              </>
            }
            className="text-balance"
          />
          <motion.div
            className="mt-10"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px 0px -10% 0px' }}
            transition={{ duration: 0.55 }}
          >
            <Metrics />
          </motion.div>
        </div>
      </section>

      {/* Pain points */}
      <section className="w-full">
        <div className="mw-1180 py-16 md:py-32">
          <SectionHeader
            align="center"
            kicker="혹시 이런 고민들을 갖고 있지 않으신가요?"
            title={<>이런 고민을 갖고 있는 교육 운영 담당자분들께 추천드려요</>}
          />
          <div className="mt-12 md:mt-16">
            <PainPoints />
          </div>
        </div>
      </section>

      {/* Features/Programs */}
      <section className="w-full">
        <div className="mw-1180 py-16 md:py-32">
          <SectionHeader
            align="center"
            kicker="렛츠커리어 취업 교육 솔루션"
            title={<>교육기관의 목표에 맞는 최적의 교육을 제공합니다</>}
          />

          <div className="mt-16 md:mt-24">
            <Features />
          </div>
        </div>
      </section>

      {/* Process section - Full width background */}
      <Process />

      {/* Case studies */}
      <section className="w-full bg-neutral-95">
        <div className="py-16 text-center md:py-32">
          <SectionHeader
            align="center"
            kicker="고객사 사례"
            title={
              <>
                다양한 산업 및 직무, 목적에 맞춘
                <Break />
                렛츠커리어 취업교육 사례
              </>
            }
            desc={<>렛츠커리어와 함께한 성공사례를 만나보세요.</>}
            className="mw-1180"
          />

          <motion.div
            className="md:mw-1180 pt-16"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px 0px -10% 0px' }}
            transition={{ duration: 0.55 }}
          >
            <CaseStudies />
          </motion.div>
        </div>
      </section>

      {/* Mentors marquee */}
      <section className="w-full">
        <div className="mx-auto py-16 text-center md:py-32">
          <SectionHeader
            align="center"
            kicker="렛츠커리어 현직자 멘토"
            title={
              <>
                다양한 산업·직무 현직자 멘토풀로, <Break />
                교육생에게 최신 합격 트렌드를 제공합니다.
              </>
            }
            desc={
              <>
                렛츠커리어는 마케팅, PM, 개발 등 다양한 직무의 현직자 멘토풀을
                보유하고 있습니다. <Break />
                현직자 멘토풀을 통해 교육생들에게 최신 합격 트렌드를 기반으로 한{' '}
                <Break />
                1:1 멘토링, 특강, 서류 첨삭을 제공합니다.
              </>
            }
            className="mw-1180"
          />
          <motion.div
            className="mt-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '0px 0px -10% 0px' }}
            transition={{ duration: 0.6 }}
          >
            <MentorMarquee />
          </motion.div>
        </div>
      </section>

      {/* Testimonials - Students */}
      <section className="w-full bg-[#F7F9FF]">
        <div className="mw-1180 py-16 md:py-32">
          <StudentTestimonials />
        </div>
      </section>

      {/* Testimonials - Clients */}
      <section className="w-full bg-[#0F1B42] text-white">
        <div className="mw-1180 py-16 md:py-32">
          <ClientTestimonials />
        </div>
      </section>

      {/* Final CTA (inline, same as Hero) */}
      <section className="w-full bg-white">
        <div className="mw-1180 py-16 md:py-32">
          <FinalCTA />
        </div>
      </section>

      {/* Sticky CTA */}
      <StickyCTA />
      <div className="h-32 md:h-40" />
    </main>
  );
}
