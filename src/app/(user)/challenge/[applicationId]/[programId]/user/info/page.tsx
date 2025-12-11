'use client';

import {
  PatchApplicationSurveyField,
  usePatchApplicationSurveyMutation,
} from '@/api/application';
import { usePatchChallengeGoal } from '@/api/challenge';
import { useProgramQuery } from '@/api/program';
import { usePatchUser, useUserQuery } from '@/api/user';
import CareerInfoForm, {
  CareerInfoSelections,
  CareerInfoValues,
} from '@/components/common/mypage/career/CareerInfoForm';
import Input from '@/components/common/ui/input/Input';
import RadioButton from '@/domain/challenge/challenge-view/RadioButton';
import { GRADE_ENUM_TO_KOREAN, GRADE_KOREAN_TO_ENUM } from '@/utils/constants';
import { DASHBOARD_FIRST_VISIT_GOAL } from '@components/common/challenge/my-challenge/section/MissionSubmitZeroSection';
import { josa } from 'es-hangul';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

const radioColor = '#5177FF';
const awarenessOptions = [
  '인스타그램',
  '쥬디톡방',
  '문자/카카오톡 알림',
  '렛츠커리어 웹사이트(배너, 프로그램 리스트, 챌린지 대시보드등에서 확인) ',
  '네이버 블로그 후기',
  '구글/네이버 검색',
  '무료 세미나',
  '렛츠커리어 무료 자료집 및 템플릿',
  '오픈채팅방',
  '뉴스레터',
  '기타',
];

const decisionPeriodOptions = [
  '바로 결제했어요 (당일)',
  '1~3일 정도 고민했어요',
  '1주일 정도 고민했어요',
  '2주 이상 고민했어요',
];

const entryPointOptions = [
  '인스타그램 프로필 링크/스토리',
  '쥬디톡방 링크',
  '문자/카카오톡 알림 링크',
  '네이버 블로그 후기내 링크',
  '구글/네이버 검색',
  '무료 세미나 제공 자료내 링크',
  '렛츠커리어 무료 자료집 및 템플릿내 링크',
  '기타 오픈채팅방내 링크',
  '북마크/즐겨찾기에서 바로 접속',
  '뉴스레터내 링크',
  '기억이 안나요',
  '기타',
];

const ChallengeUserInfo = () => {
  const params = useParams<{ programId: string; applicationId: string }>();
  const programId = params.programId;
  const router = useRouter();

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

  const { data: userData } = useUserQuery();

  const [surveySelections, setSurveySelections] = useState({
    awarenessPath: '',
    decisionPeriod: '',
    paymentPath: '',
  });
  const [surveyEtcText, setSurveyEtcText] = useState({
    awarenessPath: '',
    paymentPath: '',
  });

  const program = useProgramQuery({
    programId: Number(programId),
    type: 'challenge',
  });

  const challenge = program.type === 'challenge' ? program : null;
  const programTitle = challenge ? challenge?.query.data?.title : '';
  const showSourceSurvey = Boolean(
    challenge?.query.data?.adminClassificationInfo?.find(
      (info) => info.programAdminClassification === 'B2C',
    ),
  );

  const { mutateAsync: tryPostGoal } = usePatchChallengeGoal();

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

  const username = userData?.name;

  const { mutateAsync: tryPatchUser, isPending: patchUserIsPending } =
    usePatchUser();

  const { mutateAsync: patchApplicationSurvey } =
    usePatchApplicationSurveyMutation({});

  const handleSurveySelection =
    (field: PatchApplicationSurveyField) => (option: string) => {
      setSurveySelections((prev) => ({ ...prev, [field]: option }));

      if (field === 'awarenessPath' && option !== '기타') {
        setSurveyEtcText((prev) => ({ ...prev, awarenessPath: '' }));
      }

      if (field === 'paymentPath' && option !== '기타') {
        setSurveyEtcText((prev) => ({ ...prev, paymentPath: '' }));
      }
    };

  const handleSurveyEtcChange =
    (field: PatchApplicationSurveyField) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSurveyEtcText((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const handleSubmit = async () => {
    if (patchUserIsPending || !programId) return;

    try {
      const enumGrade = value.grade
        ? (GRADE_KOREAN_TO_ENUM[value.grade] ?? null)
        : null;

      const tryPatchUserRes = await tryPatchUser({
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
      });

      console.log('tryPatchUser success', tryPatchUserRes.data);

      const tryPostGoalRes = await tryPostGoal({
        challengeId: programId,
        goal: DASHBOARD_FIRST_VISIT_GOAL,
      });

      console.log('tryPostGoal success', tryPostGoalRes.data);

      const awarenessPath =
        surveySelections.awarenessPath === '기타'
          ? surveyEtcText.awarenessPath
          : surveySelections.awarenessPath;
      const paymentPath =
        surveySelections.paymentPath === '기타'
          ? surveyEtcText.paymentPath
          : surveySelections.paymentPath;

      const patchApplicationSurveyRes = await patchApplicationSurvey({
        programType: 'challenge',
        applicationId: Number(params.applicationId),
        requestBody: {
          awarenessPath,
          decisionPeriod: surveySelections.decisionPeriod,
          paymentPath,
        },
      });

      console.log(
        'patchApplicationSurvey success',
        patchApplicationSurveyRes.data,
      );

      router.push(`/challenge/${params.applicationId}/${programId}`);
    } catch (error) {
      console.error(error);
      alert(`입력에 실패했습니다. 다시 시도해주세요.\n${error}`);
    }
  };

  const handleSelectionsChange = useCallback(
    (newSelections: CareerInfoSelections) => {
      setSelections(newSelections);
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
    if (!showSourceSurvey) return false;

    const isAwarenessSelected = Boolean(surveySelections.awarenessPath);
    const isDecisionPeriodSelected = Boolean(surveySelections.decisionPeriod);
    const isPaymentPathSelected = Boolean(surveySelections.paymentPath);

    const isAwarenessValid =
      surveySelections.awarenessPath !== '기타' ||
      surveyEtcText.awarenessPath.trim().length > 0;

    const isPaymentPathValid =
      surveySelections.paymentPath !== '기타' ||
      surveyEtcText.paymentPath.trim().length > 0;

    return (
      !isAwarenessSelected ||
      !isDecisionPeriodSelected ||
      !isPaymentPathSelected ||
      !isAwarenessValid ||
      !isPaymentPathValid
    );
  }, [value, selections, surveySelections, surveyEtcText, showSourceSurvey]);

  return (
    <main className="mx-auto flex max-w-md flex-col gap-9 px-5 pb-16 pt-12 md:px-0 md:pb-24 md:pt-10">
      <div className="flex flex-col gap-3">
        <h1 className="text-medium22 font-semibold md:text-medium24">
          챌린지 대시보드 추가정보 입력
        </h1>
        <p className="break-keep text-xsmall14 text-neutral-20 md:text-xsmall16">
          안녕하세요! {username}님
          <br /> {programTitle}에 입장하신 걸 환영합니다! <br />
          챌린지 대시보드 입장을 위해 추가정보를 입력해주세요.
        </p>
      </div>
      <div className="flex flex-col gap-9">
        <section>
          <CareerInfoForm
            value={value}
            onChange={setValue}
            initialSelections={initialSelections}
            onSelectionsChange={handleSelectionsChange}
          />
        </section>

        {showSourceSurvey ? (
          <section>
            <div className="flex flex-col gap-6" id="sourceSurvey">
              <div className="flex flex-col gap-1">
                <h2 className="text-xsmall16 font-semibold md:text-small18">
                  렛츠커리어 챌린지를 언제, 어떤 계기로 결제하게 되셨나요?
                </h2>
                <p className="break-keep text-xsmall14 text-neutral-40 md:text-xsmall16">
                  아래 중 본인 상황과 가장 가까운 항목을 선택해주세요.
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <span
                  className="text-xsmall14 md:text-xsmall16"
                  id="challengeAwarenessLabel"
                >
                  {josa(`${programTitle}`, '이/가')} 개설된 사실을 어떻게
                  아셨나요?<span className="pl-1 text-requirement">*</span>
                </span>
                <div className="flex flex-col gap-2">
                  {awarenessOptions.map((option) => (
                    <div key={option} className="flex flex-col gap-2">
                      <RadioButton
                        color={radioColor}
                        checked={surveySelections.awarenessPath === option}
                        label={option}
                        onClick={() =>
                          handleSurveySelection('awarenessPath')(option)
                        }
                      />
                      {option === '기타' &&
                        surveySelections.awarenessPath === '기타' && (
                          <Input
                            id="challengeAwarenessEtc"
                            name="challengeAwarenessEtc"
                            placeholder="기타 항목을 입력해주세요."
                            value={surveyEtcText.awarenessPath}
                            onChange={handleSurveyEtcChange('awarenessPath')}
                            className="ml-7 mt-1 w-full max-w-sm"
                          />
                        )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span
                  className="text-xsmall14 md:text-xsmall16"
                  id="challengeDecisionPeriodLabel"
                >
                  {josa(`${programTitle}`, '을/를')} 알게 된 후, 결제하기까지
                  얼마나 고민하셨나요?
                  <span className="pl-1 text-requirement">*</span>
                </span>
                <p className="mb-2 break-keep text-xsmall14 text-neutral-40 md:text-xsmall16">
                  처음 챌린지 소식을 접한 시점부터 결제 완료까지의 기간을
                  선택해주세요.
                </p>
                <div className="flex flex-col gap-2">
                  {decisionPeriodOptions.map((option) => (
                    <RadioButton
                      key={option}
                      color={radioColor}
                      checked={surveySelections.decisionPeriod === option}
                      label={option}
                      onClick={() =>
                        handleSurveySelection('decisionPeriod')(option)
                      }
                    />
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <span
                  className="text-xsmall14 md:text-xsmall16"
                  id="challengeEntryPointLabel"
                >
                  그렇다면 {josa(`${programTitle}`, '을/를')} 실제 결제 하기
                  직전에는 어디를 통해 결제 페이지에 들어오셨나요?
                  <span className="pl-1 text-requirement">*</span>
                </span>
                <div className="flex flex-col gap-2">
                  {entryPointOptions.map((option) => (
                    <div key={option} className="flex flex-col gap-2">
                      <RadioButton
                        color={radioColor}
                        checked={surveySelections.paymentPath === option}
                        label={option}
                        onClick={() =>
                          handleSurveySelection('paymentPath')(option)
                        }
                      />
                      {option === '기타' &&
                        surveySelections.paymentPath === '기타' && (
                          <Input
                            id="challengeEntryPointEtc"
                            name="challengeEntryPointEtc"
                            placeholder="기타 항목을 입력해주세요."
                            value={surveyEtcText.paymentPath}
                            onChange={handleSurveyEtcChange('paymentPath')}
                            className="ml-7 mt-1 w-full max-w-sm"
                          />
                        )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        ) : null}

        <button
          className="rounded-xs bg-primary px-4 py-3 text-xsmall14 font-medium text-white disabled:bg-neutral-70 md:text-xsmall16"
          onClick={handleSubmit}
          disabled={isSubmitDisabled}
        >
          대시보드 입장하기
        </button>
      </div>
    </main>
  );
};

export default ChallengeUserInfo;
