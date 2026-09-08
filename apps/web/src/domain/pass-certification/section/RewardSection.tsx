import SectionHeading from '@/domain/pass-certification/components/SectionHeading';
import { PASS_SECTION_ID } from './sectionIds';

const REWARDS = [
  {
    no: '01',
    badge: '전원 제공',
    title: (
      <>
        <span className="hidden md:inline">인턴/신입</span> 회사생활 TIP{' '}
        <br className="hidden md:block" />
        VOD & PDF 전송
      </>
    ),
    desc: '스타트업 신입부터 렛츠커리어 대표까지. 자타공인 일잘러 쥬디가 직접 겪고 배운 회사생활 팁을 이메일로 보내드려요.',
    quote: '"제가 한 실수, 여러분은 하지 마세요!"',
    theme: {
      card: 'bg-[#F1F0FF]',
      no: 'text-[#4D55F5]',
      point: '#4D55F5',
    },
  },
  {
    no: '02',
    badge: '매월 추첨 10분',
    title: (
      <>
        합격 축하금 <br className="hidden md:block" />
        1만원 지급
      </>
    ),
    desc: '사원증, 합격 이메일 등 간단한 인증만 하면 끝! 리워드는 매월 6일 일괄 송금해드려요.',
    quote: '첫 출근, 렛츠커리어가 쏩니다!',
    theme: {
      card: 'bg-[#FFEEEA]',
      no: 'text-[#FE8064]',
      point: '#FE8064',
    },
  },
  {
    no: '03',
    badge: '희망자 한정',
    title: (
      <>
        <div className="hidden md:block">
          내 이야기를 담은
          <br />
          합격 인터뷰
        </div>
        <div className="md:hidden">합격자 인터뷰 기회</div>
      </>
    ),
    desc: '합격자 인증 이후 순차적으로 인터뷰 섭외 메일을 보내드릴 예정이에요.',
    quote: '"후배 취준생에게 멘토가 되어주세요!"',
    theme: {
      card: 'bg-[#E9F9FF]',
      no: 'text-[#13BCFE]',
      point: '#13BCFE',
    },
  },
];

/** 파란 블록 — 왜 합격 인증을 받나요? */
const REASONS = [
  {
    no: '01',
    title: '실제 합격 경험이 쌓여요',
    desc: '어떤 준비가 합격까지 이어졌는지 더 정확한 프로그램을 만드는 데 활용해요.',
  },
  {
    no: '02',
    title: '막막한 취준생에게 힌트가 돼요',
    desc: '먼저 합격한 사람의 과정은 비슷한 고민을 하는 누군가에게 가장 현실적인 길잡이예요.',
  },
  {
    no: '03',
    title: '렛츠커리어 팀이 계속 달릴 힘이 생겨요',
    desc: '미루던 자소서를 시작했다는 한마디도, 합격했다는 소식도 저희에겐 정말 큰 힘이에요.',
  },
];

/** 합격 인증 리워드 섹션 */
export default function RewardSection() {
  return (
    <section
      id={PASS_SECTION_ID.reward}
      className="scroll-mt-[56px] md:scroll-mt-[60px]"
    >
      <div className="mx-auto flex max-w-[1120px] flex-col items-center gap-4 px-5 py-10 md:px-10 md:py-20">
        <SectionHeading
          label="합격 인증 리워드"
          title={
            <>
              합격 인증 한 번으로,
              <br />세 가지 리워드를 한 번에 받아요
            </>
          }
          description="인증 자료를 확인한 뒤 작성해주신 이메일로 순차 발송해드려요."
        />

        <div className="grid w-full max-w-[1040px] grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
          {REWARDS.map((r) => (
            <div
              key={r.no}
              className={`flex h-full flex-col gap-3 rounded-xl p-5 md:p-[34px] ${r.theme.card}`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-xsmall14 md:text-xxlarge36 font-bold ${r.theme.no}`}
                >
                  {r.no}
                </span>
                <span
                  className="text-static-100 text-xxsmall12 rounded-full px-2.5 py-1 font-semibold md:px-4 md:py-1.5"
                  style={{ backgroundColor: r.theme.point }}
                >
                  {r.badge}
                </span>
              </div>
              <h4 className="text-medium22 text-neutral-0 font-bold leading-snug">
                {r.title}
              </h4>
              <p className="text-xsmall14 text-neutral-40 font-normal leading-relaxed">
                {r.desc}
              </p>
              <p
                className="text-xxsmall12 mt-auto hidden font-normal md:block"
                style={{ color: r.theme.point }}
              >
                {r.quote}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-primary hidden items-center px-5 py-20 md:block">
        <div className="mx-auto flex max-w-[1040px] justify-between gap-16">
          <div className="flex shrink-0 flex-col gap-[50px]">
            <h3 className="text-xsmall16 text-primary-20 font-medium">
              왜 합격 인증을 받나요?
            </h3>
            <h2 className="text-static-100 mt-3 text-[38px] font-bold leading-[130%]">
              여러분의 소식이
              <br />
              다음 취준생의
              <br />
              길이 되니까요
            </h2>
          </div>

          <ul className="flex w-full max-w-[492px] flex-col">
            {REASONS.map((r) => (
              <li
                key={r.no}
                className="border-static-100/15 flex gap-10 border-t py-10 last:border-b"
              >
                <span className="text-medium24 text-primary-5 w-8 shrink-0">
                  {r.no}
                </span>
                <div className="flex flex-col gap-3">
                  <h4 className="text-medium24 text-primary-5 font-semibold">
                    {r.title}
                  </h4>
                  <p className="text-small20 text-primary-5 font-light">
                    {r.desc}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
