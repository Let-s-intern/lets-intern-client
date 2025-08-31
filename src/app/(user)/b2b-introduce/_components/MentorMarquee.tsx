'use client';

import Image from 'next/image';

type Mentor = {
  name: string;
  role: string;
  company?: string;
  imageSrc?: string;
};

const MENTORS: Mentor[] = [
  { name: '김OO', role: '데이터 애널리스트', company: '테크스타트업' },
  { name: '박OO', role: '그로스 마케터', company: '이커머스' },
  { name: '이OO', role: '프로덕트 매니저', company: '핀테크' },
  { name: '정OO', role: '퍼포먼스 마케터', company: '에드테크' },
  { name: '최OO', role: 'CRM 마케터', company: '모빌리티' },
  { name: '윤OO', role: '데이터 엔지니어', company: '게임' },
];

function Row({ reverse = false }: { reverse?: boolean }) {
  const items = [...MENTORS, ...MENTORS];
  return (
    <div className="overflow-hidden">
      <div className={`flex w-max gap-4 ${reverse ? 'marquee-right' : 'marquee-left'}`}>
        {items.map((m, idx) => (
          <div
            key={`${m.name}-${idx}`}
            className="flex w-[260px] flex-none items-center gap-3 rounded-xl bg-white p-4 shadow-sm"
          >
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-neutral-200">
              {m.imageSrc ? (
                <Image src={m.imageSrc} alt={m.name} fill className="object-cover" />
              ) : null}
            </div>
            <div className="min-w-0">
              <div className="truncate text-xsmall16 font-semibold text-neutral-0">{m.name}</div>
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
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
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

