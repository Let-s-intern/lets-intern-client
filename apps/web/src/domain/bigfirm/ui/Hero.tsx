'use client';

import { Nanum_Pen_Script } from 'next/font/google';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import styles from '../bigfirm.module.css';
import { LETSCAREER_MENTORING_URL } from '../data/links';

// 서류 위 손글씨 메모용. 한글 글리프가 커서 미리 불러오지 않는다
const nanumPen = Nanum_Pen_Script({
  weight: '400',
  preload: false,
  display: 'swap',
});

const BADGES = [
  '대기업 현직 멘토 9명',
  '실시간 1:1 멘토링',
  'PM·마케팅·AI 등 4개 직무',
];

export function Hero() {
  const brandLineRef = useRef<HTMLSpanElement>(null);
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const docRef = useRef<HTMLElement>(null);

  // 서류 이미지: 위 끝은 제목 둘째 줄(대기업 현직자에게), 아래 끝은 버튼 아래 끝에 맞춘다 (2단 레이아웃일 때만)
  useEffect(() => {
    const doc = docRef.current;
    const brandLine = brandLineRef.current;
    const button = buttonRef.current;
    if (!doc || !brandLine || !button) return;

    const twoColumn = window.matchMedia('(min-width: 901px)');
    const fit = () => {
      doc.style.minHeight = '';
      if (!twoColumn.matches) return;
      const height =
        button.getBoundingClientRect().bottom -
        brandLine.getBoundingClientRect().top;
      if (height > 0) doc.style.minHeight = `${Math.round(height)}px`;
    };

    fit();
    window.addEventListener('resize', fit);
    document.fonts?.ready.then(fit);
    return () => window.removeEventListener('resize', fit);
  }, []);

  return (
    <section className={`${styles.heroBg} overflow-hidden`}>
      <div className="mx-auto grid max-w-[1080px] items-end gap-11 px-5 pb-16 pt-[3.25rem] min-[901px]:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] min-[901px]:gap-14 min-[901px]:pb-[72px] min-[901px]:pt-14">
        <div>
          <h1 className="text-[clamp(32px,4.8vw,48px)] font-extrabold leading-[1.3]">
            또 떨어지기 전,
            <br />
            <span ref={brandLineRef} className="text-primary">
              대기업 현직자에게
            </span>
            <br />
            탈락 이유를 확인해보세요
          </h1>
          <div className="mt-9 flex flex-wrap gap-2">
            {BADGES.map((badge) => (
              <span
                key={badge}
                className="rounded-full border border-white/85 bg-white/55 px-3 py-1.5 text-[13px] font-bold text-[#575757]"
              >
                {badge}
              </span>
            ))}
          </div>
          <p className="mt-3 max-w-[30em] text-[17px] leading-[1.7] text-[#575757]">
            떨어진 서류와 그때의 고민을 그대로 가져오세요.
            <br />
            실시간 1:1 심층 분석으로, 다음 지원 전에 무엇을 고칠지 함께
            정해드려요.
          </p>
          <div className="mt-9 flex flex-wrap gap-2.5">
            <a
              ref={buttonRef}
              href="#mentors-by-company"
              className="bg-primary inline-flex items-center justify-center rounded-sm px-7 py-[15px] font-bold text-white hover:brightness-105 active:scale-[.98]"
            >
              대기업 멘토 찾기
            </a>
            <Link
              href={LETSCAREER_MENTORING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary inline-flex items-center justify-center rounded-sm bg-white px-7 py-[15px] font-bold shadow-[inset_0_0_0_1px_#e3e5f0] hover:bg-zinc-50 active:scale-[.98]"
            >
              전체 멘토 보기 →
            </Link>
          </div>
        </div>

        <RejectedDocument docRef={docRef} />
      </div>
    </section>
  );
}

const NOTE = `${nanumPen.className} absolute rounded-md bg-white text-[22px] leading-[1.15]`;

function RejectedDocument({
  docRef,
}: {
  docRef: React.RefObject<HTMLElement>;
}) {
  return (
    <div
      className="relative"
      aria-label="멘토가 탈락한 자기소개서에 남긴 코멘트 예시"
    >
      <article
        ref={docRef}
        className="rounded-xs relative flex origin-bottom-left -rotate-[1.5deg] flex-col bg-[#fffdf8] px-7 pb-6 pt-6 text-sm leading-[1.75] text-[#26262b] shadow-[0_24px_50px_-20px_rgba(40,50,140,.28)]"
      >
        <div className="mb-5 flex items-baseline justify-between gap-3 border-b border-[#e4e0d4] pb-2.5 text-xs text-[#77777f]">
          <b className="text-[13px] text-[#26262b]">
            2026 하반기 신입 공채 · 자기소개서
          </b>
          <span>2번 문항</span>
        </div>
        <span className="absolute right-5 top-[22px] rotate-[8deg] rounded-sm border-4 border-double border-[#d8432a] px-4 py-1.5 text-[22px] font-extrabold leading-[1.3] tracking-[.1em] text-[#d8432a] opacity-85">
          서류 불합격
        </span>
        <p className="mb-3 text-[13px] font-bold text-[#4a4a52]">
          Q. 본인이 주도적으로 문제를 해결한 경험을 기술하시오. (700자)
        </p>
        <p>
          <span className="text-[#8a8a90] line-through decoration-[#e8553a] decoration-2">
            저는 어릴 때부터 책임감이 강하다는 말을 자주 들었습니다.
          </span>{' '}
          대학교 3학년 때 학회 운영진으로 활동하며 신입 회원 이탈 문제를
          겪었습니다.
        </p>
        <p className="mt-2">
          저는{' '}
          <span className="-mx-1 rounded-[50%/60%] border-2 border-[#e8553a] px-1">
            소통의 중요성
          </span>
          을 깨닫고 회원들과 적극적으로 대화했고, 그 결과{' '}
          <span className="bg-[linear-gradient(transparent_58%,rgba(254,128,100,.35)_58%)]">
            분위기가 좋아지고 많은 회원이 남게 되었습니다.
          </span>
        </p>
        <p className="mt-2">
          이 과정에서 저는 리더십과 책임감을 기를 수 있었고, 어떤 어려움이
          있어도 포기하지 않고 끝까지 노력하는 자세가 중요하다는 것을
          배웠습니다.
        </p>
        <p className="mt-2">
          이 경험을 통해 귀사에서도 주도적으로 문제를 해결하는 인재가
          되겠습니다.
        </p>
        <p className="mt-auto border-t border-[#e4e0d4] pt-2.5 text-right text-xs tabular-nums text-[#77777f]">
          642 / 700자
        </p>
      </article>
      <div
        className={`${NOTE} -right-1.5 top-[82px] max-w-[260px] rotate-2 px-3.5 pb-2 pt-2.5 text-[#e8553a] shadow-[0_0_24px_-6px_rgba(10,15,80,.4)] min-[901px]:-right-[18px] min-[901px]:top-[91px]`}
      >
        이 표현은 지원자 절반이
        <br />
        똑같이 쓰는 말이에요
      </div>
      <div
        className={`${NOTE} -left-1.5 bottom-[106px] max-w-[260px] -rotate-3 px-3.5 pb-2 pt-2.5 text-[#3a46e0] shadow-[0_0_24px_-6px_rgba(10,15,80,.4)] min-[901px]:-left-[26px] min-[901px]:bottom-[70px]`}
      >
        추상적이에요.
        <br />
        &quot;많은 회원&quot; 대신 숫자로 써주세요
      </div>
    </div>
  );
}
