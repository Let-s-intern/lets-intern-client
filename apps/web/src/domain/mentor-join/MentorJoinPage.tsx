import Link from 'next/link';
import Image from 'next/image';
import type { ReactNode } from 'react';
import { ChallengeShowcase } from './ui/ChallengeShowcase';
import { ProgramScroller } from './ui/ProgramScroller';
import { Faq } from './ui/Faq';
import {
  featuredSeminarPreview,
  getChallengeHighlights,
  getMentoringHighlights,
  getSeminarHighlights,
  getVodHighlights,
} from './data/programHighlights';
import {
  KAKAO_CHAT_URL,
  MENTOR_APPLY_PATH,
  LETSCAREER_MENTORING_URL,
  LETSCAREER_SEMINAR_URL,
  LETSCAREER_VOD_URL,
} from './data/links';

// 아래로 갈수록 진해지는 말풍선. 마지막 흰 말풍선이 캐릭터의 대답
const MOTIVATIONS = [
  {
    lines: ['사람이 좋아요!', '고민을 듣고 성장하는 과정을 지켜보고 싶어요'],
    row: 'items-start sm:pr-[100px]',
    bubble: 'bg-[#edeefe]/50 text-[#27272d]',
  },
  {
    lines: [
      '힘들었던 취업 준비 시절,',
      '선배님들께 받았던 도움을 후배들에게 돌려주고 싶어요',
    ],
    row: 'items-end',
    bubble: 'bg-[#edeefe]/70 text-[#27272d]',
  },
  {
    lines: [
      '쌓아온 여러 성공 경험을 토대로',
      '나만의 커리어 브랜드와 영향력을 만들고 싶어요',
    ],
    row: 'items-start sm:pr-[100px]',
    bubble: 'bg-[#edeefe] text-[#27272d]',
  },
  {
    lines: ['퇴근 후 가능한 시간에 부업을 하고 싶어요'],
    row: 'items-end sm:pr-5',
    bubble: 'bg-[#95b3ff] text-black',
  },
  {
    lines: [
      '멘토 활동을 통해 직무에 대한 나의 지식과 경험을',
      '후배들에게 나누고 함께 성장하고 싶어요!',
    ],
    row: 'items-center',
    bubble: 'bg-white text-black sm:py-8',
  },
];

const VALUES = [
  {
    name: 'Reliable',
    summary: '믿고 커리어 고민을 함께해요',
    lines: [
      '앞으로의 커리어 방향을',
      '고민하고 결정하는데 있어',
      '신뢰할 수 있는 정보와 경험',
    ],
  },
  {
    name: 'Motivating',
    summary: '해내고 싶다는 마음이 들게 해요',
    lines: [
      '챌린지를 기반으로 한 미션을 통해',
      '취업 준비생이 포기하지 않고',
      '목표를 달성할 수 있도록 동기부여',
    ],
  },
  {
    name: 'Supportive',
    summary: '불안감과 위화감을 조성하지 않아요',
    lines: [
      '심리적 압박과 스트레스를 지양하며',
      '오로지 목표에만 집중할 수 있도록',
      '취업 준비생을 격려하고 기여',
    ],
  },
];

// 시안 수치 그대로. 실적이 바뀌면 함께 갱신
const STATS = [
  { label: '누적 참여자 수', value: '20,000+', unit: '명' },
  { label: '누적 프로그램 수', value: '400+', unit: '개' },
  { label: '누적 후기 개수', value: '7,200+', unit: '개' },
  { label: '인스타그램 팔로워 수', value: '5.6', unit: 'M' },
  { label: '커뮤니티 참여자 수', value: '7,000+', unit: '명' },
];

// 문구는 초안 — 활동별 운영 방식이 정해지면 검토
const MISSIONS = [
  {
    title: '챌린지 서면/LIVE 피드백',
    description:
      '렛츠커리어 챌린지에 참여하며 수행한 자료를 바탕으로, 서면 혹은 실시간 온라인으로 피드백해요.',
  },
  {
    title: '무료&유료 세미나',
    link: { href: LETSCAREER_SEMINAR_URL, label: '무료 세미나관' },
    description:
      '매월 2회 이상 열리는 LIVE 세미나에서 기업·직무 실무 이야기와 합격 전략을 전하고\n실시간 Q&A로 취업 준비생의 고민에 직접 답해요.',
  },
  {
    title: '취업 노하우 VOD',
    link: { href: LETSCAREER_VOD_URL, label: '렛츠 VOD' },
    description:
      '한 번 녹화한 강의로 시간과 장소에 구애받지 않고 노하우를 전해요.',
  },
  {
    title: '1:1 LIVE 멘토링',
    link: { href: LETSCAREER_MENTORING_URL, label: '1:1 멘토링관' },
    description:
      '취업 준비생과 실시간 온라인으로 만나, 커리어 고민을 깊이 있게 나눠요.',
  },
];

// 멘토 활동 현황. 카드 이미지(public/mentors-row-*.jpg)에 그려진 순서 그대로, 15명씩 두 줄
const MENTORS = [
  { name: '쥬디', role: '렛츠커리어 CEO' },
  { name: '팀탐', role: '렛츠커리어 COO' },
  { name: '레오', role: '렛츠커리어 CPO' },
  { name: '소피아', role: 'LG에너지솔루션/전략기획' },
  { name: '크리스', role: '신한투자증권/금융업,IB' },
  { name: '브라이언', role: 'HD현대일렉트릭/해외영업' },
  { name: '우디', role: '기아차/브랜드 마케팅' },
  { name: '헤일리', role: '현대자동차/글로벌 커뮤니케이션' },
  { name: '줄리아', role: '현대자동차/상품전략' },
  { name: '이프쌤', role: 'SK이노베이션/마케팅' },
  { name: '휴고', role: '현대자동차/상품기획' },
  { name: '하이디', role: '토스/세일즈' },
  { name: '이린', role: '캐시노트/마케팅' },
  { name: '벤자민', role: 'BCG/컨설턴트' },
  { name: '유나', role: '현대코퍼레이션/PM' },
  { name: '미니', role: '한국타이어/HR' },
  { name: '세라', role: '한화오션/해외영업' },
  { name: '쥬쌤', role: 'SK하이닉스/영업마케팅' },
  { name: '루크', role: '삼일PwC/ESG 컨설턴트' },
  { name: '후추쌤', role: '대학내일/AE' },
  { name: '영', role: '뤼튼테크놀로지스/AI개발' },
  { name: '파도', role: '뤼튼테크놀로지스/서비스 기획' },
  { name: 'Seren', role: '현대로템/AI데이터사이언티스트' },
  { name: '도니', role: '무신사/백엔드 개발자' },
  { name: '제이', role: '무신사/백엔드 개발자' },
  { name: '찰스', role: '삼성전자/반도체 엔지니어링' },
  { name: '머스캣', role: '삼성바이오로직스/공정엔지니어링' },
  { name: '길라잡이', role: 'LG디스플레이/AI개발' },
  { name: '루카', role: 'DB Inc/SW 엔지니어' },
  { name: '준', role: '현대자동차/IT 서비스 기획' },
];

const CONCERNS = [
  {
    title:
      '현직자 멘토 활동, 관심은 있는데 내가 무얼 할 수 있는지 잘 모르겠어요',
    details: [
      '어떤 지식과 경험을 공유해야 할지 잘 모르겠어요',
      '알려주고 싶은 정보는 있지만 어떻게 전달해야 할지 모르겠어요',
    ],
  },
  {
    title: '업무 일정과 개인 일정은 꼭! 보장받고 싶어요',
    details: [
      '업무 일정과 개인 일정이 유동적이라 걱정이에요',
      '오프라인 멘토링은 참여하기 어렵고 부담스러워요',
    ],
  },
  {
    title: '개인정보가 노출될 수 있다는 점이 부담스러워요',
    details: ['이름, 얼굴 등의 개인정보를 밝히는 것은 아직 부담스러워요'],
  },
];

// 섹션 공통 머리말: 파란 라벨 + 큰 제목 + 회색 설명
function SectionHeading({
  label,
  title,
  description,
  dark = false,
  labelClassName = 'text-[#4a76ff]',
  descriptionClassName = 'text-[#707fab]',
}: {
  label: string;
  labelClassName?: string;
  title: ReactNode[];
  description?: string[];
  dark?: boolean;
  descriptionClassName?: string;
}) {
  return (
    <div className="flex w-full max-w-[1000px] flex-col gap-5 text-center sm:gap-[30px]">
      <div className="flex flex-col gap-3">
        <p
          className={`text-lg font-bold leading-[1.17] sm:text-2xl ${labelClassName}`}
        >
          {label}
        </p>
        <h2
          className={`text-[26px] font-bold leading-[1.3] sm:text-[36px] min-[1024px]:text-[44px] ${dark ? 'text-white' : 'text-black'}`}
        >
          <Lines lines={title} />
        </h2>
      </div>
      {description && (
        <p
          className={`text-base leading-[1.4] sm:text-xl min-[1024px]:text-2xl ${descriptionClassName}`}
        >
          <Lines lines={description} />
        </p>
      )}
    </div>
  );
}

// 시안의 과녁 아이콘을 단순화한 버전: 겹친 동심원 + 오른쪽 위 빛
function ValueIcon({ tilt = false }: { tilt?: boolean }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 64 64"
      className={`size-16 ${tilt ? '-rotate-[15deg]' : ''}`}
    >
      <defs>
        <linearGradient id="value-icon-shine" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4d55f5" stopOpacity="0.4" />
          <stop offset="1" stopColor="#fff" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="31.5" fill="#4d55f5" fillOpacity="0.44" />
      <circle cx="32" cy="32" r="24.5" fill="#4d55f5" fillOpacity="0.44" />
      <circle cx="32" cy="32" r="17.5" fill="#4d55f5" fillOpacity="0.44" />
      <path
        d="M32 0.5A31.5 31.5 0 0 1 63.5 32H32Z"
        fill="url(#value-icon-shine)"
      />
    </svg>
  );
}

// 최신 기수 챌린지를 받아 와 직무별 목록으로 보여준다
async function ChallengeList() {
  return <ChallengeShowcase challenges={await getChallengeHighlights()} />;
}

// 대표 3분 미리보기 + 마감된 최근 LIVE 세미나
async function SeminarList() {
  return (
    <ProgramScroller
      items={[featuredSeminarPreview, ...(await getSeminarHighlights())]}
      more={{ href: LETSCAREER_SEMINAR_URL, label: '무료 세미나 페이지 보기' }}
    />
  );
}

// 최근 등록된 렛츠커리어 VOD
async function VodList() {
  return (
    <ProgramScroller
      items={await getVodHighlights()}
      more={{ href: LETSCAREER_VOD_URL, label: 'VOD 전체 보기' }}
    />
  );
}

// 1:1 LIVE 멘토링을 열어 둔 멘토
async function MentoringList() {
  return (
    <ProgramScroller
      items={await getMentoringHighlights()}
      more={{ href: LETSCAREER_MENTORING_URL, label: '1:1 멘토링 전체 보기' }}
    />
  );
}

// Painpoint(회색) ↔ Solution(파랑) 한 쌍
function AdvantageRow({
  pain,
  solution,
  painScene,
  solutionScene,
}: {
  pain: string;
  solution: string;
  painScene: ReactNode;
  solutionScene: ReactNode;
}) {
  return (
    <li className="grid gap-8 sm:gap-3 md:grid-cols-2">
      <div className="flex flex-col gap-4 sm:gap-5">
        <div>
          <p className="rounded-t-[12px] bg-[#d8d8d8] p-2.5 text-center text-lg font-semibold leading-[1.4] text-[#7a7d84] sm:text-xl">
            Painpoint
          </p>
          <div className="relative flex h-[302px] items-center justify-center overflow-hidden rounded-b-[12px] bg-[#e7e7e7] px-5">
            {painScene}
          </div>
        </div>
        <p className="text-center text-lg font-semibold leading-[1.4] text-black sm:text-[22px]">
          {pain}
        </p>
      </div>
      <div className="flex flex-col gap-4 sm:gap-5">
        <div>
          <p className="rounded-t-[12px] bg-gradient-to-r from-[#4a76ff] to-[#5aafff] p-2.5 text-center text-lg font-semibold leading-[1.4] text-white sm:text-xl">
            Solution
          </p>
          <div className="relative flex h-[302px] items-center justify-center overflow-hidden rounded-b-[12px] bg-[#e1ecff] px-5">
            {solutionScene}
          </div>
        </div>
        <p className="flex items-start justify-center gap-1.5 text-center text-lg font-semibold leading-[1.4] text-black sm:text-[22px]">
          <CheckIcon className="mt-1.5 w-4 shrink-0 text-[#4d55f5] sm:mt-2" />
          {solution}
        </p>
      </div>
    </li>
  );
}

// 말풍선. tail 방향에 꼬리를 단다
function ChatBubble({
  tone,
  tail,
  children,
}: {
  tone: 'dark' | 'blue';
  tail?: 'left' | 'right';
  children: ReactNode;
}) {
  const bg = tone === 'dark' ? 'bg-[#3a3a43]' : 'bg-[#4d55f5]';
  return (
    <p
      className={`relative rounded-[12px] px-6 py-4 text-[15px] font-medium leading-normal text-white sm:px-8 sm:py-5 sm:text-lg ${bg}`}
    >
      {children}
      {tail && (
        <span
          aria-hidden
          className={`absolute -bottom-4 h-6 w-[22px] ${bg} ${
            tail === 'left'
              ? 'left-8 [clip-path:polygon(0_0,100%_0,0_100%)]'
              : 'right-8 [clip-path:polygon(0_0,100%_0,100%_100%)]'
          }`}
        />
      )}
    </p>
  );
}

function CheckIcon({ className = '' }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 14 12" className={className}>
      <path
        d="M2 6.5 5.5 10 12 2"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// 좁은 화면에서는 아래를 향한다
function ProcessArrow() {
  return (
    <li
      aria-hidden
      className="flex shrink-0 rotate-90 items-center min-[1024px]:rotate-0"
    >
      <Image
        src="/mentor-join/process-arrow.svg"
        alt=""
        width={27}
        height={40}
        unoptimized
        className="h-6 w-auto min-[1024px]:h-8"
      />
    </li>
  );
}

// 흰 카드 + STEP 뱃지. '어려움' 섹션 고민 뱃지, Mission 가치 카드와 같은 카드·그림자 결
function ProcessStep({
  n,
  label,
  light = false,
}: {
  n: number;
  label: string;
  light?: boolean;
}) {
  return (
    <li className="flex w-full flex-col items-center gap-3 rounded-[12px] bg-white px-4 py-6 text-center shadow-[0_0_10px_rgba(77,85,245,0.15)] min-[1024px]:flex-1 min-[1024px]:justify-center">
      <span
        className={`rounded-[12px] px-3 py-0.5 text-sm font-bold leading-normal ${
          light
            ? 'bg-[#4d55f5]/[0.12] text-[#4d55f5]'
            : 'bg-[#4d55f5] text-white'
        }`}
      >
        STEP {n}
      </span>
      {/* 이름 칸을 두 줄 높이로 고정해 STEP 뱃지가 모든 카드에서 같은 높이에 오게 한다 */}
      <span className="flex items-center break-keep text-[17px] font-bold leading-[1.4] text-[#27272d] sm:text-lg min-[1024px]:h-[3.15rem]">
        {label}
      </span>
    </li>
  );
}

function Lines({ lines }: { lines: ReactNode[] }) {
  return lines.map((line, i) => (
    <span key={i}>
      {i > 0 && <br />}
      {line}
    </span>
  ));
}

export default function MentorJoinPage() {
  return (
    <>
      <section className="px-4 pt-4 sm:px-8 sm:pt-8 min-[1024px]:px-[52px]">
        <div className="relative isolate flex min-h-[480px] flex-col items-center justify-center overflow-hidden rounded-[16px] bg-[#f9f9f8] px-5 py-16 sm:h-[600px] sm:px-10">
          {/* 하단 중앙에서 번지는 보라색 글로우 */}
          <div
            aria-hidden
            className="absolute left-1/2 top-1/3 -z-10 size-[800px] -translate-x-1/2 rounded-full bg-gradient-to-b from-[#90a1ff]/20 to-[#9e86ff]/20 blur-[150px]"
          />
          <div className="flex w-full max-w-[1000px] flex-col items-center gap-10 sm:gap-16">
            <Image
              src="/mentor-join/logo-hero.svg"
              alt="렛츠커리어"
              width={220}
              height={35}
              priority
              unoptimized
              className="h-auto w-[180px] sm:w-[220px]"
            />
            <div className="flex flex-col gap-4 text-center sm:gap-6">
              <h1 className="text-[28px] font-extrabold leading-[1.4] tracking-[0.01em] sm:text-[40px] min-[1024px]:text-[52px]">
                <span className="bg-gradient-to-b from-[#9762f5] to-[#6963f6] to-70% box-decoration-clone bg-clip-text text-transparent">
                  빠르게 합류하고 수익화까지
                </span>
                <br />
                렛츠커리어 현직자 멘토로 <br className="sm:hidden" />
                함께하세요
              </h1>
              <p className="text-base leading-[1.4] text-[#7a7d84] sm:text-xl min-[1024px]:text-2xl">
                모두가 자신만의 커리어를 설계하고 지속할 수 있도록
                <br />그 과정에 렛츠커리어와 함께 해주세요.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href={MENTOR_APPLY_PATH}
                className="w-[136px] rounded-[6px] bg-[#5f66f6] px-5 py-3 text-center text-lg font-medium leading-[1.5] text-white hover:bg-[#4d55f5] sm:w-[150px] sm:text-xl"
              >
                멘토 신청하기
              </Link>
              <a
                href={KAKAO_CHAT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-[136px] rounded-[6px] bg-[#27272d] px-5 py-3 text-center text-lg font-medium leading-[1.5] text-white hover:bg-zinc-700 sm:w-[150px] sm:text-xl"
              >
                문의하기
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="flex flex-col items-center gap-12 overflow-x-clip bg-gradient-to-b from-white to-[#a9c1ff] px-4 pt-24 sm:gap-20 sm:px-8 sm:pt-[140px]">
        <SectionHeading
          label="멘토 활동 계기"
          title={['현직자 멘토 활동에', '관심을 가지게 되신 계기가 있나요?']}
          description={[
            '렛츠커리어와 합류한 많은 멘토님들은',
            '아래 계기들을 토대로 현직자 멘토 활동에 관심을 가지셨다고 해요!',
          ]}
        />

        <div className="relative isolate flex w-full max-w-[800px] flex-col items-center gap-[18px]">
          {/* 위쪽 말풍선들을 덮어 흐리게 만드는 막 */}
          <div
            aria-hidden
            className="pointer-events-none absolute -top-5 left-1/2 z-10 h-[415px] w-screen -translate-x-1/2 bg-gradient-to-b from-[#e3ebff] to-[#e3ebff]/0"
          />
          <div className="flex w-full flex-col items-center">
            <ul className="flex w-full flex-col gap-4 sm:gap-6">
              {MOTIVATIONS.map((m) => (
                <li key={m.lines[0]} className={`flex flex-col ${m.row}`}>
                  <p
                    className={`rounded-[9px] px-5 py-4 text-center text-[15px] font-medium leading-[1.4] sm:px-14 sm:py-6 sm:text-xl min-[1024px]:text-2xl ${m.bubble}`}
                  >
                    {m.lines.map((line, i) => (
                      <span key={line}>
                        {i > 0 && <br />}
                        {line}
                      </span>
                    ))}
                  </p>
                </li>
              ))}
            </ul>
            {/* 흰 말풍선 꼬리 */}
            <div
              aria-hidden
              className="h-6 w-[22px] bg-white [clip-path:polygon(0_0,100%_0,50%_100%)] sm:h-[37px] sm:w-[34px]"
            />
          </div>
          <Image
            src="/mentor-join/mentor-character.svg"
            alt=""
            width={170}
            height={204}
            unoptimized
            className="h-auto w-[130px] sm:w-[170px]"
          />
        </div>
      </section>

      <section className="flex flex-col items-center gap-16 bg-[#27272d] px-4 pb-24 pt-20 sm:gap-[120px] sm:px-8 sm:pb-[140px] sm:pt-[120px]">
        <SectionHeading
          dark
          label="현직자 멘토 활동의 어려움"
          title={[
            '그러나 멘토 활동을 고민하게 만드는',
            '3가지 걸림돌이 있어요',
          ]}
          description={[
            '많은 멘토님들이 아래 3가지 문제에 대해',
            '고민하고 계신다는 점에 동감했어요.',
          ]}
        />

        <ol className="flex w-full max-w-[760px] flex-col gap-14 sm:gap-20">
          {CONCERNS.map((c, i) => (
            <li key={c.title} className="flex flex-col gap-8 sm:gap-10">
              <div className="relative rounded-[12px] bg-white px-5 pb-6 pt-9 text-center sm:p-10">
                <p className="text-[17px] font-bold leading-[1.5] text-[#27272d] sm:text-2xl">
                  {c.title}
                </p>
                <span className="absolute left-3 top-[-14px] origin-top-left -rotate-[10deg] rounded-[12px] bg-[#4d55f5] px-3 py-0.5 text-base font-bold leading-[1.4] text-white sm:left-[17px] sm:top-[-18px] sm:px-4 sm:py-1 sm:text-[22px]">
                  고민 {i + 1}
                </span>
              </div>
              <ul className="flex flex-col gap-4 sm:pl-[120px]">
                {c.details.map((d) => (
                  <li key={d} className="flex items-center gap-3">
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-[8px] bg-[#404052] sm:size-8">
                      <svg
                        aria-hidden
                        viewBox="0 0 14 12"
                        className="w-[13px] text-[#4d55f5]"
                      >
                        <path
                          d="M2 6.5 5.5 10 12 2"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <span className="text-[15px] font-medium leading-[1.4] text-[#d8d8d8] sm:text-xl">
                      {d}
                    </span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </section>

      <section className="flex flex-col items-center gap-12 bg-white px-4 py-20 sm:gap-20 sm:px-8 sm:py-[120px]">
        <SectionHeading
          label="렛츠커리어의 장점"
          title={['망설이게 하는 문제들,', '렛츠커리어가 해소해 드릴게요']}
          description={[
            '관심을 넘어 실행으로 이어질 수 있도록',
            '렛츠커리어가 도울게요.',
          ]}
          descriptionClassName="text-[#4c4f56]"
        />
        <ol className="flex w-full max-w-[1000px] flex-col gap-12 sm:gap-[60px]">
          <AdvantageRow
            pain="어떤 지식을 어떻게 공유해야 할지 고민"
            solution="렛츠커리어가 적합한 멘토링 활동 및 지식 추천"
            painScene={
              <div className="flex w-full max-w-[398px] flex-col gap-3">
                <ChatBubble tone="dark">
                  현직자 멘토 활동, 관심은 있는데...
                  <br />
                  제가 어떤 내용을 전달할 수 있을까요?? 🤔
                </ChatBubble>
                <ChatBubble tone="dark" tail="left">
                  그 내용을 어떻게 전달해야 할지도 잘 모르겠네요
                </ChatBubble>
              </div>
            }
            solutionScene={
              <>
                <div className="absolute left-5 top-9 h-[284px] w-[60%] max-w-[270px] bg-white px-5 py-6 text-[15px] font-medium leading-[1.8] text-black sm:text-base">
                  [김렛커 경력기술서]
                  <br />
                  총 경력 2년 2개월
                  <br />
                  00기업 서비스
                  <br />
                  00은행 서비스
                </div>
                <div className="absolute bottom-10 right-4 sm:right-8">
                  <ChatBubble tone="blue" tail="right">
                    멘토님, 보내주신 이력을 토대로
                    <br />- 자기소개서 챌린지
                    <br />- 포트폴리오 챌린지
                    <br />
                    멘토링을 추천드려요👏
                  </ChatBubble>
                </div>
              </>
            }
          />
          <AdvantageRow
            pain="보장받기 어려운 업무 및 개인 일정"
            solution="온·오프라인, 시간 등 원하는 조건에 맞춰 활동 가능"
            painScene={
              // 시안처럼 위에서 20px 내려 놓고 아래쪽은 카드 밖으로 잘리게 둔다
              <Image
                src="/mentor-join/advantage-schedule.svg"
                alt="빼곡하게 찬 업무·개인 일정표"
                width={564}
                height={573}
                unoptimized
                className="absolute left-1/2 top-5 h-auto w-[398px] max-w-[calc(100%-40px)] -translate-x-1/2"
              />
            }
            solutionScene={
              <div className="flex w-full flex-col gap-4">
                <div className="self-start">
                  <ChatBubble tone="dark" tail="left">
                    <span className="flex flex-col gap-2">
                      {[
                        '이번 6월 동안은 온라인만 가능해요.',
                        '월, 수요일 19시 30분~22시 가능해요.',
                      ].map((line) => (
                        <span key={line} className="flex items-center gap-3">
                          <span className="flex size-6 shrink-0 items-center justify-center rounded-[6px] bg-[#bec1ff]">
                            <CheckIcon className="w-2.5 text-[#4d55f5]" />
                          </span>
                          {line}
                        </span>
                      ))}
                    </span>
                  </ChatBubble>
                </div>
                <div className="self-end">
                  <ChatBubble tone="blue" tail="right">
                    네, 확인했습니다!
                    <br />
                    말씀주신 일정에 맞춰 멘토링
                    <br />
                    배정해드릴게요.
                  </ChatBubble>
                </div>
              </div>
            }
          />
          <AdvantageRow
            pain="성함, 얼굴, 재직 기업 등에 대한 개인정보 노출"
            solution="닉네임 활동, 계열사 등의 표현으로 정보 노출 최소화"
            painScene={
              <Image
                src="/mentor-join/advantage-privacy-before.svg"
                alt="이름·얼굴·재직 기업이 그대로 드러난 멘토 프로필"
                width={391}
                height={290}
                unoptimized
                className="absolute left-1/2 top-4 h-auto w-[391px] max-w-[calc(100%-40px)] -translate-x-1/2"
              />
            }
            solutionScene={
              <Image
                src="/mentor-join/advantage-privacy-after.svg"
                alt="닉네임과 계열사 표현으로 정보를 가린 멘토 프로필"
                width={391}
                height={290}
                unoptimized
                className="absolute left-1/2 top-4 h-auto w-[391px] max-w-[calc(100%-40px)] -translate-x-1/2"
              />
            }
          />
        </ol>
      </section>

      <section className="flex flex-col items-center gap-14 bg-[#f0f4ff] px-4 pb-28 pt-20 sm:gap-20 sm:px-8 sm:pb-[160px] sm:pt-[120px]">
        <div className="flex w-full flex-col items-center gap-12 sm:gap-14">
          <SectionHeading
            label="렛츠커리어 소개"
            title={[
              '커리어의 첫 걸음',
              <>
                <span className="text-[#6b63ff]">렛츠커리어</span>는 막막함에
                주목했어요
              </>,
            ]}
            description={[
              '대한민국의 많은 청년들은 취업 준비를 앞두고 여러 어려움을 느끼고 있어요.',
            ]}
            descriptionClassName="text-[#4c4f56]"
          />
          {/* 데스크톱은 시안 좌표대로 겹쳐 놓고, 좁은 화면에서는 세로로 쌓는다 */}
          <div className="relative flex w-full max-w-[1000px] flex-col items-center gap-5 min-[1024px]:block min-[1024px]:h-[233px]">
            <p className="order-2 rounded-[12px] bg-white px-6 py-5 text-center text-[17px] font-bold leading-[1.5] text-[#27272d] shadow-[0_2px_8px_rgba(166,170,255,0.5)] sm:text-xl min-[1024px]:absolute min-[1024px]:left-[349px] min-[1024px]:top-[133px] min-[1024px]:whitespace-nowrap min-[1024px]:px-10 min-[1024px]:py-8 min-[1024px]:text-2xl">
              경쟁의 굴레 속에서 점점 떨어져가는 자신감
            </p>
            <p className="order-1 -rotate-3 rounded-[12px] bg-white p-5 text-center text-[17px] font-bold leading-[1.5] text-[#27272d] shadow-[0_2px_8px_rgba(77,85,245,0.5)] sm:text-xl min-[1024px]:absolute min-[1024px]:left-[171px] min-[1024px]:top-[80px] min-[1024px]:origin-top-left min-[1024px]:-rotate-[7deg] min-[1024px]:whitespace-nowrap min-[1024px]:p-8 min-[1024px]:text-2xl">
              나의 상황과는 무관하게 쏟아지는 각종 취업 정보
            </p>
          </div>
        </div>
        <div aria-hidden className="flex flex-col gap-[18px]">
          <span className="size-2 rounded-full bg-[#caccfc]" />
          <span className="size-2 rounded-full bg-[#8288f8]" />
          <span className="size-2 rounded-full bg-[#4d55f5]" />
        </div>
        <p className="max-w-[866px] text-center text-2xl font-semibold leading-[1.5] text-[#5c5f66] sm:text-[36px] min-[1024px]:text-[44px]">
          국내 유일의 서류 작성 교육으로
          <br />
          커리어의 첫 시작을 함께하고자 해요
        </p>
      </section>

      <section className="relative isolate flex flex-col items-center overflow-hidden bg-[#f0f4ff] px-4 pb-28 pt-20 sm:px-8 sm:pb-[160px] sm:pt-[120px]">
        {/* 섹션 위쪽을 감싸는 큰 반원 빛과 카드 아래쪽 은은한 빛 */}
        {/* 타원이 이미지 가로 중앙에 있어 화면 가로 중앙에 맞춘다 */}
        <Image
          src="/mentor-join/mission-background.png"
          alt=""
          width={1993}
          height={1302}
          unoptimized
          className="absolute left-1/2 top-[45px] -z-10 h-[1302px] w-[1993px] max-w-none -translate-x-1/2"
        />
        <div
          aria-hidden
          className="absolute left-1/2 top-[892px] -z-10 h-[423px] w-[1046px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(199,178,255,0.25),rgba(240,244,255,0.25))]"
        />

        <SectionHeading
          label="Mission"
          labelClassName="text-[#969aff]"
          title={[
            '취업 준비생과 함께하는',
            '지속가능한 커리어',
            <>
              <span className="text-[#6b63ff]">‘선순환 커뮤니티’</span>를
              만듭니다
            </>,
          ]}
        />

        <div className="mt-14 flex w-full max-w-[1000px] flex-col gap-6 sm:mt-[100px] sm:gap-10">
          <p className="flex flex-col items-center justify-center gap-1 rounded-[10px] bg-white px-5 py-5 text-center shadow-[0_1px_10px_rgba(77,85,245,0.25)] sm:flex-row sm:gap-6 sm:py-7">
            <span className="text-xl font-bold leading-[1.4] text-[#4d55f5] sm:text-[26px]">
              Vision
            </span>
            <span className="text-base font-medium leading-[1.4] text-[#3e4148] sm:text-2xl">
              모두의 ‘커리어 시작’ 경험의 퀄리티를 높입니다
            </span>
          </p>
          <ul className="grid gap-4 min-[1024px]:grid-cols-3 min-[1024px]:gap-[26px]">
            {VALUES.map((v, i) => (
              <li
                key={v.name}
                className="flex flex-col items-center justify-end gap-5 rounded-[12px] bg-white px-5 pb-8 pt-6 text-center shadow-[0_0_10px_rgba(77,85,245,0.25)] min-[1024px]:h-[330px] min-[1024px]:pb-10"
              >
                <ValueIcon tilt={i === 1} />
                <div className="flex flex-col gap-1">
                  <p className="text-xl font-bold leading-[1.4] text-[#27272d] sm:text-2xl">
                    {v.name}
                  </p>
                  <p className="text-base font-semibold leading-[1.4] text-[#27272d] sm:text-lg">
                    {v.summary}
                  </p>
                </div>
                <p className="text-[15px] font-medium leading-[1.5] text-[#7a7d84] sm:text-lg">
                  <Lines lines={v.lines} />
                </p>
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-24 text-center text-2xl font-bold leading-[1.4] tracking-[0.02em] text-[#27272d] sm:mt-[180px] sm:text-[36px] min-[1024px]:text-[44px]">
          모두가 자신만의 커리어를 설계하고
          <br />
          지속할 수 있도록{' '}
          <span className="text-[#4d55f5]">그 과정에 함께 해주세요</span>
        </p>
      </section>

      <section className="flex flex-col items-center gap-12 bg-white px-4 py-20 sm:gap-20 sm:px-8 sm:py-[120px]">
        <SectionHeading
          label="교육 파트너 & 현황 소개"
          title={[
            '이미 많은 취업 준비생과 교육 파트너가',
            '렛츠커리어를 믿고 함께 했어요',
          ]}
          description={[
            '다양한 부트캠프 운영 기관과 협력하여 교육생들의 취업 교육을 담당했어요',
          ]}
          descriptionClassName="text-[#4c4f56]"
        />
        <dl className="grid w-full max-w-[1000px] grid-cols-2 gap-x-4 gap-y-8 rounded-[10px] bg-[#f0f4ff] px-5 py-7 sm:grid-cols-3 min-[1024px]:flex min-[1024px]:justify-center min-[1024px]:gap-6">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center gap-3 min-[1024px]:w-40"
            >
              <dt className="text-sm font-medium leading-normal text-[#3e4148] sm:text-base">
                {stat.label}
              </dt>
              <dd className="flex items-end gap-1 text-black">
                <span className="text-[26px] font-bold leading-none sm:text-[32px]">
                  {stat.value}
                </span>
                <span className="text-xl font-semibold leading-[1.1] sm:text-2xl">
                  {stat.unit}
                </span>
              </dd>
            </div>
          ))}
        </dl>
        {/* 파트너 로고 띠: 같은 이미지 두 장을 이어 붙여 끊김 없이 흘려보낸다 */}
        <div className="relative -mx-4 self-stretch overflow-hidden sm:-mx-8">
          <div
            aria-hidden
            className="absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white to-white/0 sm:w-[360px]"
          />
          <div
            aria-hidden
            className="absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white to-white/0 sm:w-[360px]"
          />
          <div className="flex w-max animate-[infinite-scroll_60s_linear_infinite] motion-reduce:animate-none">
            {[0, 1].map((copy) => (
              <Image
                key={copy}
                src="/mentor-join/partners.svg"
                alt={copy === 0 ? '렛츠커리어 교육 파트너 로고' : ''}
                aria-hidden={copy === 1}
                width={1646}
                height={188}
                unoptimized
                className="h-[120px] w-auto max-w-none pr-6 sm:h-[188px]"
              />
            ))}
          </div>
        </div>
      </section>

      <section className="flex flex-col items-center gap-12 bg-[#27272d] px-4 py-20 sm:gap-20 sm:px-8 sm:py-[120px]">
        <SectionHeading
          dark
          label="주요 미션"
          title={['4가지 영역에서', '멘토 활동을 수행해요']}
          description={['3가지 활동을 통해 멘토링을 수행해요']}
        />
        <ol className="flex w-full max-w-[1000px] flex-col gap-4 sm:gap-5">
          {MISSIONS.map((m, i) => (
            <li
              key={m.title}
              className="flex flex-col gap-6 overflow-hidden rounded-[12px] bg-[#303036] p-6 sm:p-8"
            >
              <div className="flex items-start gap-4 sm:gap-6">
                {/* 번호 칸 폭을 고정해 아래 카드 목록의 시작점을 제목에 맞춘다 (program-scroller.tsx) */}
                <span className="w-8 shrink-0 text-xl font-bold leading-[1.4] text-[#8288f8] sm:w-10 sm:text-2xl">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="flex flex-col gap-1.5">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                    <p className="text-xl font-bold leading-[1.4] text-white sm:text-2xl">
                      {m.title}
                    </p>
                    {'link' in m && m.link && (
                      <a
                        href={m.link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-full bg-[#4d55f5] px-3 py-1 text-sm font-semibold leading-normal text-white hover:bg-[#6f76f7]"
                      >
                        {m.link.label}
                        <span aria-hidden>→</span>
                      </a>
                    )}
                  </div>
                  <p className="whitespace-pre-line text-[15px] leading-normal text-[#b0b3ba] sm:text-lg">
                    {m.description}
                  </p>
                </div>
              </div>
              {i === 0 && <ChallengeList />}
              {i === 1 && <SeminarList />}
              {i === 2 && <VodList />}
              {i === 3 && <MentoringList />}
            </li>
          ))}
        </ol>
      </section>

      <section className="flex flex-col items-center gap-12 bg-white px-4 py-20 sm:gap-16 sm:px-8 sm:py-[120px]">
        <SectionHeading
          label="렛츠커리어 합류 프로세스"
          title={['멘토 신청부터 합류까지', '3가지 단계로 진행되어요']}
          description={[
            '바쁘신 일정을 고려하여 3단계 심사는',
            '영업일 기준 최대 5일 내 회신드릴 예정이에요.',
          ]}
          descriptionClassName="text-[#4c4f56]"
        />
        {/* 다섯 단계를 한 줄로. 1~3 심사는 진한 번호, 4~5 합류 후는 연한 번호 (좁은 화면은 세로 흐름) */}
        <ol className="flex w-full max-w-[1000px] flex-col items-center gap-2 rounded-[10px] bg-[#f0f4ff] p-5 sm:p-8 min-[1024px]:flex-row min-[1024px]:items-stretch min-[1024px]:gap-3 min-[1024px]:px-10 min-[1024px]:py-12">
          <ProcessStep n={1} label="3분만에 멘토 신청하기" />
          <ProcessArrow />
          <ProcessStep n={2} label="서류 심사" />
          <ProcessArrow />
          <ProcessStep n={3} label="30분 커피챗" />
          <ProcessArrow />
          <ProcessStep n={4} label="합류 & 멘토 온보딩" light />
          <ProcessArrow />
          <ProcessStep n={5} label="멘토 활동 & 수익 정산" light />
        </ol>
      </section>

      <section className="flex flex-col items-center gap-12 overflow-hidden bg-[#f0f4ff] px-4 py-20 sm:gap-20 sm:px-8 sm:py-[120px]">
        <SectionHeading
          label="멘토 활동 현황"
          title={[
            '이미 많은 현직자 멘토님들이',
            '함께 렛츠커리어를 빛내주고 계세요',
          ]}
          description={[
            '모두가 자신만의 커리어를 설계하고 지속할 수 있도록 그 과정에 함께 해주세요',
          ]}
          descriptionClassName="text-[#4c4f56]"
        />
        {/* 두 줄이 서로 반대 방향으로 흐른다. 같은 목록을 두 번 이어 붙여 끊김 없이 반복 */}
        <div className="relative -mx-4 flex flex-col gap-4 self-stretch sm:-mx-8 sm:gap-6">
          <div
            aria-hidden
            className="absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-[#f0f4ff] to-[#f0f4ff]/0 sm:w-40"
          />
          <div
            aria-hidden
            className="absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-[#f0f4ff] to-[#f0f4ff]/0 sm:w-40"
          />
          {[MENTORS.slice(0, 15), MENTORS.slice(15)].map((row, r) => (
            <div key={r} className="overflow-hidden">
              <div
                className={`flex w-max motion-reduce:animate-none ${r === 0 ? 'animate-[infinite-scroll_60s_linear_infinite]' : 'animate-[infinite-scroll_60s_linear_infinite_reverse]'}`}
              >
                {[0, 1].map((copy) => (
                  // 멘토 카드 15장을 한 장으로 합친 이미지 (원본 4368×260, 2배 해상도)
                  <Image
                    key={copy}
                    src={`/mentors-row-${r + 1}.jpg`}
                    alt={
                      copy === 0
                        ? row.map((m) => `${m.name} 멘토(${m.role})`).join(', ')
                        : ''
                    }
                    aria-hidden={copy === 1}
                    width={4368}
                    height={260}
                    unoptimized
                    className="h-[180px] w-auto max-w-none pr-3 sm:h-[260px]"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section
        id="faq"
        className="flex flex-col items-center gap-12 bg-white px-4 pb-24 pt-20 sm:gap-20 sm:px-8 sm:pb-[120px] sm:pt-[120px]"
      >
        <SectionHeading label="FAQ" title={['궁금한 점이 있으신가요?']} />
        <Faq />
      </section>

      <section className="relative isolate flex flex-col items-center gap-10 overflow-hidden bg-[linear-gradient(135deg,var(--tw-gradient-stops))] from-[#09042a] to-[#5144b6] px-4 py-16 sm:gap-14 sm:py-24">
        {/* 시안 기준 1440px 화면에서 left 70px 위치 = 중앙에서 18px 오른쪽 */}
        <Image
          src="/mentor-join/cta-background.svg"
          alt=""
          width={1336}
          height={1336}
          unoptimized
          className="absolute left-[calc(50%-650px)] top-[-253px] -z-10 size-[1336px] max-w-none"
        />
        <Image
          src="/mentor-join/logo-hero-white.svg"
          alt="렛츠커리어"
          width={220}
          height={35}
          unoptimized
          className="h-auto w-[180px] sm:w-[220px]"
        />
        <h2 className="max-w-[866px] text-center text-[28px] font-bold leading-[1.4] sm:text-[40px] min-[1024px]:text-[52px]">
          <span className="bg-gradient-to-b from-[#c4a3ff] to-[#5b54ff] to-70% box-decoration-clone bg-clip-text text-transparent">
            빠르게 경험하고 수익화까지
          </span>
          <br />
          <span className="text-[#edeefe]">
            렛츠커리어 멘토링으로 <br className="sm:hidden" />
            시도해보세요
          </span>
        </h2>
        <Link
          href={MENTOR_APPLY_PATH}
          className="flex h-12 items-center justify-center gap-2 rounded-[8px] bg-[linear-gradient(272deg,#9762f5_1.88%,#544cff_98.12%)] px-7 py-4 text-xl font-semibold leading-none text-white hover:brightness-110 sm:h-16 sm:px-10 sm:py-6 sm:text-2xl"
        >
          3분만에 멘토 신청하기
        </Link>
      </section>

      {/* 플로팅 바가 페이지 끝(푸터)을 가리지 않도록 높이만큼 비워둔다 */}
      <div aria-hidden className="h-24 sm:h-28" />
      <div className="fixed inset-x-0 bottom-4 z-20 px-4 sm:bottom-6">
        <div className="mx-auto flex max-w-[1120px] items-center justify-between gap-3 rounded-[8px] border border-white/40 bg-[#27272d]/[0.64] px-4 py-3 backdrop-blur-[10px] sm:px-5 sm:py-4">
          <p className="hidden text-xl font-semibold leading-[1.4] text-[#fafafa] md:block">
            취업 멘토링의 시작은 렛츠커리어
          </p>
          <div className="flex flex-1 items-center gap-3 md:flex-none">
            <a
              href={KAKAO_CHAT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 rounded-[6px] bg-white px-5 py-3 text-center text-base font-medium leading-normal text-[#4d55f5] hover:bg-[#eef0ff] md:flex-none"
            >
              문의하기
            </a>
            <Link
              href={MENTOR_APPLY_PATH}
              className="flex-[2] whitespace-nowrap rounded-[6px] bg-[#4d55f5] px-5 py-3 text-center text-base font-medium leading-normal text-white hover:bg-[#3a41d6] md:flex-none"
            >
              3분만에 멘토 신청하기
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
