'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';

import SectionHeading from '@/domain/pass-certification/components/SectionHeading';

/**
 * 후기 말풍선.
 * 뷰 진입 시 index 순서대로 시간차 등장(스태거).
 */
function Bubble({
  label,
  tail = 'left',
  inView,
  index,
  children,
}: {
  label: string;
  tail?: 'left' | 'right';
  inView: boolean;
  index: number;
  children: ReactNode;
}) {
  return (
    <div
      style={{ transitionDelay: `${index * 120}ms` }}
      className={`flex flex-col transition-[opacity,transform] duration-700 ease-out md:drop-shadow-[0_0_6px_rgba(77,85,245,0.3)] ${
        inView ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
      }`}
    >
      <div className="bg-primary-5 flex flex-col gap-3 rounded-xl p-5 md:gap-4 md:px-10 md:py-8">
        <p className="text-xsmall14 text-neutral-40 font-light">{label}</p>
        <p className="text-xsmall16 md:text-small18 text-neutral-10 leading-relaxed tracking-[-0.12%]">
          {children}
        </p>
      </div>
      <span
        aria-hidden
        className={`bg-primary-5 -mt-px hidden h-6 w-6 [clip-path:polygon(0_0,100%_0,50%_100%)] md:block ${
          tail === 'right' ? 'mr-9 self-end' : 'ml-9 self-start'
        }`}
      />
    </div>
  );
}

/** 렛츠커리어 팀의 진심 (후기 말풍선) 섹션 */
export default function TeamVoiceSection() {
  const bubblesRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = bubblesRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section>
      <div className="mx-auto flex max-w-[1040px] flex-col items-center gap-4 px-5 py-10 md:gap-10 md:px-0 md:py-20">
        <SectionHeading
          label="렛츠커리어 팀의 진심"
          title={
            <>
              여러분의 합격 후기로
              <br />
              렛츠커리어는 오늘도 달립니다
            </>
          }
          description="5분이면 저희 팀원들의 하루를 특별하게 만들어주실 수 있어요!"
        />

        <div
          ref={bubblesRef}
          className="flex w-full flex-col gap-4 md:flex-row md:gap-10"
        >
          {/* 좌측 컬럼 */}
          <div className="flex min-w-0 flex-1 flex-col gap-4 md:gap-10">
            <Bubble
              label="인스타 DM으로 합격 소식 받은 마케팅팀 클로버"
              tail="right"
              inView={inView}
              index={0}
            >
              &ldquo;합격자 인터뷰에서 렛츠커리어에게 고맙다고 하신 유저 분을
              봤을 때, 저 진짜{' '}
              <strong className="font-medium">뿌듯해서 날아가버리는</strong> 줄
              알았어요..ㅋㅋ&rdquo;
            </Bubble>
            <Bubble
              label="프로그램 후기를 확인한 개발팀 레오"
              tail="right"
              inView={inView}
              index={2}
            >
              &ldquo;미루던 자소서를 끝냈다는 한마디만으로도{' '}
              <strong className="font-medium">
                다음 프로그램을 더 잘 만들 힘이 생겨요.
              </strong>
              &rdquo;
            </Bubble>
          </div>

          {/* 우측 컬럼 */}
          <div className="flex min-w-0 flex-1 flex-col gap-4 md:gap-10">
            <Bubble
              label="렛츠컨 스터디 합격자에 감격한 운영팀 윈터"
              inView={inView}
              index={1}
            >
              &ldquo;제가 만든 스터디에서 합격자가 나오다니.. 오늘도 힘내서
              달립니다!&rdquo;
            </Bubble>
            <Bubble
              label="합격자 인터뷰하다가 울컥한 마케팅팀 마리"
              inView={inView}
              index={3}
            >
              &ldquo;어떻게 하면 렛츠커리어에 더 도움이 될지 고민해오셨다는 말에
              진짜 울컥했어요ㅠㅠ <br />
              여러분의{' '}
              <strong className="font-medium">
                합격 소식이 자양강장제고 도파민입니다..
              </strong>{' '}
              과장이 아니고 진짜요..&rdquo;
            </Bubble>
          </div>
        </div>

        <p className="text-primary text-xsmall14 md:text-small18 text-center font-semibold">
          우리, 기다려요. 합격 후기를, 많이, 오래도록, 진짜진짜.
        </p>
      </div>
    </section>
  );
}
