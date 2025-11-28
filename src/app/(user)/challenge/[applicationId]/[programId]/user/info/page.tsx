'use client';

import {
  PatchApplicationSurveyField,
  usePatchApplicationSurveyMutation,
} from '@/api/application';
import { usePatchChallengeGoal } from '@/api/challenge';
import { useProgramQuery } from '@/api/program';
import { usePatchUser, useUserQuery } from '@/api/user';
import { ConditionList } from '@/app/(user)/mypage/career/plan/page';
import RadioButton from '@/components/challenge-view/RadioButton';
import Input from '@/components/common/ui/input/Input';
import { useCareerModals } from '@/hooks/useCareerModals';
import { GRADE_ENUM_TO_KOREAN } from '@/utils/constants';
import { DASHBOARD_FIRST_VISIT_GOAL } from '@components/common/challenge/my-challenge/section/MissionSubmitZeroSection';
import CareerModals from '@components/common/mypage/career/CareerModal';
import { SelectButton } from '@components/common/ui/button/SelectButton';
import LineInput from '@components/common/ui/input/LineInput';
import { josa } from 'es-hangul';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

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

  const [value, setValue] = useState({
    university: '',
    grade: '',
    major: '',
    wishField: '',
    wishJob: '',
    wishCompany: '',
    wishIndustry: '',
    wishEmploymentType: '',
  });
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

  const {
    modalStep,
    setModalStep,
    selectedField,
    setSelectedField,
    selectedPositions,
    setSelectedPositions,
    selectedIndustries,
    setSelectedIndustries,
    getFieldDisplayText,
    getPositionDisplayText,
    getIndustryDisplayText,
    closeModal,
  } = useCareerModals();

  useEffect(() => {
    if (userData) {
      const koreanGrade = userData.grade
        ? GRADE_ENUM_TO_KOREAN[userData.grade] || userData.grade
        : '';

      setValue({
        university: userData?.university ?? '',
        grade: koreanGrade,
        major: userData?.major ?? '',
        wishField: userData?.wishField ?? '',
        wishJob: userData?.wishJob ?? '',
        wishCompany: userData?.wishCompany ?? '',
        wishIndustry: userData?.wishIndustry ?? '',
        wishEmploymentType: userData?.wishEmploymentType ?? '',
      });
      setSelectedField(userData.wishField || '');
      setSelectedPositions(
        userData.wishJob
          ? userData.wishJob.split(',').map((s) => s.trim())
          : [],
      );
      setSelectedIndustries(
        userData.wishIndustry
          ? userData.wishIndustry.split(',').map((s) => s.trim())
          : [],
      );
    }
  }, [setSelectedField, setSelectedIndustries, setSelectedPositions, userData]);

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
      const tryPatchUserRes = await tryPatchUser({
        university: value.university,
        grade: value.grade,
        major: value.major,
        wishJob: value.wishJob,
        wishCompany: value.wishCompany,
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
      !selectedField ||
      selectedPositions.length === 0 ||
      selectedIndustries.length === 0
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
  }, [
    value,
    selectedField,
    selectedPositions,
    selectedIndustries,
    surveySelections,
    surveyEtcText,
    showSourceSurvey,
  ]);

  const handleConditionToggle = (value: string) => {
    setValue((prev) => {
      const current = prev.wishEmploymentType ?? '';
      const list = current
        ? current
            .split(',')
            .map((v) => v.trim())
            .filter(Boolean)
        : [];
      const updated = list.includes(value)
        ? list.filter((v) => v !== value)
        : [...list, value];
      return {
        ...prev,
        wishEmploymentType: updated.length > 0 ? updated.join(', ') : '',
      };
    });
  };

  return (
    <main className="mx-auto flex max-w-md flex-col gap-9 px-5 pb-16 pt-12 md:px-0 md:pb-24 md:pt-10">
      <div className="flex flex-col gap-3">
        <h1 className="text-medium22 font-semibold md:text-medium24">
          챌린지 대시보드 추가정보 입력
        </h1>
        <p className="break-keep text-xsmall14 text-neutral-20 md:text-xsmall16">
          안녕하세요! {username}님
          <br /> {programTitle}에 입장하신 걸 환영합니다! 챌린지 대시보드 입장을
          위해 추가정보를 입력해주세요.
        </p>
      </div>
      <div className="flex flex-col gap-9">
        <section className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold">기본 정보</h2>
          </div>
          <div className="flex flex-col gap-3">
            <div>
              <div className="mb-10 flex flex-col gap-4">
                <div className="flex flex-col gap-[6px]">
                  <label className="text-xsmall14 md:text-xsmall16">학교</label>
                  <LineInput
                    className="text-xsmall14 md:text-xsmall16"
                    placeholder="학교 이름을 입력해 주세요."
                    value={value.university ?? ''}
                    onChange={(e) =>
                      setValue((prev) => ({
                        ...prev,
                        university: e.target.value,
                      }))
                    }
                  />
                </div>
                <SelectButton
                  label="학년"
                  className="text-xsmall14 md:text-xsmall16"
                  value={value.grade || '학년을 선택해 주세요.'}
                  placeholder="학년을 선택해 주세요."
                  onClick={() => setModalStep('grade')}
                />
                <div className="flex flex-col gap-[6px]">
                  <label className="text-xsmall14 md:text-xsmall16">전공</label>
                  <LineInput
                    className="text-xsmall14 md:text-xsmall16"
                    placeholder="전공을 입력해 주세요."
                    value={value.major ?? ''}
                    onChange={(e) =>
                      setValue((prev) => ({ ...prev, major: e.target.value }))
                    }
                  />
                </div>
              </div>
              <div className="mb-8 flex flex-col gap-4">
                <SelectButton
                  className="text-xsmall14 md:text-xsmall16"
                  label="희망 직군"
                  value={getFieldDisplayText()}
                  placeholder="희망 직군을 선택해 주세요."
                  onClick={() => setModalStep('field')}
                />
                <SelectButton
                  className="text-xsmall14 md:text-xsmall16"
                  label="희망 직무 (최대 3개)"
                  value={getPositionDisplayText()}
                  placeholder="희망 직무를 선택해 주세요."
                  onClick={() => {
                    if (!selectedField || selectedField === '직군 무관') {
                      setModalStep('field');
                    } else {
                      setModalStep('position');
                    }
                  }}
                />
                <SelectButton
                  className="text-xsmall14 md:text-xsmall16"
                  label="희망 산업 (최대 3개)"
                  value={getIndustryDisplayText()}
                  placeholder="희망 산업을 선택해 주세요."
                  onClick={() => setModalStep('industry')}
                />
                <div className="flex flex-col gap-[6px]">
                  <label className="text-xsmall14 md:text-xsmall16">
                    희망 기업
                  </label>
                  <LineInput
                    id="wishTargetCompany"
                    name="wishTargetCompany"
                    className="text-xsmall14 md:text-xsmall16"
                    placeholder="희망 기업을 입력해 주세요."
                    value={value.wishCompany || ''}
                    onChange={(e) =>
                      setValue((prev) => ({
                        ...prev,
                        wishCompany: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <span className="text-xsmall14 md:text-xsmall16">
                  희망 구직 조건
                </span>
                <ConditionList
                  selected={(value.wishEmploymentType ?? '')
                    .split(',')
                    .map((v) => v.trim())
                    .filter(Boolean)}
                  onToggle={handleConditionToggle}
                />
              </div>
            </div>
            <hr className="my-4" />
            {showSourceSurvey ? (
              <div className="flex flex-col gap-6" id="sourceSurvey">
                <div className="flex flex-col gap-1">
                  <h2 className="text-lg font-semibold">
                    렛츠커리어 챌린지를 언제, 어떤 계기로 결제하게 되셨나요?
                  </h2>
                  <p className="break-keep text-neutral-40">
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
                  <p className="mb-2 break-keep text-neutral-40">
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
            ) : null}
          </div>
        </section>

        <button
          className="rounded-xs bg-primary px-4 py-3 font-medium text-white disabled:bg-neutral-70"
          onClick={handleSubmit}
          disabled={isSubmitDisabled}
        >
          대시보드 입장하기
        </button>
      </div>
      <CareerModals
        setModalStep={setModalStep}
        modalStep={modalStep}
        initialField={selectedField}
        initialPositions={selectedPositions}
        initialIndustries={selectedIndustries}
        userGrade={value.grade ?? ''}
        onGradeComplete={(grade) => {
          setValue((prev) => ({ ...prev, grade }));
          closeModal();
        }}
        onFieldComplete={(field, positions) => {
          setSelectedField(field);
          setSelectedPositions(positions);
          if (field === '직군 무관') {
            closeModal();
          } else {
            setModalStep('position');
          }
        }}
        onPositionsComplete={(positions) => {
          setSelectedPositions(positions);
          closeModal();
        }}
        onIndustriesComplete={(industries) => {
          setSelectedIndustries(industries);
          closeModal();
        }}
        onClose={closeModal}
      />
    </main>
  );
};

export default ChallengeUserInfo;
