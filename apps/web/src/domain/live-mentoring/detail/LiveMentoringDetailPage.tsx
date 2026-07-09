'use client';

import { useLiveMentorDetailQuery } from '@/api/live-mentoring/liveMentoring';
import { CATEGORY_LABELS, durationLabel, formatPrice } from '../constants';
import {
  displayTitle,
  mosaicStyle,
  shouldShowImage,
  visibleChecklist,
} from '../utils/profileDisplay';
import DetailSection from './DetailSection';

interface LiveMentoringDetailPageProps {
  mentorId: string;
}

/**
 * 공개 멘토 상세 페이지 (PRD §5 S2).
 * 멘토가 상세 페이지 설정에서 편집한 template 콘텐츠를 렌더한다.
 * 결제/예약은 범위 밖 — "신청" CTA 는 비활성(표시만).
 */
const LiveMentoringDetailPage = ({
  mentorId,
}: LiveMentoringDetailPageProps) => {
  const { data, isLoading, isError } = useLiveMentorDetailQuery(mentorId);

  if (isLoading) {
    return <p className="text-neutral-40 py-20 text-center">불러오는 중…</p>;
  }
  if (isError || !data) {
    return (
      <p className="text-neutral-40 py-20 text-center">
        멘토 정보를 불러오지 못했습니다.
      </p>
    );
  }

  const { profile, template } = data;
  // 상세의 profile 은 `visible`, 카드는 `profileVisible` 을 쓰므로 공용 헬퍼 입력으로 정규화.
  const profileDisplay = {
    nickname: profile.nickname,
    profileVisible: profile.visible,
    mosaicEnabled: profile.mosaicEnabled,
    mosaicBlur: profile.mosaicBlur,
  };
  const title = displayTitle(profileDisplay);
  const showImage = shouldShowImage(profileDisplay);
  const visibleCareers = template.careers.filter((c) => c.visible);
  const shownReviews = template.reviews.visible
    ? data.reviews.filter((r) =>
        template.reviews.selectedReviewIds.includes(r.reviewId),
      )
    : [];
  const checklist = visibleChecklist(template.checklist);

  return (
    <div className="mw-1180 flex flex-col px-5 py-10">
      {/* 헤더: 프로필 + 메타 + CTA */}
      <div className="flex flex-col gap-6 pb-8 md:flex-row md:items-center">
        <div className="bg-neutral-90 flex aspect-[4/3] w-full max-w-[280px] items-center justify-center overflow-hidden rounded-md">
          {showImage && profile.profileImage ? (
            <img
              src={profile.profileImage}
              alt={profile.nickname}
              className="h-full w-full object-cover"
              style={mosaicStyle(profile)}
            />
          ) : (
            <span className="text-neutral-40 text-xsmall14 px-4 text-center font-medium">
              {title}
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-3">
          <span className="text-primary text-xsmall14 font-semibold">
            {CATEGORY_LABELS[data.category]} · {durationLabel(data.durationMin)}
          </span>
          <h1 className="text-medium22 md:text-medium24 font-bold">{title}</h1>
          <div className="text-neutral-40 text-xsmall14 flex items-center gap-2">
            <span className="text-primary font-semibold">
              ★ {data.rating.toFixed(1)}
            </span>
            <span>후기 {data.reviewCount}</span>
          </div>
          <div className="mt-2 flex items-center justify-between gap-4">
            <span className="text-medium22 font-bold">
              {formatPrice(data.price)}
            </span>
            <button
              type="button"
              disabled
              aria-disabled="true"
              className="bg-neutral-70 text-neutral-40 rounded-sm px-6 py-3 text-sm font-semibold"
            >
              신청하기 (준비 중)
            </button>
          </div>
        </div>
      </div>

      {/* 멘토 자기소개 + 이력 (편집 가능) */}
      <DetailSection title="멘토 소개">
        <p className="text-neutral-20 text-xsmall16 whitespace-pre-line">
          {template.introduction}
        </p>
        {visibleCareers.length > 0 && (
          <ul className="mt-2 flex flex-col gap-1">
            {visibleCareers.map((c, i) => (
              <li key={i} className="text-neutral-30 text-xsmall14">
                {c.company} · {c.position}
                <span className="text-neutral-50"> ({c.period})</span>
              </li>
            ))}
          </ul>
        )}
      </DetailSection>

      {/* 멘토링 포인트 (편집 가능) */}
      <DetailSection title="이런 점을 위주로 멘토링해요">
        <p className="text-neutral-20 text-xsmall16 whitespace-pre-line">
          {template.mentoringPoints}
        </p>
      </DetailSection>

      {/* 후기 (노출 여부·선택 편집 가능) */}
      {shownReviews.length > 0 && (
        <DetailSection title="멘티 후기">
          <ul className="flex flex-col gap-4">
            {shownReviews.map((r) => (
              <li
                key={r.reviewId}
                className="border-neutral-85 rounded-md border p-4"
              >
                <div className="text-neutral-40 text-xxsmall12 mb-1 flex items-center gap-2">
                  <span className="text-primary font-semibold">
                    ★ {r.score}
                  </span>
                  <span>{r.menteeName}</span>
                  <span className="ml-auto">{r.createdAt}</span>
                </div>
                <p className="text-neutral-20 text-xsmall14">{r.content}</p>
              </li>
            ))}
          </ul>
        </DetailSection>
      )}

      {/* 피드백 과정 (편집 불가) */}
      {template.process.length > 0 && (
        <DetailSection title="피드백 과정">
          <ol className="flex flex-col gap-3">
            {template.process.map((step) => (
              <li key={step.step} className="flex gap-3">
                <span className="bg-primary text-xxsmall12 flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-bold text-white">
                  {step.step}
                </span>
                <div>
                  <p className="text-xsmall16 font-semibold">{step.title}</p>
                  <p className="text-neutral-40 text-xsmall14">{step.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </DetailSection>
      )}

      {/* 제출물 + 체크리스트 (제출물 설정 편집 불가 / 체크리스트 편집 가능) */}
      <DetailSection title="제출물 안내">
        <p className="text-xsmall16 font-semibold">
          {template.submissionSpec.title}
        </p>
        <p className="text-neutral-40 text-xsmall14">
          {template.submissionSpec.desc}
        </p>
        {checklist.length > 0 && (
          <ul className="mt-2 flex flex-col gap-1.5">
            {checklist.map((item) => (
              <li
                key={item.id}
                className="text-neutral-30 text-xsmall14 flex items-start gap-2"
              >
                <span className="text-primary">✓</span>
                {item.text}
              </li>
            ))}
          </ul>
        )}
      </DetailSection>

      {/* 자주 묻는 질문 (편집 불가) */}
      {template.faq.length > 0 && (
        <DetailSection title="자주 묻는 질문">
          <ul className="flex flex-col gap-4">
            {template.faq.map((item, i) => (
              <li key={i}>
                <p className="text-xsmall16 font-semibold">Q. {item.q}</p>
                <p className="text-neutral-40 text-xsmall14">A. {item.a}</p>
              </li>
            ))}
          </ul>
        </DetailSection>
      )}
    </div>
  );
};

export default LiveMentoringDetailPage;
