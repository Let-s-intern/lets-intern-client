import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import styles from './bigfirm.module.css';
import { COUPON } from './data/coupon';
import {
  LETSCAREER_CHAT_URL,
  LETSCAREER_REVIEW_URL,
  mentorDetailUrl,
} from './data/links';
import { getMentorImages } from './data/mentorImages';
import { MENTORS } from './data/mentors';
import { CouponTicket } from './ui/CouponTicket';
import { Hero } from './ui/Hero';
import { MentorFinder } from './ui/MentorFinder';
import { MobileDock } from './ui/MobileDock';

const WORRIES = [
  '불합격 통보 받았지만 여전히 어디가, 왜 문제인지 모르겠어요',
  '다음 공채에서는 꼭 합격하고 싶은데 벌써 막막해요',
  '스터디원, 친구들에게는 늘 비슷한 피드백만 받고 있어요.',
  '합격자와 내 서류의 차이점을 이해하고 수정하고 싶어요',
];

const REASONS = [
  {
    tag: '합격 경험',
    tagClass: 'bg-[#f1f0ff] text-primary',
    title: '대기업 채용을 직접 경험하고 합격한 노하우로 알려드려요',
    body: '멘토 모두 대기업 서류와 면접을 거쳐 입사했어요. 합격 노하우를 통해 탈락 이유를 분석해드려요.',
  },
  {
    tag: '최신 채용 트렌드',
    tagClass: 'bg-[#e9f9ff] text-[#0a7fae]',
    title: (
      <>
        기업의 채용 트렌드를
        <br />
        가장 빠르게 알아요
      </>
    ),
    body: '몇 년 전 합격 공식이 아니라, 가장 최근의 기준으로 이야기해요.',
  },
  {
    tag: '직무 이해도',
    tagClass: 'bg-[#ffeeea] text-[#f2694b]',
    title: (
      <>
        실무자의 언어로
        <br />
        생생하게 들을 수 있어요
      </>
    ),
    body: (
      <>
        내가 지원하는 직무와 가까운 현직자에게
        <br />그 직무의 언어로 피드백 받아요.
      </>
    ),
  },
];

const MENTOR_FEEDBACK_POINTS = [
  '직무 관점 제시',
  '문제 발견 과정',
  '정량 지표로 증명',
];

const HIGHLIGHT =
  'bg-[linear-gradient(transparent_60%,#e9eaff_60%)] font-extrabold';

const COMMONS: ReactNode[] = [
  <>
    <strong className={HIGHLIGHT}>모두 1년차 이상의 현직자</strong>로, 현장
    경험을 생생하게 들려주실 수 있어요
  </>,
  // 9명 feedbackMenteeCount 합 (letscareer.co.kr/mentors/{id}, 2026-10-30)
  <>
    렛츠커리어 프로그램을 통해{' '}
    <strong className={HIGHLIGHT}>누적 2,384번의 멘토링</strong>을 진행했어요
  </>,
  <>
    <strong className={HIGHLIGHT}>렛츠커리어의 미션</strong>에 공감하며,
    멘티들에게 진심을 다해 조언하고 긍정적인 영향력을 전달해요
    <span className="mt-1.5 block text-sm font-normal text-[#575757]">
      취업 준비생과 함께하는 지속가능한 커리어 ‘선순환 커뮤니티’를 만듭니다
    </span>
  </>,
];

const STEPS = [
  {
    title: '탈락한 서류를 그대로 보내주세요',
    body: '고치지 않은 원본 그대로 보내주세요,\n탈락 요소들을 진단해드립니다.',
  },
  {
    title: '멘토가 평가자의 시선으로 분석해요',
    body: '실시간 멘토링 전, 미리 서류를 검토하고 사전질문에 대한 답변을 준비해요.',
  },
  {
    title: '실시간으로 원인과 수정안을 알려드려요',
    body: '왜 떨어졌는지, 다음엔 무엇을 바꿔야 하는지 직접 알려드리고 궁금한 점은 바로 질문해요.',
  },
];

// 9명 멘토 공개 후기(/api/v1/mentor/{id}의 reviewList, 2026-10-30) 중 별점 높고 긴 순 3건. 본문은 원문 그대로.
const REVIEWS = [
  {
    mentorId: 5895,
    score: 5,
    program: "현직 PM이 알려주는 '합격하는 포트폴리오' 1대1 멘토링",
    date: '2026.10.28',
    review:
      '제가 지원하는 직무와 일치하는 멘토님을 만날 수 있어서 좋았어요. 서비스기획자로서 어떤 인사이트를 가지고 계신지, 또 웹/앱 서비스기획자와 달리 모빌리티 산업에서의 서비스기획에서 좀 더 중점적으로 생각해봐야할 것들이 무엇인지 알려주셔서 큰 도움이 되었습니다. 정해진 시간을 초과했음에도 편하게 더 질문거리 없냐고 물어봐주시고 친절히 멘토님의 생각을 잘 설명해주셔서 정말 감사했습니다. 서비스기획자/PM의 꿈을 가지고 계시면 꼭 한번 신청해서 얘기 나눠보시면 좋을 것 같아요.',
  },
  {
    mentorId: 5357,
    score: 5,
    program: '면접 준비 7일 끝장 챌린지 6기',
    date: '2026.07.14',
    review:
      '경험 정리가 더 상세하게 진행되어야 한다는 점이 가장 기억에 남습니다.\n스스로 정리하면서 어떤 기준으로 선택을 하였는지, 결과는 어땠는지 다시 돌아볼 수 있는 시간이 되었습니다.\n뿐만 아니라 컨셉/캐릭터 잡는 것이 가장 어려웠는데, 멘토님의 피드백을 보고 갈피를 잡을 수 있게 되었습니다.\n\n감사합니다 :)',
  },
  {
    mentorId: 3929,
    score: 5,
    program: '대기업 자기소개서 완성 챌린지 13기',
    date: '2026.09.09',
    review:
      '매일 제 눈으로만 보여서 안보였던 점을 멘토님 시각에서 발견해주셨습니다! STAR에서 내 생각, 나의 문제 정의 의견 부분을 너무 중시하다보니 자꾸 S 부분을 놓치는 것과 나의 이야기를 타인에게 할 때는 좀 더 쉽게 설명할 필요가 있다는 것 다시 한 번 배우고 가요! 멘토님 감사합니다!!',
  },
];

// 진행·일정·시간 답변은 letscareer.co.kr/live-mentoring/{id} 하단 FAQ·멘토링 프로세스 기준 (2026-10-30)
const FAQS: { question: string; answer: ReactNode }[] = [
  {
    question: '멘토의 소속과 경력은 어디서 볼 수 있나요?',
    answer:
      '멘토 카드의 "상세보기"를 누르면 멘토 상세페이지에서 소속, 경력, 멘토링에서 다루는 내용을 확인할 수 있어요.',
  },
  {
    question: '꼭 떨어진 서류를 고치지 않고 그대로 가져가도 되나요?',
    answer:
      '네, 고치지 않은 원본 그대로 가져와 주세요. 손보기 전 서류여야 어디서 탈락했는지 정확히 짚을 수 있어요. 예약 후 마이페이지 신청현황에서 올려주시면 멘토가 미리 검토해요.',
  },
  {
    question: '멘토링은 어떻게 진행되나요?',
    answer:
      '100% 온라인으로 진행돼요. 상세페이지에서 플랜과 주제, 예약일시를 골라 신청한 뒤 마이페이지 신청현황에서 사전 질문과 서류를 제출해요. 입장 링크는 카카오톡 알림톡으로 보내드리고, 예약한 시간에 입장해 멘토와 실시간으로 멘토링을 진행해요.',
  },
  {
    question: '예약한 일정을 변경할 수 있나요?',
    answer: '멘토링 시작 전까지 마이페이지 신청현황에서 변경할 수 있어요.',
  },
  {
    question: '멘토링 시간이 부족하면 연장할 수 있나요?',
    answer:
      '예약한 시간 안에서 진행돼요. 더 깊게 이야기 나누고 싶다면 60분 플랜을 선택해주세요.',
  },
];

export default async function BigfirmPage() {
  const mentorImages = await getMentorImages();

  return (
    <div className={styles.root}>
      <Hero />

      {/* 공감 */}
      <Section>
        <SectionHead
          eyebrow="혹시 이런 고민 하고 있진 않나요?"
          title={
            <>
              도착한 결과 문자,
              <br />
              여전히 막막할 뿐이라면
            </>
          }
        />
        <div className="grid items-stretch gap-8 min-[861px]:grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)] min-[861px]:gap-12">
          <div
            aria-label="불합격 안내 문자 예시"
            className="flex max-w-[380px] flex-col rounded-[30px] border border-[#e3e5f0] bg-white p-[22px]"
          >
            <div className="mb-3 flex justify-between text-xs text-[#6e6e78]">
              <span>○○그룹 채용</span>
              <span>오후 6:02</span>
            </div>
            <div className="grid gap-2 rounded-[18px_18px_18px_4px] bg-[#f6f7ff] px-4 py-3.5 text-sm leading-[1.7] text-[#575757]">
              <p>
                [Web발신]
                <br />
                [○○그룹] 하반기 신입 채용 서류전형 결과 안내
              </p>
              <p>
                안녕하세요, ○○그룹 채용 담당자입니다. 귀하의 뛰어난 역량에도
                불구하고{' '}
                <b className="text-[#1c1c1c]">
                  아쉽게도 이번 서류전형에서는 좋은 소식을 전해드리지 못하게
                  되었습니다.
                </b>
              </p>
              <p>앞날에 건승을 기원합니다.</p>
            </div>
            <p className="mt-auto pt-3.5 text-right text-base font-bold leading-[1.4] tracking-[-0.02em] text-[#575757]">
              …그래서, <em className="text-primary not-italic">어디가 문제</em>
              였을까요?
            </p>
          </div>
          <div>
            <ul className="grid gap-2.5">
              {WORRIES.map((worry, i) => (
                <li
                  key={worry}
                  className="flex items-start gap-3.5 rounded-[15px] border border-[#e3e5f0] bg-white px-[18px] py-4 font-medium"
                >
                  <input
                    id={`worry-${i}`}
                    type="checkbox"
                    className="accent-primary mt-[3px] size-[18px] shrink-0 cursor-pointer"
                  />
                  <label htmlFor={`worry-${i}`} className="cursor-pointer">
                    {worry}
                  </label>
                </li>
              ))}
            </ul>
            <p className="mt-7 text-[19px] font-medium leading-[1.6]">
              이력이나 노력의 문제가 아니라,
              <br />
              <strong className={HIGHLIGHT}>
                평가자의 시선에서 서류를 볼 기회가 없었기 때문
              </strong>
              일지도 몰라요.
            </p>
          </div>
        </div>
      </Section>

      {/* 현직자 피드백이 필요한 이유 */}
      <Section cool id="why">
        <SectionHead
          eyebrow="현직자 피드백이 필요한 이유"
          title={
            <>
              취준생은 못 보는 한 줄,
              <br />
              현직자는 볼 수 있어요
            </>
          }
        />
        <div className="grid gap-4 min-[861px]:grid-cols-3">
          {REASONS.map((reason) => (
            <div
              key={reason.tag}
              className="grid content-start gap-2.5 rounded-[20px] border border-[#e3e5f0] bg-white px-6 py-7"
            >
              <span
                className={`justify-self-start rounded-full px-2.5 py-1 text-[13px] font-bold ${reason.tagClass}`}
              >
                {reason.tag}
              </span>
              <h3 className="text-xl font-extrabold">{reason.title}</h3>
              <p className="text-[15px] text-[#575757]">{reason.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-4 rounded-[20px] border border-[#e3e5f0] bg-white px-[18px] py-[22px] sm:p-7">
          <h3 className="text-xl font-extrabold">같은 문장, 다른 피드백</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <article
              aria-label="PM 지원자의 자기소개서 문항 예시"
              className="rounded-xs flex flex-col bg-[#fffdf8] px-5 pb-3.5 pt-4 text-[15px] leading-[1.75] text-[#26262b] shadow-[0_14px_32px_-20px_rgba(40,50,140,.35)] sm:px-6"
            >
              <div className="mb-3.5 flex items-baseline justify-between gap-3 border-b border-[#e4e0d4] pb-2 text-xs text-[#77777f]">
                <b className="text-[13px] text-[#26262b]">
                  신입 공채 · 서비스기획(PM) · 자기소개서
                </b>
                <span className="shrink-0">3번 문항</span>
              </div>
              <p className="mb-2 text-[13px] font-bold text-[#4a4a52]">
                Q. 지원 직무와 관련해 성과를 만들어낸 경험을 기술하시오. (800자)
              </p>
              <p className="mb-2.5 text-[#8a8a90]">
                <span>
                  교내 중고거래 앱 운영 동아리에서 서비스 기획을
                  맡았습니다.{' '}
                </span>
                <span className="text-[#26262b]">
                  서비스 개선 프로젝트에서 사용자 인터뷰를 진행하고{' '}
                  <mark className="bg-transparent bg-[linear-gradient(transparent_55%,#c7caff_55%)] font-semibold text-inherit">
                    기능을 개선해 만족도를 높였습니다
                  </mark>
                  .
                </span>
                <span>
                  {' '}
                  이 경험을 통해 사용자 중심으로 생각하는 자세를 배웠습니다…
                </span>
              </p>
              <p className="mt-auto border-t border-[#e4e0d4] pt-2 text-right text-xs tabular-nums text-[#77777f]">
                612 / 800자
              </p>
            </article>
            <div className="grid grid-rows-[auto_1fr] gap-3">
              <div className="grid content-start gap-2 rounded-[15px] bg-[#f6f7ff] px-5 py-[18px]">
                <p className="text-[13px] font-extrabold text-[#6e6e78]">
                  흔히 듣는 피드백
                </p>
                <p className="text-[15px] leading-[1.65] text-[#575757]">
                  &quot;좀 더 구체적으로 써보세요. 성과를 강조하면 좋을 것
                  같아요.&quot;
                </p>
              </div>
              <div className="grid content-start gap-2 rounded-[15px] bg-[#e9eaff] px-5 py-[18px] shadow-[inset_0_0_0_1.5px_#4d55f5]">
                <p className="text-primary text-[13px] font-extrabold">
                  대기업 현직 멘토의 피드백
                </p>
                <p className="text-[15px] font-semibold leading-[1.65]">
                  &quot;PM 서류라면 &quot;왜 이 기능이었는지&quot;가 먼저 보여야
                  해요. 몇 명의 인터뷰이에게서 문제를 발견했고, 개선 후 어떤
                  지표가 얼마나 바뀌었는지 숫자로 명시합니다.&quot;
                </p>
                <ul
                  aria-label="흔히 듣는 피드백보다 나아진 점"
                  className="mt-1 flex flex-wrap gap-1.5"
                >
                  {MENTOR_FEEDBACK_POINTS.map((point) => (
                    <li
                      key={point}
                      className="text-primary rounded-full bg-white px-2.5 py-1 text-xs font-bold"
                    >
                      ✓ {point}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* 진행 방식 */}
      <Section id="how">
        <SectionHead
          eyebrow="진행 방식"
          title={
            <>
              고치지 않은 탈락 서류가
              <br />
              가장 정확한 진단서예요
            </>
          }
        />
        <ol className="grid gap-4 min-[861px]:grid-cols-3">
          {STEPS.map((step, i) => (
            <li
              key={step.title}
              className="grid content-start gap-2 rounded-[20px] border border-[#e3e5f0] bg-white px-6 py-[26px]"
            >
              <span className="text-primary text-xs font-extrabold tracking-[.08em]">
                STEP {i + 1}
              </span>
              <h3 className="text-[19px] font-extrabold">{step.title}</h3>
              <p className="whitespace-pre-line text-[15px] text-[#575757]">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </Section>

      {/* 기업별 멘토 추천 */}
      <Section cool id="mentors-by-company">
        <SectionHead
          eyebrow="기업별 멘토 추천"
          title={
            <>
              가고 싶은 기업,
              <br />
              지금 다니는 사람에게 물어보세요
            </>
          }
          lede="100대 기업·네카라쿠배 현직 멘토 중 내 지원 직무와 가까운 분을 골라보세요."
          className="mb-16"
        />
        <div className="mb-16 grid gap-6 min-[861px]:grid-cols-[auto_1fr] min-[861px]:gap-x-0">
          <div className="grid content-start gap-3">
            {/* 체크 카드 왼쪽 끝을 아래 "…현직 멘토 9명"의 "멘토" 위치에 맞추는 폭 기준 */}
            <span
              aria-hidden
              className="invisible -mb-3 h-0 whitespace-pre text-[22px] font-extrabold max-[860px]:hidden"
            >
              지금 만날 수 있는 대기업 현직{' '}
            </span>
            <h3 className="text-[22px] font-extrabold">
              렛츠커리어 멘토님들의
              <br className="max-[860px]:hidden" /> 3가지 공통점
            </h3>
          </div>
          <ul className="grid gap-2.5">
            {COMMONS.map((item, i) => (
              <li
                key={i}
                className="flex items-center gap-3.5 rounded-[15px] border border-[#e3e5f0] bg-white px-[18px] py-4 text-[18px] font-semibold"
              >
                <svg
                  aria-hidden
                  viewBox="0 0 20 20"
                  className="text-primary size-6 shrink-0"
                >
                  <circle cx="10" cy="10" r="10" fill="currentColor" />
                  <path
                    d="M6 10.4l2.6 2.6L14 7.6"
                    fill="none"
                    stroke="#fff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <MentorFinder images={mentorImages} />
      </Section>

      {/* 할인 쿠폰 */}
      <Section id="coupon">
        <div className="grid items-center gap-8 min-[861px]:grid-cols-2 min-[861px]:gap-12">
          <div>
            <SectionHead
              eyebrow="할인 쿠폰"
              title={
                <>
                  멘토링{' '}
                  <span className="text-primary">
                    {COUPON.amount} 할인 쿠폰
                  </span>
                  으로
                  <br />
                  지금 바로 서류 진단 받으세요!
                </>
              }
              className="mb-7"
            />
            <ol className="grid gap-3.5">
              {[
                <>원하는 멘토 상세페이지에서 멘토링을 신청해요.</>,
                <>
                  결제창의 <b className="font-extrabold">쿠폰 등록</b> 칸에{' '}
                  <b className="font-extrabold">{COUPON.code}</b>를 입력하고
                  등록해요.
                </>,
                <>
                  결제 금액에서 {COUPON.amount} 할인 적용을 확인하고 신청을
                  완료해요.
                </>,
              ].map((text, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-primary grid size-[26px] shrink-0 place-items-center rounded-full bg-[#e9eaff] text-[13px] font-extrabold">
                    {i + 1}
                  </span>
                  <span>{text}</span>
                </li>
              ))}
            </ol>
          </div>
          <CouponTicket />
        </div>
      </Section>

      {/* 후기 */}
      <Section cool id="reviews">
        <SectionHead
          eyebrow="후기"
          title="멘토님께 직접 남겨주신 후기"
          lede="9명의 멘토님께 남겨진 후기를 모았어요."
        />
        <div className="grid gap-4 min-[961px]:grid-cols-3">
          {REVIEWS.map((review) => {
            const mentor = MENTORS.find((m) => m.id === review.mentorId)!;
            return (
              <article
                key={review.mentorId}
                className="grid grid-rows-[auto_auto_1fr_auto] gap-3.5 rounded-[20px] border border-[#e3e5f0] bg-white p-6"
              >
                <div className="grid gap-0.5 text-[13px]">
                  <span className="font-bold text-[#575757]">
                    {review.program}
                  </span>
                  <span className="text-[#6e6e78]">{review.date} 작성</span>
                </div>
                <p
                  aria-label={`별점 ${review.score}점`}
                  className="text-primary text-[15px] tracking-[.1em]"
                >
                  {'★'.repeat(review.score)}
                </p>
                <p className="whitespace-pre-line text-[15px] leading-[1.7]">
                  {review.review}
                </p>
                <div className="grid gap-1 border-t border-[#e3e5f0] pt-3 text-[13px] text-[#6e6e78]">
                  <span className="font-bold text-[#575757]">
                    {mentor.name} 멘토 · {mentor.org}
                  </span>
                  <Link
                    href={mentorDetailUrl(mentor.id)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary mt-1 font-bold"
                  >
                    이 멘토 보기 →
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
        <div className="mt-8 flex justify-center">
          <Link
            href={LETSCAREER_REVIEW_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:border-primary hover:text-primary rounded-full border border-[#e3e5f0] bg-white px-5 py-2.5 text-sm font-bold text-[#575757]"
          >
            더 자세한 후기가 궁금하다면 →
          </Link>
        </div>
      </Section>

      {/* FAQ */}
      <Section id="faq">
        <SectionHead eyebrow="FAQ" title="신청 전에 많이 묻는 질문" />
        <div className="grid gap-2.5">
          {FAQS.map((faq, i) => (
            <details
              key={faq.question}
              open={i === 0}
              className="group rounded-[15px] border border-[#e3e5f0] bg-white"
            >
              <summary className="flex cursor-pointer list-none items-start gap-3 px-[22px] py-5 text-[18px] font-bold [&::-webkit-details-marker]:hidden">
                <span className="text-primary font-extrabold">Q</span>
                <span className="flex-1">{faq.question}</span>
                <svg
                  aria-hidden
                  viewBox="0 0 20 20"
                  className="mt-1 size-5 shrink-0 text-[#6e6e78] group-open:hidden"
                >
                  <path
                    d="M5 7.5l5 5 5-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <svg
                  aria-hidden
                  viewBox="0 0 20 20"
                  className="mt-1 hidden size-5 shrink-0 text-[#6e6e78] group-open:block"
                >
                  <path
                    d="M5.5 5.5l9 9M14.5 5.5l-9 9"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </summary>
              <p className="px-[22px] pb-5 pl-[46px] text-[15px] text-[#575757]">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
        <div className="mt-4 flex flex-col items-center justify-between gap-3 rounded-[15px] bg-[#f6f7ff] px-[22px] py-4 md:flex-row">
          <p className="font-semibold">아직 궁금증이 풀리지 않았다면?</p>
          <a
            href={LETSCAREER_CHAT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:border-primary hover:text-primary rounded-sm border border-[#e3e5f0] bg-white px-4 py-2 text-sm font-bold text-[#575757]"
          >
            1:1 채팅 문의하기
          </a>
        </div>
      </Section>

      {/* 마지막 CTA — letscareer.co.kr/mentor-join 하단 CTA 디자인 참고 */}
      <section className="relative isolate overflow-hidden bg-[linear-gradient(135deg,#09042a,#5144b6)] text-center">
        <svg
          aria-hidden
          viewBox="0 0 1336 1336"
          className="absolute left-[calc(50%-650px)] top-[-253px] -z-10 size-[1336px] max-w-none"
        >
          <path
            d="M1271.72 1242.03C1179.55 1293.74 1011.02 1188.02 847.945 992.383C899.589 1150.26 897.757 1276.23 832.047 1313.09C757.981 1354.64 623.573 1271.29 494.414 1116.54C514.59 1214.99 499.775 1294.66 447.153 1324.18C359.829 1373.16 201.457 1265.49 93.4213 1083.68C-14.6149 901.871 -31.4049 714.777 55.9197 665.793C108.541 636.275 186.96 663.643 264.618 729.839C191.262 543.784 184.17 389.01 258.237 347.462C323.948 310.602 437.155 372.05 552.055 494.444C459.219 259.415 449.249 64.7557 541.421 13.0521C666.171 -56.9256 930.784 161.463 1132.45 500.837C1334.12 840.211 1396.47 1172.06 1271.72 1242.03Z"
            fill="url(#cta-glow)"
            fillOpacity="0.5"
          />
          <defs>
            <radialGradient
              id="cta-glow"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(668 668) rotate(90) scale(668)"
            >
              <stop stopColor="#4E40B2" stopOpacity="0.6" />
              <stop offset="1" stopColor="#898EFF" stopOpacity="0.2" />
            </radialGradient>
          </defs>
        </svg>
        <div className="mx-auto grid max-w-[1080px] justify-items-center gap-10 px-5 py-16 sm:gap-14 sm:py-24">
          <Image
            src="/images/bigfirm/logo-letscareer-white.svg"
            alt="렛츠커리어"
            width={220}
            height={35}
            unoptimized
            className="h-auto w-[180px] sm:w-[220px]"
          />
          <div className="grid gap-4">
            <h2 className="text-[28px] font-bold leading-[1.4] sm:text-[40px] min-[1024px]:text-[48px]">
              <span className="bg-gradient-to-b from-[#c4a3ff] to-[#5b54ff] to-70% box-decoration-clone bg-clip-text text-transparent">
                탈락 이유를 확인했다면,
              </span>
              <br />
              <span className="text-[#edeefe]">
                다음 공채의 결과는 달라져요
              </span>
            </h2>
            <p className="text-[17px] text-white/70">
              대기업 현직자와 함께, 이번엔 다르게 준비해보세요.
            </p>
          </div>
          <a
            href="#mentors-by-company"
            className="flex h-12 items-center justify-center gap-2 rounded-sm bg-[linear-gradient(272deg,#9762f5_1.88%,#544cff_98.12%)] px-7 py-4 text-lg font-semibold leading-none text-white hover:brightness-110 sm:h-16 sm:px-10 sm:py-6 sm:text-[22px]"
          >
            대기업 멘토 찾기
          </a>
        </div>
      </section>

      <MobileDock />
    </div>
  );
}

function Section({
  id,
  cool,
  children,
}: {
  id?: string;
  cool?: boolean;
  children: ReactNode;
}) {
  return (
    <section id={id} className={cool ? 'bg-[#f6f7ff]' : undefined}>
      <div className="mx-auto max-w-[1080px] px-5 py-16 md:py-[5.5rem]">
        {children}
      </div>
    </section>
  );
}

function SectionHead({
  eyebrow,
  title,
  lede,
  className = 'mb-10',
}: {
  eyebrow: string;
  title: ReactNode;
  lede?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`grid gap-3 ${className}`}>
      <p className={styles.eyebrow}>{eyebrow}</p>
      <h2 className="text-[clamp(26px,4.2vw,38px)] font-extrabold leading-[1.3]">
        {title}
      </h2>
      {lede && (
        <p className="max-w-[36em] text-[17px] text-[#575757]">{lede}</p>
      )}
    </div>
  );
}
