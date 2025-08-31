'use client';

import CaseCard from './CaseCard';

type CaseItem = {
  company: string;
  title: string;
  desc: string;
  imageSrc?: string;
};

const CASES: CaseItem[] = [
  {
    company: 'KOSME',
    title: '온라인 수출기업 데이터 분석 교육',
    desc: '데이터 기반 마케팅 전략 수립 및 성과 분석 역량 강화 교육',
  },
  {
    company: '멋쟁이사자처럼',
    title: '그로스 마케팅 부트캠프 및 데이터 분석 교육',
    desc: '데이터 기반 Growth Cycle 설계, 실습을 통한 실무 역량 강화',
  },
  {
    company: 'IKEA',
    title: '데이터 피드 설계 및 고객 여정 분석 교육',
    desc: '사용자 행동패턴에 따른 고객 여정 데이터 피드 설계 및 실무 교육',
  },
  {
    company: 'CODIT',
    title: 'Google Ads(구글애드) 실무 교육',
    desc: '구글애드 성과 최적화를 위한 맞춤형 전략 및 실무 활용 교육',
  },
  {
    company: '한남대학교',
    title: '예비 마케터를 위한 디지털 마케팅 교육',
    desc: '데이터 분석 실무 역량 함양을 위한 디지털 통합 마케팅 교육',
  },
  {
    company: '프리티',
    title: '사내 디지털 마케팅 및 데이터 분석 교육',
    desc: '디지털 마케팅 주요 채널 이해 및 데이터 기반 성과 분석 교육',
  },
];

export default function CaseStudies() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {CASES.map((c, i) => (
        <CaseCard
          key={i}
          company={c.company}
          title={c.title}
          desc={c.desc}
          imageSrc={c.imageSrc}
        />
      ))}
    </div>
  );
}
