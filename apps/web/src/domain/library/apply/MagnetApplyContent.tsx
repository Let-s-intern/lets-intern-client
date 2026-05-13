'use client';

import { usePostMagnetApplicationMutation } from '@/api/magnet/magnet';
import { MagnetType } from '@/api/magnet/magnetSchema';
import { usePatchUser, useUserQuery } from '@/api/user/user';
import MarketingConsentSection from '../ui/MarketingConsentSection';
import CareerInfoForm, {
  CareerInfoSelections,
  CareerInfoValues,
} from '@/domain/mypage/career/CareerInfoForm';
import { GRADE_ENUM_TO_KOREAN, GRADE_KOREAN_TO_ENUM } from '@/utils/constants';
import {
  libraryApplyEventExtraSubmitBatch,
  libraryApplyMounted,
} from '@/utils/log';
import { extractHttpStatus } from '@/utils/sentry';
import { getLibraryPathname } from '@/utils/url';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import EventExtraMagnetSection from './EventExtraMagnetSection';
import LaunchAlertProgramSection from './LaunchAlertProgramSection';
import MagnetApplyInfoCard from './MagnetApplyInfoCard';
import MagnetSurveySection, {
  MagnetQuestion,
  MagnetSurveyAnswer,
} from './MagnetSurveySection';

interface MagnetApplyContentProps {
  magnetId: number;
  magnetType: MagnetType;
  title: string;
  thumbnail: string | null;
  questions: MagnetQuestion[];
  /** 'apply' = 자료집 신청하기, 'launch-alert' = 출시 알림 신청하기 */
  variant: 'apply' | 'launch-alert';
  useLaunchAlert?: boolean;
}

const MagnetApplyContent = ({
  magnetId,
  magnetType,
  title,
  thumbnail,
  questions,
  variant,
  useLaunchAlert = false,
}: MagnetApplyContentProps) => {
  const router = useRouter();
  const { data: userData } = useUserQuery();

  const [value, setValue] = useState<CareerInfoValues>({
    university: '',
    grade: '',
    major: '',
    wishCompany: '',
    wishEmploymentType: '',
  });

  const [selections, setSelections] = useState<CareerInfoSelections>({
    selectedField: null,
    selectedPositions: [],
    selectedIndustries: [],
  });

  const [initialSelections, setInitialSelections] = useState<{
    field?: string | null;
    positions?: string[];
    industries?: string[];
  }>({});

  const [surveyAnswers, setSurveyAnswers] = useState<MagnetSurveyAnswer[]>([]);
  const [isMarketingAgreed, setIsMarketingAgreed] = useState(false);

  // 출시 알림 전용 상태
  const [selectedLaunchAlertIds, setSelectedLaunchAlertIds] = useState<
    number[]
  >([]);
  const [wantNotification, setWantNotification] = useState<boolean | null>(
    null,
  );

  // EVENT 신청 시 함께 받아볼 추가 자료집 선택 상태
  const [selectedExtraMagnetIds, setSelectedExtraMagnetIds] = useState<
    number[]
  >([]);

  const { mutateAsync: tryPatchUser, isPending: patchUserIsPending } =
    usePatchUser();
  const {
    mutateAsync: tryPostMagnetApplication,
    isPending: postApplicationIsPending,
  } = usePostMagnetApplicationMutation();

  useEffect(() => {
    libraryApplyMounted({
      magnetId,
      magnetType,
      variant,
      useLaunchAlert,
    });
  }, [magnetId, magnetType, variant, useLaunchAlert]);

  useEffect(() => {
    if (userData) {
      const koreanGrade = userData.grade
        ? GRADE_ENUM_TO_KOREAN[userData.grade] || userData.grade
        : '';

      setValue({
        university: userData?.university ?? '',
        grade: koreanGrade,
        major: userData?.major ?? '',
        wishCompany: userData?.wishCompany ?? '',
        wishEmploymentType: userData?.wishEmploymentType ?? '',
      });

      setInitialSelections({
        field: userData.wishField || null,
        positions: userData.wishJob
          ? userData.wishJob.split(',').map((s) => s.trim())
          : [],
        industries: userData.wishIndustry
          ? userData.wishIndustry.split(',').map((s) => s.trim())
          : [],
      });
    }
  }, [userData]);

  const handleSelectionsChange = useCallback(
    (newSelections: CareerInfoSelections) => {
      setSelections(newSelections);
    },
    [],
  );

  const handleSurveyAnswerChange = useCallback(
    (questionId: number, answer: MagnetSurveyAnswer) => {
      setSurveyAnswers((prev) => {
        const exists = prev.find((a) => a.questionId === questionId);
        if (exists) {
          return prev.map((a) => (a.questionId === questionId ? answer : a));
        }
        return [...prev, answer];
      });
    },
    [],
  );

  const isSubmitDisabled = useMemo(() => {
    if (
      !value.university ||
      !value.grade ||
      !value.major ||
      !value.wishEmploymentType ||
      !value.wishCompany
    ) {
      return true;
    }

    if (
      !selections.selectedField ||
      selections.selectedPositions.length === 0 ||
      selections.selectedIndustries.length === 0
    ) {
      return true;
    }

    if (!isMarketingAgreed) return true;

    // Validate required survey questions
    for (const question of questions) {
      if (question.isRequired !== 'REQUIRED') continue;
      const answer = surveyAnswers.find(
        (a) => a.questionId === question.questionId,
      );

      if (!answer) return true;

      if (question.questionType === 'SUBJECTIVE') {
        if (!answer.subjectiveText.trim()) return true;
      } else {
        if (answer.selectedItemIds.length === 0) return true;
      }
    }

    return false;
  }, [value, selections, isMarketingAgreed, surveyAnswers, questions]);

  const isSubmitting = patchUserIsPending || postApplicationIsPending;

  const handleSubmit = async () => {
    if (isSubmitting) return;

    try {
      const enumGrade = value.grade
        ? (GRADE_KOREAN_TO_ENUM[value.grade] ?? null)
        : null;

      await tryPatchUser({
        university: value.university,
        grade: enumGrade,
        major: value.major,
        wishField: selections.selectedField,
        wishJob:
          selections.selectedPositions.length > 0
            ? selections.selectedPositions.join(', ')
            : null,
        wishIndustry:
          selections.selectedIndustries.length > 0
            ? selections.selectedIndustries.join(', ')
            : null,
        wishCompany: value.wishCompany,
        wishEmploymentType: value.wishEmploymentType,
        marketingAgree: isMarketingAgreed,
      });

      const magnetAnswerList = surveyAnswers.map((a) => {
        const question = questions.find((q) => q.questionId === a.questionId);
        let answer = '';
        if (question?.questionType === 'SUBJECTIVE') {
          answer = a.subjectiveText;
        } else {
          const selectedValues = (question?.items ?? [])
            .filter((item) => a.selectedItemIds.includes(item.itemId))
            .map((item) => item.value);
          answer = selectedValues.join(',');
        }
        return { magnetQuestionId: a.questionId, answer };
      });

      // 메인 신청을 격리된 try 로 감싼다. 이미 신청한 경우(409)에는
      // 추가 마그넷/출시알림 신청 흐름은 그대로 진행되어야 하기 때문.
      let mainAlreadyApplied = false;
      try {
        await tryPostMagnetApplication({
          magnetId,
          body: { magnetAnswerList },
        });
      } catch (mainError) {
        const status = extractHttpStatus(mainError);
        if (status === 409) {
          mainAlreadyApplied = true;
        } else {
          throw mainError;
        }
      }

      // 출시 알림: 선택한 프로그램들에 대해 신청 (메인과 함께 묶음 신청 → isExtra: true)
      if (wantNotification && selectedLaunchAlertIds.length > 0) {
        await Promise.allSettled(
          selectedLaunchAlertIds.map((id) =>
            tryPostMagnetApplication({
              magnetId: id,
              body: { magnetAnswerList: [], isExtra: true },
            }),
          ),
        );
      }

      // ⚠️ N+1 호출: batch 신청 API 부재로 magnetId 당 1회 POST 발생.
      //    BE 에서 batch endpoint 도입 시 단일 호출로 변경 가능.
      //    Swagger /api/v1/magnet-application 경로에 batch 미구현 확인 (2026-05-07).
      //    상세 제안: .claude/tasks/memos/be-request-magnet-batch-application.md
      //    isExtra:true 로 BE 가 묶음 단위로 알림톡 dedupe 처리 가능.
      let extraFailedIds: number[] = [];
      if (magnetType === 'EVENT' && selectedExtraMagnetIds.length > 0) {
        const results = await Promise.allSettled(
          selectedExtraMagnetIds.map((id) =>
            tryPostMagnetApplication({
              magnetId: id,
              body: { magnetAnswerList: [], isExtra: true },
            }),
          ),
        );
        extraFailedIds = results
          .map((r, i) =>
            r.status === 'rejected' ? selectedExtraMagnetIds[i] : null,
          )
          .filter((id): id is number => id !== null);
        libraryApplyEventExtraSubmitBatch({
          totalCount: selectedExtraMagnetIds.length,
          successCount: selectedExtraMagnetIds.length - extraFailedIds.length,
          failedCount: extraFailedIds.length,
          failedIds: extraFailedIds,
        });
      }

      // 메시지 통합: 부분 실패/이미 신청 케이스가 있으면 단일 alert 로,
      // 모두 성공한 경우에만 "신청이 완료되었습니다." 표시.
      const messages: string[] = [];
      if (mainAlreadyApplied) {
        messages.push('이미 신청한 자료집이에요.');
      }
      if (extraFailedIds.length > 0) {
        messages.push(
          `일부 자료집 신청에 실패했습니다 (실패 magnetId: ${extraFailedIds.join(', ')})`,
        );
      }
      alert(
        messages.length > 0 ? messages.join('\n') : '신청이 완료되었습니다.',
      );
      router.push(getLibraryPathname({ id: magnetId, title }));
      router.refresh();
    } catch (error) {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ?? '신청에 실패했습니다. 다시 시도해주세요.';
      alert(message);
    }
  };

  const pageTitle =
    variant === 'launch-alert' ? '출시 알림 신청하기' : '신청하기';

  return (
    <main className="mx-auto flex max-w-[37.5rem] flex-col gap-10 px-5 pb-16 pt-6 md:px-0 md:pb-24 md:pt-16">
      {/* 헤더 */}
      <button
        type="button"
        onClick={() => router.back()}
        className="text-small18 text-neutral-0 flex items-center gap-2 font-medium"
      >
        <ArrowLeft className="h-5 w-5" />
        {pageTitle}
      </button>

      {/* 신청 자료집 정보 */}
      <MagnetApplyInfoCard title={title} thumbnail={thumbnail} />

      {/* 기본 정보 */}
      <section className="mt-4">
        <CareerInfoForm
          value={value}
          onChange={setValue}
          initialSelections={initialSelections}
          onSelectionsChange={handleSelectionsChange}
          showRequired={true}
          beforeConditions={
            <h2 className="text-xsmall16 text-neutral-0 md:text-small18 mb-6 mt-4 font-semibold">
              추가 정보
            </h2>
          }
        />
      </section>

      {/* 추가 정보 (서베이) */}
      {questions.length > 0 && (
        <section>
          <MagnetSurveySection
            questions={questions}
            answers={surveyAnswers}
            onAnswerChange={handleSurveyAnswerChange}
          />
        </section>
      )}

      {/* 출시 알림 프로그램 선택 */}
      {useLaunchAlert && (
        <section>
          <LaunchAlertProgramSection
            selectedMagnetIds={selectedLaunchAlertIds}
            onSelectedMagnetIdsChange={setSelectedLaunchAlertIds}
            wantNotification={wantNotification}
            onWantNotificationChange={setWantNotification}
          />
        </section>
      )}

      {/* EVENT 신청 시 함께 받아볼 추가 자료집 선택 */}
      {magnetType === 'EVENT' && (
        <section>
          <EventExtraMagnetSection
            selectedMagnetIds={selectedExtraMagnetIds}
            onSelectedMagnetIdsChange={setSelectedExtraMagnetIds}
          />
        </section>
      )}

      {/* 마케팅 활용 동의 */}
      <section className="mt-6">
        <MarketingConsentSection
          checked={isMarketingAgreed}
          onCheckedChange={setIsMarketingAgreed}
        />
      </section>

      {/* 신청하기 버튼 */}
      <button
        className="rounded-xs bg-primary text-xsmall14 disabled:bg-neutral-70 md:text-xsmall16 mt-6 px-4 py-3 font-medium text-white"
        onClick={handleSubmit}
        disabled={isSubmitDisabled}
      >
        신청하기
      </button>
    </main>
  );
};

export default MagnetApplyContent;
