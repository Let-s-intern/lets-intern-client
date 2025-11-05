'use client';

import { useGetChallengeTitle, usePatchChallengeGoal } from '@/api/challenge';
import { usePatchUser, useUserQuery } from '@/api/user';
import RadioButton from '@/components/challenge-view/RadioButton';
import GradeDropdown from '@/components/common/mypage/privacy/form-control/GradeDropdown';
import Input from '@/components/common/ui/input/Input';
import { DASHBOARD_FIRST_VISIT_GOAL } from '@components/common/challenge/my-challenge/section/MissionSubmitZeroSection';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const radioColor = '#5177FF';
const awarenessOptions = [
  '인스타그램',
  '쥬디톡방',
  '문자&카카오톡 알림',
  '렛츠커리어 웹사이트',
  '네이버 블로그 후기',
  '구글/네이버 검색',
  '무료 세미나',
  '렛츠커리어 무료 자료집 및 템플릿',
  '기타 오픈채팅방',
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
  '문자&카카오톡 알림 링크',
  '렛츠커리어 웹사이트',
  '네이버 블로그 후기내 링크',
  '구글/네이버 검색',
  '무료 세미나 제공 자료내 링크',
  '렛츠커리어 무료 자료집 및 템플릿내 링크',
  '기타 오픈채팅방내 링크',
  '북마크/즐겨찾기에서 바로 접속',
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
    wishJob: '',
    wishCompany: '',
  });
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const { data: userData } = useUserQuery();

  const [surveySelections, setSurveySelections] = useState({
    awareness: '',
    decisionPeriod: '',
    entryPoint: '',
  });
  const [surveyEtcText, setSurveyEtcText] = useState({
    awareness: '',
    entryPoint: '',
  });

  const { data: programTitleData } = useGetChallengeTitle(Number(programId));

  const { mutateAsync: tryPostGoal } = usePatchChallengeGoal();

  useEffect(() => {
    if (userData) {
      setValue({
        university: userData?.university ?? '',
        grade: userData?.grade ?? '',
        major: userData?.major ?? '',
        wishJob: userData?.wishJob ?? '',
        wishCompany: userData?.wishCompany ?? '',
      });
    }
  }, [userData]);

  const programTitle = programTitleData?.title;
  const username = userData?.name;

  const { mutateAsync: tryPatchUser, isPending: patchUserIsPending } =
    usePatchUser();

  const handleSurveySelection =
    (field: 'awareness' | 'decisionPeriod' | 'entryPoint') =>
    (option: string) => {
      setSurveySelections((prev) => ({ ...prev, [field]: option }));

      if (field === 'awareness' && option !== '기타') {
        setSurveyEtcText((prev) => ({ ...prev, awareness: '' }));
      }

      if (field === 'entryPoint' && option !== '기타') {
        setSurveyEtcText((prev) => ({ ...prev, entryPoint: '' }));
      }
    };

  const handleSurveyEtcChange =
    (field: 'awareness' | 'entryPoint') =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSurveyEtcText((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue({ ...value, [e.target.name]: e.target.value });
  };

  const handleGradeChange = (grade: string) => {
    setValue({ ...value, grade });
  };

  const handleSubmit = async () => {
    if (patchUserIsPending || !programId) return;

    try {
      await tryPatchUser({
        university: value.university,
        grade: value.grade,
        major: value.major,
        wishJob: value.wishJob,
        wishCompany: value.wishCompany,
      });

      await tryPostGoal({
        challengeId: programId,
        goal: DASHBOARD_FIRST_VISIT_GOAL,
      });

      router.push(`/challenge/${params.applicationId}/${programId}`);
    } catch (error) {
      console.error(error);
      alert(`입력에 실패했습니다. 다시 시도해주세요.\n${error}`);
    }
  };

  useEffect(() => {
    setButtonDisabled(
      !value.university ||
        !value.grade ||
        !value.major ||
        !value.wishJob ||
        !value.wishCompany,
    );
  }, [value]);

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 px-5 md:px-0 md:pb-24 md:pt-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-center text-xl font-semibold">
          챌린지 대시보드 추가정보 입력
        </h1>
        <p className="break-keep text-center text-neutral-40">
          안녕하세요, {username}님!
          <br className="md:hidden" /> {programTitle}에 입장하신 걸 환영합니다!
          <br />
          챌린지 대시보드 입장을 위해 추가정보를 입력해주세요.
        </p>
      </div>
      <div className="flex flex-col gap-8">
        <section className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold">기본 정보</h2>
            <p className="break-keep text-neutral-40">
              * 기본 정보를 바탕으로 더 유익한 학습콘텐츠를 제공해드릴게요!
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label htmlFor="university" className="text-1-medium">
                학교<span className="text-requirement">*</span>
              </label>
              <Input
                id="university"
                name="university"
                placeholder="렛츠대학교"
                value={value.university}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="grade" className="text-1-medium">
                학년<span className="text-requirement">*</span>
              </label>
              <GradeDropdown
                value={value.grade}
                setValue={handleGradeChange}
                type="MYPAGE"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="major" className="text-1-medium">
                전공<span className="text-requirement">*</span>
              </label>
              <Input
                id="major"
                name="major"
                placeholder="OO학과"
                value={value.major}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="wishJob" className="text-1-medium">
                희망 직무<span className="text-requirement">*</span>
              </label>
              <Input
                id="wishJob"
                name="wishJob"
                placeholder="희망 직무를 입력해주세요."
                value={value.wishJob}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="wishCompany" className="text-1-medium">
                희망 기업<span className="text-requirement">*</span>
              </label>
              <Input
                id="wishCompany"
                name="wishCompany"
                placeholder="희망 기업을 입력해주세요."
                value={value.wishCompany}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex flex-col gap-4 pt-4">
              <div className="flex flex-col gap-1">
                <h3 className="text-base font-semibold">
                  렛츠커리어 챌린지를 언제, 어떤 계기로 결제하게 되셨나요?
                </h3>
                <p className="text-1-medium text-neutral-40">
                  *아래 중 본인 상황과 가장 가까운 항목을 선택해주세요.
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-1-medium" id="challengeAwarenessLabel">
                  {'챌린지명'}이 개설된 사실을 어떻게 아셨나요?
                </span>
                <div className="flex flex-col gap-2">
                  {awarenessOptions.map((option) => (
                    <div key={option} className="flex flex-col gap-2">
                      <RadioButton
                        color={radioColor}
                        checked={surveySelections.awareness === option}
                        label={option}
                        onClick={() =>
                          handleSurveySelection('awareness')(option)
                        }
                      />
                      {option === '기타' &&
                        surveySelections.awareness === '기타' && (
                          <Input
                            id="challengeAwarenessEtc"
                            name="challengeAwarenessEtc"
                            placeholder="기타 항목을 입력해주세요."
                            value={surveyEtcText.awareness}
                            onChange={handleSurveyEtcChange('awareness')}
                            className="ml-7 mt-1 w-full max-w-sm"
                          />
                        )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <span
                  className="text-1-medium"
                  id="challengeDecisionPeriodLabel"
                >
                  {'챌린지명'}를 알게 된 후, 결제하기까지 얼마나 고민하셨나요?
                </span>
                <p className="text-1-medium text-neutral-40">
                  *처음 챌린지 소식을 접한 시점부터 결제 완료까지의 기간을
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
                <span className="text-1-medium" id="challengeEntryPointLabel">
                  그렇다면 {'챌린지명'}을 실제 결제 하기 직전에는 어디를 통해
                  결제 페이지에 들어오셨나요?
                </span>
                <div className="flex flex-col gap-2">
                  {entryPointOptions.map((option) => (
                    <div key={option} className="flex flex-col gap-2">
                      <RadioButton
                        color={radioColor}
                        checked={surveySelections.entryPoint === option}
                        label={option}
                        onClick={() =>
                          handleSurveySelection('entryPoint')(option)
                        }
                      />
                      {option === '기타' &&
                        surveySelections.entryPoint === '기타' && (
                          <Input
                            id="challengeEntryPointEtc"
                            name="challengeEntryPointEtc"
                            placeholder="기타 항목을 입력해주세요."
                            value={surveyEtcText.entryPoint}
                            onChange={handleSurveyEtcChange('entryPoint')}
                            className="ml-7 mt-1 w-full max-w-sm"
                          />
                        )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <button
          className="rounded-md bg-primary px-4 py-3 font-medium text-white disabled:bg-neutral-60"
          onClick={handleSubmit}
          disabled={buttonDisabled}
        >
          챌린지 대시보드 입장하기
        </button>
      </div>
    </main>
  );
};

export default ChallengeUserInfo;
