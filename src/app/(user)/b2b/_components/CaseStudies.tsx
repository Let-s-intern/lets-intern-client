'use client';

import CaseCard from './CaseCard';

import case01png from '../_images/case-01.png';
import case02png from '../_images/case-02.png';
import case03png from '../_images/case-03.png';
import case04png from '../_images/case-04.png';
import case05png from '../_images/case-05.png';
import case06png from '../_images/case-06.png';
import case07png from '../_images/case-07.png';
import case08png from '../_images/case-08.png';
import case09png from '../_images/case-09.png';
import case10png from '../_images/case-10.png';
import case11png from '../_images/case-11.png';
import case12png from '../_images/case-12.png';
import { LOGO } from '../_images/logos';

type CaseItem = {
  title: string;
  content: string;
  tags: string[];
  imageSrc: string;
  logoImageSrc: string;
};

const CASES: CaseItem[] = [
  {
    title: '[오즈코딩스쿨] 프로덕트 디자이너 올인원 캠프',
    content:
      '취업 특강 + 현직자 1:1 멘토링 + 커뮤니티 구성으로 이력서/자기소개서/포트폴리오 3일 완성',
    tags: ['KDT', '취업 특강', '멘토링', '커뮤니티'],
    imageSrc: case01png.src,
    logoImageSrc: LOGO['oz코딩스쿨'].src,
  },
  {
    title: '[랩포디엑스] LG전자 DX SCHOOL 2기',
    content:
      '챌린지 + 현직자 1:1 멘토링 + 취업 특강의 구성으로 이력서/자기소개서/포트폴리오 4주간 완성',
    tags: ['KDT', '챌린지', '취업 특강', '멘토링'],
    imageSrc: case02png.src,
    logoImageSrc: LOGO['labdx'].src,
  },
  {
    title: '[스나이퍼팩토리] 카카오클라우드로 배우는 AlaaS 마스터 클래스 1기',
    content:
      '챌린지 + 현직자 1:1 멘토링 + 취업 특강의 구성으로 이력서/자기소개서/포트폴리오 6주간 완성',
    tags: ['KDT', '챌린지', '취업 특강', '멘토링'],
    imageSrc: case03png.src,
    logoImageSrc: LOGO['sniperfactory'].src,
  },
  {
    title: '[스나이퍼팩토리] 한컴 AI 아카데미 1기',
    content:
      '챌린지 + 현직자 1:1 멘토링 + 취업 특강의 구성으로 이력서/자기소개서/포트폴리오 6주간 완성',
    tags: ['KDT', '챌린지', '취업 특강', '멘토링'],
    imageSrc: case04png.src,
    logoImageSrc: LOGO['sniperfactory'].src,
  },
  {
    title: '[한경닷컴] 디지털 마케팅 8기',
    content:
      '챌린지 + 현직자 1:1 멘토링 + 취업 특강의 구성으로 이력서/자기소개서/포트폴리오 4주간 완성',
    tags: ['KDT', '챌린지', '취업 특강', '멘토링', '서류 피드백'],
    imageSrc: case05png.src,
    logoImageSrc: LOGO['한경닷컴'].src,
  },
  {
    title: '[부산광역시] AI 브랜드 마케팅 마이크로 워커 양성 과정',
    content:
      '챌린지 + 현직자 1:1 멘토링 + 기업 프로젝트 구성으로 이력서/자기소개서/포트폴리오 9주간 완성',
    tags: ['챌린지', '멘토링', '기업 프로젝트'],
    imageSrc: case06png.src,
    logoImageSrc: LOGO['부산시'].src,
  },
  {
    title: '[러닝스푼즈] SeSAC 동작캠퍼스 서비스 기획 과정',
    content:
      '챌린지 + 취업 특강의 구성으로 이력서/자기소개서/포트폴리오 3주간 완성',
    tags: ['챌린지', '취업 특강'],
    imageSrc: case07png.src,
    logoImageSrc: LOGO['learn spoonz'].src,
  },
  {
    title: '[러닝스푼즈] SeSAC 광진캠퍼스 패션MD, 마케팅 과정',
    content:
      '챌린지 + 취업 특강의 구성으로 이력서/자기소개서/포트폴리오 3주간 완성',
    tags: ['챌린지', '취업 특강'],
    imageSrc: case08png.src,
    logoImageSrc: LOGO['learn spoonz'].src,
  },
  {
    title: '[한국교통대학교] ICT 오픈이노베이션 취업 교육',
    content: '챌린지 구성으로 이력서/자기소개서/포트폴리오 3주간 완성',
    tags: ['챌린지'],
    imageSrc: case09png.src,
    logoImageSrc: LOGO['한국교통대'].src,
  },
  {
    title: '[루트임팩트] AI 커리어스쿨',
    content:
      '렛츠커리어 풀 패키지 구성으로 300명 이상 대규모 취업 프로젝트 진행',
    tags: ['챌린지', '취업 특강', '멘토링', '커뮤니티'],
    imageSrc: case10png.src,
    logoImageSrc: LOGO['root impact'].src,
  },
  {
    title: '[러닝스푼즈] SeSAC 마포캠퍼스 서비스 기획 과정',
    content:
      '챌린지 + 취업 특강의 구성으로 이력서/자기소개서/포트폴리오 3주간 완성',
    tags: ['챌린지', '취업 특강'],
    imageSrc: case11png.src,
    logoImageSrc: LOGO['learn spoonz'].src,
  },
  {
    title: '[러닝스푼즈] SeSAC 양천캠퍼스 글로벌 BM/MD 과정',
    content:
      '챌린지 + 취업 특강의 구성으로 이력서/자기소개서/포트폴리오 3주간 완성',
    tags: ['챌린지', '취업 특강'],
    imageSrc: case12png.src,
    logoImageSrc: LOGO['learn spoonz'].src,
  },
];

export default function CaseStudies() {
  // 모바일: 짝/홀 인덱스로 두 줄 분리하여 각 줄 독립 스크롤
  const row1 = CASES.filter((_, i) => i % 2 === 0);
  const row2 = CASES.filter((_, i) => i % 2 === 1);

  return (
    <div>
      {/* Mobile (two independent horizontal rows) */}
      <div className="md:hidden">
        {/* Row 1 */}
        <div className="relative overflow-x-auto overflow-y-visible pb-3 scrollbar-hide">
          <div className="grid w-max auto-cols-[300px] grid-flow-col gap-3 px-[max(1.5rem,calc((100vw-1120px)/2))]">
            {row1.map((c, i) => (
              <CaseCard
                key={`r1-${i}`}
                title={c.title}
                content={c.content}
                tags={c.tags}
                imageSrc={c.imageSrc}
                logoImageSrc={c.logoImageSrc}
              />
            ))}
          </div>
        </div>
        {/* Row 2 */}
        <div className="relative overflow-x-auto overflow-y-visible pb-3 scrollbar-hide">
          <div className="grid w-max auto-cols-[300px] grid-flow-col gap-3 px-[max(1.5rem,calc((100vw-1120px)/2))]">
            {row2.map((c, i) => (
              <CaseCard
                key={`r2-${i}`}
                title={c.title}
                content={c.content}
                tags={c.tags}
                imageSrc={c.imageSrc}
                logoImageSrc={c.logoImageSrc}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Desktop (original 3-col grid) */}
      <div className="hidden grid-cols-3 gap-x-3 gap-y-6 md:grid">
        {CASES.map((c, i) => (
          <CaseCard
            key={i}
            title={c.title}
            content={c.content}
            tags={c.tags}
            imageSrc={c.imageSrc}
            logoImageSrc={c.logoImageSrc}
          />
        ))}
      </div>
    </div>
  );
}
