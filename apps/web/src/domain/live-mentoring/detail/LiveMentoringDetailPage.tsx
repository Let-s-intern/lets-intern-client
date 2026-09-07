'use client';

import {
  useLiveMentorDetailQuery,
  useLiveMentorSlotsQuery,
} from '@/api/live-mentoring/liveMentoring';
import type { LiveMentorDetail } from '@/api/live-mentoring/liveMentoringSchema';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useAuthStore } from '@letscareer/store';

import ApplySheet from '../apply/ApplySheet';
import { useApplySheetState } from '../apply/hooks/useApplySheetState';
import { useOrderDraftStore } from '../order/hooks/useOrderDraft';
import { formatDetailPeriod, slotPeriod } from '../constants';
// ⚠️ 임시 — 백엔드 연동 후 이 import 와 아래 isError 분기를 함께 제거할 것.
//    상세 조건은 UnderDevelopmentNotice.tsx 상단 주석 참고.
import UnderDevelopmentNotice from '../UnderDevelopmentNotice';
import { DetailFaqSection, DetailProcessSection } from './DetailFixedSections';
import DetailHero from './DetailHero';
import DetailCTAButtons from './DetailCTAButtons';
import DetailBenefitSection from './DetailBenefitSection';
import DetailMentoringIntroSection from './DetailMentoringIntroSection';
import DetailPainSection from './DetailPainSection';
import DetailPlanSection from './DetailPlanSection';
import DetailNavigation, {
  LM_DIFFERENT_ID,
  LM_FAQ_ID,
  LM_MENTOR_INFO_ID,
  LM_MENTORING_INTRO_ID,
  LM_RESULTS_ID,
  LM_REVIEW_ID,
  LM_TYPES_ID,
  LM_VIDEO_ID,
} from './DetailNavigation';
import DetailSection from './DetailSection';

interface LiveMentoringDetailPageProps {
  mentorId: string;
  /**
   * 멘토가 지금 편집 중인 상세 템플릿. 넘어오면 서버가 준 것 대신 이걸로 그린다.
   *
   * 멘토 앱의 설정 화면이 이 페이지를 iframe 으로 띄우고 편집 중인 값을 `postMessage`
   * 로 보낸다(LC-3268). 예전에는 멘토 앱이 이 페이지의 마크업을 복제해 미리보기를
   * 그렸는데, 공개 페이지가 바뀔 때마다 따라 고쳐야 했고 실제로 어긋나 있었다.
   *
   * 템플릿만 갈아끼운다 — 평점·후기 수·가격·진행 기간은 서버가 준 진짜 값을 쓴다.
   * 그래야 미리보기가 "지금 고치는 부분만 다른" 실제 화면이 된다.
   */
  previewTemplate?: LiveMentoringDetailPageTemplate;
  /**
   * 미리보기 모드. 신청 시트와 CTA 를 열지 않는다 — 멘토가 자기 상품을 신청할 일도
   * 없고, iframe 안에서 로그인으로 튕기면 미리보기가 통째로 사라진다.
   */
  isPreview?: boolean;
}

/** 이 페이지가 그리는 템플릿의 타입. `LiveMentorDetail['template']` 과 같다. */
type LiveMentoringDetailPageTemplate = LiveMentorDetail['template'];

/**
 * 공개 멘토 상세 페이지 (PRD §5 S2).
 *
 * 시안 0~10 순서로 렌더한다.
 * - 0~5 : 멘토가 상세 페이지 설정에서 편집한 template 콘텐츠
 * - 6·7·9·10 : 운영 확정 마케팅 콘텐츠 → 시안 이미지 그대로 (`DetailFixedSections`)
 * - 8 : 후기 (노출 여부·대상만 멘토가 고름)
 *
 * 하단 CTA 를 누르면 신청 시트가 열린다. 시트 상태를 페이지가 들고 있는 이유는
 * 히어로의 플랜 카드도 같은 시트를 열기 때문이다.
 */
const LiveMentoringDetailPage = ({
  mentorId,
  previewTemplate,
  isPreview = false,
}: LiveMentoringDetailPageProps) => {
  const { data, isLoading, isError } = useLiveMentorDetailQuery(mentorId);
  // 상세 응답에는 기간도 슬롯도 없다. 진행기간은 예약 가능 슬롯에서 만든다.
  // 상세와 굳이 하나로 합치지 않는다 — 슬롯 조회가 늦거나 실패해도 본문은 그대로 뜬다.
  const { data: slots } = useLiveMentorSlotsQuery(mentorId);
  const applySheet = useApplySheetState();
  const router = useRouter();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  /**
   * 신청 시트를 열기 전에 로그인을 요구한다.
   *
   * 상세는 비회원도 본다 — 상품을 봐야 가입할 이유가 생기고, 검색 유입도 여기로
   * 들어온다. 막는 자리는 신청 시점이다. 챌린지가 같은 방식이다
   * (`domain/program/challenge/ChallengeCTAButtons.tsx` 의 `handleOpen`).
   *
   * 시트를 열어 두고 제출 때 막지 않는 이유는, 슬롯·플랜을 다 고른 뒤에 로그인으로
   * 튕기면 그 선택이 사라지기 때문이다.
   */
  const handleApplyClick = () => {
    // 미리보기에서는 아무 일도 하지 않는다. 아래 CTA 도 같은 이유로 렌더하지 않는다.
    if (isPreview) return;
    if (!isLoggedIn) {
      const redirectTo = `${window.location.pathname}${window.location.search}`;
      router.push(`/login?redirect=${encodeURIComponent(redirectTo)}`);
      return;
    }
    applySheet.open();
  };
  const setOrderDraft = useOrderDraftStore((state) => state.setDraft);

  /*
    플랜은 **항상 하나가 골라져 있어야 한다.** 상세 히어로와 신청 시트가 같은
    `draft.duration` 을 보므로, 데이터가 도착하는 시점에 첫 플랜을 잡아 둔다.
    아무것도 안 골라진 상태를 없애면 `총 결제 금액` 이 비는 화면도 사라진다.
  *
    훅이라 조기 반환보다 위에 있어야 한다. 아래로 내리면 로딩 렌더와 성공 렌더의
    훅 개수가 달라져 'Rendered more hooks than during the previous render' 가 난다.
  */
  const firstDuration = data?.durationPrices[0]?.duration ?? null;
  const hasDuration = applySheet.draft.duration !== null;
  const { selectDuration } = applySheet;
  useEffect(() => {
    if (firstDuration !== null && !hasDuration) selectDuration(firstDuration);
  }, [firstDuration, hasDuration, selectDuration]);

  if (isLoading) {
    return <p className="text-neutral-40 py-20 text-center">불러오는 중…</p>;
  }
  // ⚠️ 임시 — `GET /live-mentoring/mentors/{mentorId}` 가 미완성이라 실서버에서 500 이 온다.
  //    백엔드 연동 후 아래 한 줄을 지우고 원래 문구로 되돌릴 것:
  //      <p className="text-neutral-40 py-20 text-center">멘토 정보를 불러오지 못했습니다.</p>
  if (isError || !data) {
    return <UnderDevelopmentNotice />;
  }

  /*
    편집 중인 값이 오면 그걸 그린다. 나머지(평점·가격·기간)는 서버 값 그대로다.

    지역 변수 하나로 갈아끼우면 안 된다 — `DetailHero` 처럼 `detail` 을 통째로 받아
    안에서 `detail.template` 을 읽는 자식이 있어서, 그쪽은 서버 값을 계속 본다.
    실제로 히어로의 핵심 소개만 미리보기에 반영되지 않는 문제가 있었다.
  */
  const detail = previewTemplate
    ? { ...data, template: previewTemplate }
    : data;
  const { profile, template } = detail;
  const { intro, mentoringTypes, strategy, video, results } = template;
  // 프로필을 덜 채운 멘토는 닉네임이 null 로 온다. 문구가 "null 멘토가 함께해요"가 되지 않게 폴백한다.
  const nickname = profile.nickname ?? '멘토';
  const period = slotPeriod(slots?.liveMentoringSlotList ?? []);
  // `formatDetailPeriod` 는 `YYYY-MM-DD` 를 받는다. 슬롯은 `LocalDateTime` 이라 날짜만 자른다.
  const periodLabel = formatDetailPeriod(
    period?.beginning.slice(0, 10) ?? null,
    period?.deadline.slice(0, 10) ?? null,
  );
  const shownReviews = template.reviews.visible
    ? detail.reviews.filter((r) =>
        template.reviews.selectedReviewIds.includes(r.reviewId),
      )
    : [];

  return (
    /*
      한글은 기본 줄바꿈 규칙이 "아무 글자 사이"라 좁은 화면에서 단어가 쪼개진다
      ("과 / 연", "50,000 / 원"). word-break 는 상속되므로 페이지 루트 한 곳에
      keep-all 을 걸어 히어로·후기·FAQ 까지 전부 띄어쓰기에서만 접히게 한다.
    */
    <div className="flex flex-col break-keep">
      <DetailHero
        detail={detail}
        period={periodLabel}
        selectedDuration={applySheet.draft.duration}
        onSelectPlan={applySheet.selectDuration}
      />

      {/*
        앵커 네비는 미리보기에서 그리지 않는다. 프레임 안에서는 이동을 막아 두어
        눌러도 아무 일이 없고, 좁은 화면에서 자리만 차지해 정작 볼 본문이 밀린다.
      */}
      {isPreview ? null : <DetailNavigation isReady={!isLoading} />}

      {/* 시안 0-1 · 특별 혜택 */}
      <DetailBenefitSection />
      {/* 시안 0-2 · 취업 준비, 혼자 하기 막막하셨나요? */}
      <DetailPainSection careers={detail.profile.careers} />
      {/* 시안 0-3 · 멘토링 소개 */}
      <DetailMentoringIntroSection id={LM_MENTORING_INTRO_ID} />

      {/* 시안 1 · 멘토 소개 */}
      <DetailSection
        id={LM_MENTOR_INFO_ID}
        label="멘토 소개"
        title={
          intro.passedCount !== null
            ? `확실한 전략으로 ${intro.passedCount.toLocaleString('ko-KR')}명을 합격시킨 ${nickname} 멘토가 함께해요`
            : `${nickname} 멘토가 함께해요`
        }
      >
        {/*
          사진과 글을 화면 가운데로 모은다. 폭을 넓게 두면 둘이 양쪽 끝으로 벌어져
          가운데가 비어 보인다 — 제목은 가운데인데 본문만 넓게 퍼진 모양이 된다.
        */}
        <div className="mx-auto flex w-full max-w-[940px] flex-col items-center gap-6 md:flex-row md:items-center md:justify-center md:gap-6">
          {intro.profileImage && (
            <img
              src={intro.profileImage}
              alt={nickname}
              className="w-full max-w-[340px] shrink-0 rounded-xl"
            />
          )}

          {/*
            사진 높이에 맞춰 늘리지 않는다. 예전에는 글 칸을 사진만큼 늘리고 한마디 상자를
            `mt-auto` 로 바닥에 붙였는데, 경력이 한두 줄이면 가운데가 통째로 비었다.
            글은 제 높이만 차지하고 사진과 서로 가운데를 맞춘다.
          */}
          {/*
            폭 상한은 시안에서 잰 값이다 — 사진 340px : 글 583px, 합쳐 940px.
            (2880px 시안이 1440 화면의 2배 기준이라 절반으로 환산했다.)

            다만 남은 폭을 다 차지하게 두지는 않는다. 경력이 두어 줄뿐인 멘토는 넓은 칸의
            왼쪽에 글이 몰려 가운데가 비어 보인다. 쓴 만큼만 넓어지고, 사진과 한 덩어리로
            가운데에 놓인다.
          */}
          <div className="flex min-w-0 max-w-[583px] flex-col gap-2 text-left">
            <p className="text-small20 md:text-medium24 font-bold">
              {nickname}
            </p>
            {intro.affiliation && (
              <p className="text-xsmall14 md:text-xsmall16 font-semibold">
                {intro.affiliation}
              </p>
            )}
            {intro.careerLines.length > 0 && (
              <ul className="mt-2 flex flex-col gap-1.5">
                {intro.careerLines.map((line, i) => (
                  <li key={i} className="text-neutral-30 text-xsmall14">
                    {line}
                  </li>
                ))}
              </ul>
            )}
            {/*
              한마디 상자 — primary-5(#F5F6FF)는 흰 배경과 거의 같아 상자가 보이지
              않았다. 한 단계 진한 primary-10 에 옅은 테두리를 더해 경계를 만든다.
            */}
            {intro.oneLiner && (
              <div className="bg-primary-10 border-primary-20 mt-4 flex flex-col gap-2 rounded-md border p-5">
                <p className="text-primary text-xsmall14 flex items-center gap-1.5 font-semibold">
                  <span aria-hidden="true">💬</span> 멘토님의 한마디
                </p>
                <p className="text-neutral-30 text-xsmall14 whitespace-pre-line leading-relaxed">
                  {intro.oneLiner}
                </p>
              </div>
            )}
          </div>
        </div>
      </DetailSection>

      {/* 시안 2 · 멘토링 유형 */}
      {mentoringTypes.items.length > 0 && (
        <DetailSection
          id={LM_TYPES_ID}
          label="멘토링 유형"
          title={mentoringTypes.title}
          subtitle={mentoringTypes.subtitle}
        >
          {/*
            2열 그리드다. 카드가 홀수 개면 마지막 하나가 첫 칸에 남는다 — 줄 가운데로
            옮겨 보면 위 카드들과 세로선이 어긋나 오히려 흐트러져 보인다. 칸을 지키는
            편이 낫다.
          */}
          <ul className="mx-auto grid w-full max-w-[1000px] grid-cols-1 gap-8 md:grid-cols-2">
            {mentoringTypes.items.map((item, i) => (
              <li
                key={i}
                /* 멘토 설정의 미리보기가 편집 중인 카드로 따라올 때 쓴다(LC-3268). */
                data-preview-item={i}
                className="bg-neutral-95 flex flex-col gap-3 rounded-lg p-7"
              >
                <div className="flex items-center gap-2">
                  <span className="bg-primary text-xxsmall12 rounded-sm px-2 py-1 font-semibold text-white">
                    멘토링 유형 {i + 1}
                  </span>
                  <span className="text-xsmall14 font-medium">
                    {item.typeName}
                  </span>
                </div>
                <p className="text-small18 whitespace-pre-line font-bold leading-snug">
                  {item.title}
                </p>
                <p className="text-neutral-40 text-xsmall14 whitespace-pre-line">
                  {item.description}
                </p>
                {item.tags.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-neutral-90 text-neutral-40 text-xxsmall12 rounded-sm px-2 py-1"
                      >
                        # {tag}
                      </span>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </DetailSection>
      )}

      {/* 시안 3 · 취업 성공 전략 — visible=false 면 섹션 자체를 렌더하지 않는다 */}
      {strategy.visible && strategy.points.length > 0 && (
        <DetailSection
          id={LM_DIFFERENT_ID}
          title={strategy.title}
          subtitle={strategy.subtitle}
        >
          <ul className="flex flex-col gap-4">
            {strategy.points.map((point, i) => (
              <li
                key={i}
                data-preview-item={i}
                /*
                  멘토 소개와 같은 방식이다 — 이미지와 글이 각자 제 폭만 차지하고,
                  둘을 합친 덩어리가 가운데에 놓인다. 글에 남은 폭을 다 주면 짧게 쓴
                  Point 는 왼쪽에 몰려 오른쪽이 비어 보인다.
                */
                className="bg-primary-5 flex flex-col items-center gap-5 rounded-md p-5 md:flex-row md:items-center md:justify-center md:gap-8"
              >
                {/* 이미지가 카드 높이를 좌우한다 — 비율 고정 + 상한을 둬 섹션이 늘어나지 않게 한다 */}
                {point.image ? (
                  <img
                    src={point.image}
                    alt=""
                    className="w-full max-w-[380px] shrink-0 rounded-sm"
                  />
                ) : (
                  // 이미지를 아직 안 올린 자리. 여기만 비율을 정해 둔다 —
                  // 채울 그림이 없으면 높이를 정할 근거도 없다.
                  <div className="bg-neutral-90 aspect-[4/3] w-full max-w-[380px] shrink-0 rounded-sm" />
                )}
                <div className="flex min-w-0 max-w-[520px] flex-col gap-2">
                  <span className="bg-primary text-xxsmall12 w-fit rounded-full px-3 py-1 font-semibold text-white">
                    Point {i + 1}
                  </span>
                  <p className="text-xsmall16 md:text-small18 whitespace-pre-line font-bold">
                    {point.title}
                  </p>
                  <p className="text-neutral-40 text-xsmall14 whitespace-pre-line leading-relaxed">
                    {point.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </DetailSection>
      )}

      {/* 시안 4 · 이렇게 도와드려요(영상) — 다크 배경 */}
      {video.visible && video.videoUrl && (
        <DetailSection
          id={LM_VIDEO_ID}
          dark
          title={video.title}
          subtitle={video.subtitle}
        >
          {/* 폭을 안 잡으면 mw-1180 에서 16:9 높이가 660px 을 넘어 한 화면에 안 들어온다 */}
          <div className="mx-auto aspect-video w-full max-w-[820px] overflow-hidden rounded-md bg-black">
            <iframe
              src={video.videoUrl}
              title={video.title}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          {video.caption && (
            <p className="text-xsmall14 md:text-xsmall16 text-center text-white/80">
              {video.caption}
            </p>
          )}
        </DetailSection>
      )}

      {/* 시안 5 · 결과 사례(Before/After) — 다크 배경 */}
      {results.visible && results.cases.length > 0 && (
        <DetailSection
          id={LM_RESULTS_ID}
          dark
          label={results.subtitle}
          title={results.title}
        >
          {/* 카드 폭을 안 잡으면 mw-1180 절반(약 570px)까지 이미지가 커져 한눈에 안 들어온다 */}
          <ul className="mx-auto flex w-full max-w-[840px] flex-col gap-8">
            {/*
              전·후 카드와 설명을 각각 같은 줄에 놓는다.

              예전에는 [카드+설명]을 한 덩이로 세로로 쌓았다. 올린 이미지 비율이 서로
              다르면 카드 높이가 달라지고, 그만큼 설명 줄도 어긋나 무엇과 무엇을 견주는
              건지 읽기 어려웠다. 카드 줄과 설명 줄을 나눠 각 줄에서 나란히 맞춘다.
            */}
            {results.cases.map((item, i) => (
              <li
                key={i}
                data-preview-item={i}
                className="grid grid-cols-1 gap-x-5 gap-y-3 md:grid-cols-2"
              >
                {/*
                  카드는 제 이미지 높이만큼만 차지하고 **아래를 맞춘다**.

                  같은 높이로 늘리면 짧은 쪽 카드 안이 배경색으로 비고, 그 여백이 설명과
                  카드 사이를 벌린다. 아래를 맞추면 두 설명이 나란하면서도 카드와 붙는다.

                  `order` 로 좁은 화면의 순서를 바꾼다. 한 줄짜리 그리드에서는 DOM 순서
                  그대로 [전 카드][후 카드][전 설명][후 설명] 이 되어, 전 설명이 화면
                  맨 아래에서 후 설명과 붙어 버린다. 좁을 때는 전·후를 각각 묶는다.
                */}
                <div className="order-1 self-end overflow-hidden rounded-md">
                  <p className="text-neutral-30 text-xsmall14 bg-neutral-75 py-2.5 text-center font-semibold">
                    Before
                  </p>
                  <div className="bg-neutral-85 p-4">
                    {item.beforeImage && (
                      <img
                        src={item.beforeImage}
                        alt=""
                        className="w-full rounded-sm bg-white"
                      />
                    )}
                  </div>
                </div>

                <div className="order-3 mt-5 self-end overflow-hidden rounded-md md:order-2 md:mt-0">
                  <p className="bg-primary text-xsmall14 py-2.5 text-center font-semibold text-white">
                    After
                  </p>
                  <div className="bg-primary-20 p-4">
                    {item.afterImage && (
                      <img
                        src={item.afterImage}
                        alt=""
                        className="w-full rounded-sm bg-white"
                      />
                    )}
                  </div>
                </div>

                <p className="text-xsmall14 order-2 whitespace-pre-line text-center text-white/70 md:order-3">
                  {item.beforeCaption}
                </p>
                <p className="text-xsmall14 order-4 whitespace-pre-line text-center font-medium text-white">
                  ✓ {item.afterCaption}
                </p>
              </li>
            ))}
          </ul>
        </DetailSection>
      )}

      {/* 시안 6 · 플랜 */}
      <DetailPlanSection durationPrices={detail.durationPrices} />

      {/* 시안 7 · 진행 프로세스 */}
      <DetailProcessSection period={periodLabel} />

      {/* 시안 8 · 후기 (노출 여부·대상만 멘토가 고름) */}
      {shownReviews.length > 0 && (
        <DetailSection
          id={LM_REVIEW_ID}
          label="후기"
          title={`${detail.reviewCount}명이 만족한 렛츠커리어 수강생의 솔직한 멘토링 후기`}
          subtitle="이미 피드백을 경험한 수강생분들의 솔직한 후기를 확인해보세요!"
        >
          <ul className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {shownReviews.map((r) => (
              <li
                key={r.reviewId}
                className="border-neutral-85 flex flex-col gap-3 rounded-md border p-5"
              >
                <div className="text-neutral-40 text-xxsmall12 flex items-center gap-2">
                  <span className="text-primary font-semibold">
                    ★ {r.score}
                  </span>
                  <span>{r.menteeName}</span>
                  <span className="ml-auto">{r.createdAt}</span>
                </div>
                <p className="text-neutral-20 text-xsmall14 leading-relaxed">
                  {r.content}
                </p>
              </li>
            ))}
          </ul>
        </DetailSection>
      )}

      {/* 시안 10 · 자주 묻는 질문 */}
      <DetailFaqSection id={LM_FAQ_ID} />

      {/*
        하단 고정 신청 CTA — 챌린지·라이브 상페와 같은 공용 컴포넌트.
        예약 가능한 슬롯이 없어도 바는 남긴다. 감추면 상품이 없는 것처럼 보인다 —
        비활성 상태로 두는 판단은 `DetailCTAButtons` 안에 있다.
      */}
      {isPreview ? null : (
        <DetailCTAButtons
          title={detail.title}
          beginning={period?.beginning ?? null}
          deadline={period?.deadline ?? null}
          onApplyClick={handleApplyClick}
        />
      )}

      {/*
        `신청하기` 는 선택값을 넘기고 결제 페이지로 보내기만 한다. 신청 생성은
        결제 페이지의 `결제하기` 시점이다(PRD 7-4 안 A) — 여기서 만들면 질문·쿠폰이
        정해지기도 전에 슬롯이 10분 선점된다.
      */}
      <ApplySheet
        detail={detail}
        slots={slots?.liveMentoringSlotList ?? []}
        sheet={applySheet}
        onSubmit={(draft) => {
          // 시트는 필수 입력이 다 차야 `신청하기` 를 열어 주므로 여기서 다시 묻지 않는다
          if (draft.duration === null) return;
          if (draft.mentoringCategory === null) return;
          const plan = data.durationPrices.find(
            (option) => option.duration === draft.duration,
          );
          if (!plan) return;

          setOrderDraft({
            mentorId: data.mentorId,
            openingId: data.openingId,
            productName: data.title,
            thumbnail: data.profile.profileImage,
            duration: draft.duration,
            durationPriceId: plan.durationPriceId ?? null,
            price: plan.price,
            slots: draft.slots,
            mentoringCategory: draft.mentoringCategory,
            reservationChangeAgreed: draft.agreedToScheduleChange,
          });
          applySheet.close();
          router.push(`/live-mentoring/order?mentorId=${data.mentorId}`);
        }}
      />
    </div>
  );
};

export default LiveMentoringDetailPage;
