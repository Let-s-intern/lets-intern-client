'use client';

import { usePostMagnetApplicationMutation } from '@/api/magnet/magnet';
import { usePatchUser, useUserQuery } from '@/api/user/user';
import MarketingConsentSection from '@/common/form/MarketingConsentSection';
import CareerInfoForm, {
  CareerInfoSelections,
  CareerInfoValues,
} from '@/domain/mypage/career/CareerInfoForm';
import { GRADE_ENUM_TO_KOREAN, GRADE_KOREAN_TO_ENUM } from '@/utils/constants';
import { getLibraryPathname } from '@/utils/url';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import LaunchAlertProgramSection from './LaunchAlertProgramSection';
import MagnetApplyInfoCard from './MagnetApplyInfoCard';
import MagnetSurveySection, {
  MagnetQuestion,
  MagnetSurveyAnswer,
} from './MagnetSurveySection';

interface MagnetApplyContentProps {
  magnetId: number;
  title: string;
  thumbnail: string | null;
  questions: MagnetQuestion[];
  /** 'apply' = 자료집 신청하기, 'launch-alert' = 출시 알림 신청하기 */
  variant: 'apply' | 'launch-alert';
  useLaunchAlert?: boolean;
}

const MagnetApplyContent = ({
  magnetId,
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

  const { mutateAsync: tryPatchUser, isPending: patchUserIsPending } =
    usePatchUser();
  const {
    mutateAsync: tryPostMagnetApplication,
    isPending: postApplicationIsPending,
  } = usePostMagnetApplicationMutation();

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

      await tryPostMagnetApplication({
        magnetId,
        body: { magnetAnswerList },
      });

      // 출시 알림: 선택한 프로그램들에 대해 신청
      if (wantNotification && selectedLaunchAlertIds.length > 0) {
        await Promise.allSettled(
          selectedLaunchAlertIds.map((id) =>
            tryPostMagnetApplication({
              magnetId: id,
              body: { magnetAnswerList: [] },
            }),
          ),
        );
      }

      alert('신청이 완료되었습니다.');
      router.push(getLibraryPathname({ id: magnetId, title }));
      router.refresh();
    } catch (error) {
      console.error(error);
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
        className="flex items-center gap-2 text-small18 font-medium text-neutral-0"
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
            <h2 className="mb-6 mt-4 text-xsmall16 font-semibold text-neutral-0 md:text-small18">
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

      {/* 마케팅 활용 동의 */}
      <section className="mt-6">
        <MarketingConsentSection
          checked={isMarketingAgreed}
          onCheckedChange={setIsMarketingAgreed}
        />
      </section>

      {/* 신청하기 버튼 */}
      <button
        className="mt-6 rounded-xs bg-primary px-4 py-3 text-xsmall14 font-medium text-white disabled:bg-neutral-70 md:text-xsmall16"
        onClick={handleSubmit}
        disabled={isSubmitDisabled}
      >
        신청하기
      </button>
    </main>
  );
};

export default MagnetApplyContent;
