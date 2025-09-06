'use client';

import { Break } from '@components/Break';
import Image from 'next/image';
import { LOGO } from '../_images/logos';

type StudentReview = {
  studentInfo: {
    name: string;
    company: string;
    result: string;
    course: string;
  };
  mainReview: string;
  detailedReview: string;
  program: string;
  logo: string;
};

const STUDENT_REVIEWS: StudentReview[] = [
  {
    studentInfo: {
      name: '황**',
      company: '현대카드',
      result: '1차 합격',
      course: '한컴 AI 아카데미 1기 교육생',
    },
    mainReview: '스스로를 성찰하며 서류를 작성할 수 있는 기회가 되었습니다.',
    detailedReview:
      '입사서류를 어디서부터 어떻게 작성해야 할지 몰랐던 제가 렛츠커리어를 통해 차근차근 기억을 되짚어 가며 서류를 완성할 수 있었고, 또한 스스로를 성찰할 수 있도록 기회를 만들어줬습니다 :)',
    program: '렛츠커리어 현직자 1:1 멘토링 및 서류 3종 작성 교육 수강',
    logo: LOGO['현대카드'].src,
  },
  {
    studentInfo: {
      name: '유**',
      company: 'LG전자',
      result: '합격',
      course: 'LG전자 DX스쿨 2기 교육생',
    },
    mainReview: '서류 작성의 틀을 알게 되었습니다.',
    detailedReview:
      '렛츠커리어에서 서류 교육을 하실 때마다, 꼼꼼하게 조언해주시고, 진심을 다해 수료생의 취업 준비에 도움을 주시는 것이 느껴져 감사했습니다.',
    program: '렛츠커리어 서류 3종 작성 교육 수강',
    logo: LOGO['LG전자'].src,
  },
  {
    studentInfo: {
      name: '박**',
      company: '롯데건설',
      result: '합격',
      course: 'LG전자 DX스쿨 2기 교육생',
    },
    mainReview: '현직자 멘토님을 통해 많은 도움을 받았습니다.',
    detailedReview:
      '자기소개서 첨삭에서 많은 도움을 받았습니다. 현직자 멘토님께서 항상 관심 갖고 조언해 주셔서 좋았습니다.',
    program: '렛츠커리어 서류 3종 작성 교육 수강',
    logo: LOGO['롯데건설'].src,
  },
  {
    studentInfo: {
      name: '이**',
      company: '스펙터',
      result: '합격',
      course: 'LG전자 DX스쿨 2기 교육생',
    },
    mainReview:
      '렛츠커리어 덕분에 프로젝트 성과를 구체적으로 표현할 수 있었어요.',
    detailedReview:
      '막상 포트폴리오에 어떻게 써야 할지 몰랐던 경험을 렛츠커리어 교육에서 STAR 기법으로 풀어내는 방법을 배우니 부트캠프에서 진행했던 팀 프로젝트 성과를 구체적으로 설명할 수 있습니다.',
    program: '렛츠커리어 서류 3종 작성 교육 수강',
    logo: LOGO['스펙터'].src,
  },
  {
    studentInfo: {
      name: '박**',
      company: '에코마케팅',
      result: '합격',
      course: 'LG전자 DX스쿨 2기 교육생',
    },
    mainReview:
      '렛츠커리어 교육 중에 어느 것 하나 필요하지 않은 내용이 없었습니다.',
    detailedReview:
      '이력서/자소서 수업, 커피챗 등등 현재 회사에 들어가 보니 그때 당시에는 굳이 해야 하는 수업인가 생각했지만 렛츠커리어 교육들이 유익하고 더 열심히 할걸이라는 후회가 남을 정도로 다방면으로 알게 되어 너무너무 좋은 기회였습니다!!',
    program: '렛츠커리어 서류 3종 작성 교육 수강',
    logo: LOGO['에코마케팅'].src,
  },
  {
    studentInfo: {
      name: '박**',
      company: '올포기어 AMD',
      result: '합격',
      course: '[러닝스푼즈] SeSAC 광진캠퍼스 패션MD, 마케팅 과정 교육생',
    },
    mainReview: '경험정리가 제일 중요하다는 것을 처음으로 알게 되었어요!',
    detailedReview:
      '꼼꼼히 경험정리를 봐주시고 피드백해 주셔서 감사합니다. 실제로 해당 내용을 반영해 경험정리를 잘해서 취업할 수 있었습니다. 감사합니다.',
    program: '렛츠커리어 현직자 1:1 멘토링 및 서류 3종 작성 교육 수강',
    logo: LOGO['올포기어'].src,
  },
  {
    studentInfo: {
      name: '황**',
      company: '키스템프그룹',
      result: '합격',
      course: '[러닝스푼즈] SeSAC 광진캠퍼스 패션MD, 마케팅 과정 교육생',
    },
    mainReview:
      '지금까지의 경험과 부트캠프의 새로운 경험을 바탕으로 서류를 완성할 수 있었습니다.',
    detailedReview:
      '과거의 경험을 다시 정리할 수 있었던 시간이었습니다. 그리고 새로운 경험을 추가해 이력서를 한층 더 업그레이드할 수 있었습니다.',
    program: '렛츠커리어 현직자 1:1 멘토링 및 서류 3종 작성 교육 수강',
    logo: LOGO['키스템프'].src,
  },
  {
    studentInfo: {
      name: '정**',
      company: '마플코퍼레이션',
      result: '합격',
      course: '제로베이스 마케팅 스쿨 교육생',
    },
    mainReview: '렛츠커리어 챌린지 덕분에 끝까지 서류를 완성할 수 있었습니다.',
    detailedReview:
      '부트캠프 수료 후 혼자 서류를 작성하려니 완성하기 어려웠습니다. 하지만 렛츠커리어 챌린지는 단계별 미션과 리워드가 있어 동기 부여가 되었고, 끝까지 제 경험을 정리하며 서류를 완성할 수 있었습니다.',
    program: '렛츠커리어 포트폴리오 완성 챌린지 9-10기 수강',
    logo: LOGO['마플코퍼레이션'].src,
  },
  {
    studentInfo: {
      name: '정**',
      company: '사이클로이드',
      result: '합격',
      course: '코드스테이츠 PM 부트캠프 교육생',
    },
    mainReview:
      '렛츠커리어 챌린지로 부트캠프 경험이 필살 경험으로 재탄생했습니다.',
    detailedReview:
      '렛츠커리어 챌린지에서 경험을 직무 역량과 연결하는 훈련을 하면서 그저 활동 기록이 아닌 저만의 강점 스토리로 완성할 수 있었고, 실제 서비스 운영 직무 합격으로 이어졌습니다.',
    program: '렛츠커리어 포트폴리오 완성 챌린지 11기 수강',
    logo: LOGO['사이클로이드'].src,
  },
  {
    studentInfo: {
      name: '손**',
      company: '어글리어스',
      result: '합격',
      course: '국비지원 SW 웹개발 기초반 교육생',
    },
    mainReview:
      '렛츠커리어 현직자 멘토님의 피드백 덕분에 합격할 수 있었습니다.',
    detailedReview:
      '혼자 서류를 작성할 때는 제 경험이 제대로 드러나지 않았지만, 렛츠커리어 현직자 멘토님이 직접 제 서류를 피드백해 주신 덕분에 조언을 반영해 완성한 서류로 지원했고, 결국 합격이라는 결과를 얻을 수 있었습니다.',
    program: '렛츠커리어 기필코 경험정리 챌린지 26기 수강',
    logo: LOGO['어글리어스'].src,
  },
];

function StudentCard({ review }: { review: StudentReview }) {
  return (
    <article className="overflow-hidden rounded-lg bg-white p-5 pt-2.5">
      {/* Logo */}
      <div className="mb-2 flex items-center justify-start border-b border-neutral-95">
        <Image
          src={review.logo}
          alt={review.studentInfo.company}
          width={140}
          height={48}
          className="h-12 w-auto object-contain"
        />
      </div>
      {/* Student Info */}
      <p className="mb-2 break-keep rounded-xxs bg-primary-5 px-1.5 py-1 text-xsmall14 font-semibold text-primary-dark">
        {review.studentInfo.name} / {review.studentInfo.company}{' '}
        {review.studentInfo.result} / {review.studentInfo.course}
      </p>

      {/* Main Review */}
      <h3 className="mb-1.5 break-keep text-small18 font-semibold text-neutral-0">
        {review.mainReview}
      </h3>

      {/* Detailed Review */}
      <p className="mb-2 break-keep text-xsmall16 leading-relaxed text-neutral-20">
        {review.detailedReview}
      </p>

      {/* Program */}
      <p className="text-xsmall14 font-semibold text-neutral-0">
        {review.program}
      </p>
    </article>
  );
}

export default function StudentTestimonials() {
  return (
    <div>
      <p className="text-center text-xsmall16 font-medium text-primary-90">
        교육생 합격 후기
      </p>
      <h2 className="mt-7 break-keep text-center text-[40px] font-bold text-static-0">
        부트캠프의 소중한 경험이 <Break />
        합격에 필살 경험이 되도록
      </h2>

      {/* Student Review Cards - Horizontal Scroll */}
      <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] mt-16 w-screen">
        <div className="relative overflow-x-auto scrollbar-hide">
          <div className="grid w-max auto-cols-[360px] grid-flow-col gap-3 px-[max(1.5rem,calc((100vw-1120px)/2))]">
            {STUDENT_REVIEWS.map((review, index) => (
              <StudentCard key={index} review={review} />
            ))}
          </div>
        </div>
        {/* Left fade */}
        <div className="pointer-events-none absolute left-0 top-0 h-full w-16 bg-gradient-to-r from-white to-transparent"></div>
        {/* Right fade */}
        <div className="pointer-events-none absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-white to-transparent"></div>
      </div>
    </div>
  );
}
