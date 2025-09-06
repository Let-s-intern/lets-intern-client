'use client';

import Image from 'next/image';

type Mentor = {
  name: string;
  role: string;
  company?: string;
  imageSrc?: string;
};

const MENTORS: Mentor[] = [
  { name: '쥬디 멘토', role: '렙츠커리어 CEO' },
  { name: '팀탐 멘토', role: '렙츠커리어 COO' },
  { name: '레오 멘토', role: '렙츠커리어 CPO' },
  { name: '소피아 멘토', role: 'LG에너지솔루션', company: '전략기획' },
  { name: '크리스 멘토', role: '신한투자증권', company: '금융업,IB' },
  { name: '브라이언 멘토', role: 'HD현대일렉트릭', company: '해외영업' },
  { name: '우디 멘토', role: '기아차', company: '브랜드 마케팅' },
  { name: '헤일리 멘토', role: '현대자동차', company: '글로벌 커뮤니케이션' },
  { name: '줄리아 멘토', role: '현대자동차', company: '상품전략' },
  { name: '이프썜 멘토', role: 'SK이노베이션', company: '마케팅' },
  { name: '휴고 멘토', role: '현대자동차', company: '상품기획' },
  { name: '하이디 멘토', role: '토스', company: '세일즈' },
  { name: '이린 멘토', role: '캐시노트', company: '마케팅' },
  { name: '벤자민 멘토', role: 'BCG', company: '컨설턴트' },
  { name: '유나 멘토', role: '현대코퍼레이션', company: 'PM' },
  { name: '미니 멘토', role: '한국타이어', company: 'HR' },
  { name: '세라 멘토', role: '한화오션', company: '해외영업' },
  { name: '쥬쌤 멘토', role: 'SK하이닉스', company: '영업마케팅' },
  { name: '루크 멘토', role: '삼일PwC', company: 'ESG 컨설턴트' },
  { name: '후추썜 멘토', role: '대학내일', company: 'AE' },
  { name: '영 멘토', role: '뤼튼테크놀로지스', company: 'AI개발' },
  { name: '파도 멘토', role: '뤼튼테크놀로지스', company: '서비스 기획' },
  { name: 'Seren 멘토', role: '현대로템', company: 'AI데이터사이언티스트' },
  { name: '도니 멘토', role: '무신사', company: '백엔드 개발자' },
  { name: '제이 멘토', role: '무신사', company: '백엔드 개발자' },
  { name: '찰스 멘토', role: '삼성전자', company: '반도체 엔지니어링' },
  { name: '머스캣 멘토', role: '삼성바이오로직스', company: '공정엔지니어링' },
  { name: '길라잡이 멘토', role: 'LG디스플레이', company: 'AI개발' },
  { name: '루카 멘토', role: 'DB Inc', company: 'SW 엔지니어' },
  { name: '준 멘토', role: '현대자동차', company: 'IT 서비스 기획' },
];

function Row({ reverse = false }: { reverse?: boolean }) {
  const items = [...MENTORS, ...MENTORS];
  return (
    <div className="overflow-hidden">
      <div
        className={`flex w-max gap-4 ${reverse ? 'marquee-right' : 'marquee-left'}`}
      >
        {items.map((m, idx) => (
          <div
            key={`${m.name}-${idx}`}
            className="flex w-[260px] flex-none items-center gap-3 rounded-xl bg-white p-4 shadow-sm"
          >
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-neutral-200">
              {m.imageSrc ? (
                <Image
                  src={m.imageSrc}
                  alt={m.name}
                  fill
                  className="object-cover"
                />
              ) : null}
            </div>
            <div className="min-w-0">
              <div className="truncate text-xsmall16 font-semibold text-neutral-0">
                {m.name}
              </div>
              <div className="truncate text-xsmall14 text-neutral-40">
                {m.role}
                {m.company ? ` · ${m.company}` : ''}
              </div>
            </div>
          </div>
        ))}
      </div>
      <style jsx>{`
        @keyframes marquee-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        @keyframes marquee-right {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }
        .marquee-left {
          animation: marquee-left 30s linear infinite;
        }
        .marquee-right {
          animation: marquee-right 30s linear infinite;
        }
      `}</style>
    </div>
  );
}

export default function MentorMarquee() {
  return (
    <div className="space-y-4">
      <Row />
      <Row reverse />
    </div>
  );
}
