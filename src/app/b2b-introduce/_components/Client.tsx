'use client';

import { useState } from 'react';
import CTAButton from './CTAButton';
import Metrics from './Metrics';
import PainPoints from './PainPoints';
import Features from './Features';
import FinalCTA from './FinalCTA';
import LeadModal from './LeadModal';

export default function Client() {
  const [open, setOpen] = useState(false);
  return (
    <main className="w-full text-neutral-900">
      {/* Hero */}
      <section className="w-full bg-gradient-to-b from-[#F7F9FF] to-white">
        <div className="mw-1180 py-16 md:py-24">
          <div className="flex flex-col items-start gap-6">
            <div className="flex items-center gap-2 text-0.875-medium text-neutral-500">
              <span className="rounded-full bg-white px-3 py-1 shadow-sm">프로토콜</span>
              <span className="rounded-full bg-white px-3 py-1 shadow-sm">이력서</span>
              <span className="rounded-full bg-white px-3 py-1 shadow-sm">자기소개서</span>
            </div>
            <h1 className="text-2.25-semibold tracking-tight">
              합격으로 이어지는 서류,
              <br className="hidden md:block" /> 렛츠커리어가 설계합니다
            </h1>
            <p className="text-1.125 text-neutral-600 max-w-2xl">
              직무별 취업시장 인사이트를 반영하고, 직업전문가의 직접 검수를
              거쳐 작성된 이력서/자기소개서가 그대로 합격으로 이어집니다.
            </p>
            <div className="flex flex-wrap gap-3">
              <CTAButton onClick={() => setOpen(true)}>맞춤 견적 문의</CTAButton>
              <a
                href="#intro"
                className="rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-1-medium hover:bg-neutral-50"
              >
                기업 소개서 보기
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Intro copy + mock logo rail */}
      <section id="intro" className="w-full">
        <div className="mw-1180 py-16 md:py-20">
          <div className="text-center">
            <p className="text-1.5-medium text-neutral-500 mb-3">고객 파트너 소개</p>
            <h2 className="text-1.75-semibold">
              교육생의 취업을 원하는 기관이라면,
              <br className="hidden md:block" /> 렛츠커리어를 선택했습니다
            </h2>
            <p className="mt-4 text-1.125 text-neutral-600">
              다양한 배경과 목표를 가진 기관과 협력하여 교육생의 직진 고용을 돕고
              있습니다. 실제 데이터를 바탕으로 설계/집행하여 만족도와 성과를 함께
              이끌어냅니다.
            </p>
          </div>
          <div className="mt-10 rounded-xl bg-neutral-100/80 p-8">
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-14 rounded-md bg-neutral-200/90" aria-hidden />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Metrics + cards */}
      <section className="w-full bg-[#F7F9FF]">
        <div className="mw-1180 py-16 md:py-24">
          <div className="text-center">
            <p className="text-0.875-medium text-[#6E7AFF]">입소문 이어지는 렛츠커리어 서류/교육</p>
            <h2 className="mt-3 text-1.75-semibold">경험정리, 직무탐색부터 서류 완성 이후까지 관리</h2>
            <p className="mt-3 text-1.125 text-neutral-600">
              수많은 취업 준비생과 교육 파트너가 렛츠커리어와 함께하는 이유입니다.
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
          <p className="text-0.875-medium text-[#6E7AFF] text-center">혹시 이런 고민들로 고개 끄덕이셨나요?</p>
          <h2 className="mt-3 text-1.5-semibold text-center">
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
          <p className="text-0.875-medium text-[#6E7AFF] text-center">설정하신 목표에 맞춘 교육 설계</p>
          <h2 className="mt-3 text-1.5-semibold text-center">교육 기관의 목표에 맞는 최적의 교육을 제공합니다</h2>
          <div className="mt-12">
            <Features />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="w-full bg-[#F7F9FF]">
        <div className="mw-1180 py-16 md:py-24">
          <FinalCTA onClick={() => setOpen(true)} />
        </div>
      </section>

      <LeadModal open={open} onClose={() => setOpen(false)} />
    </main>
  );
}

