'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronRight, XIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  CATEGORY_MAP,
  CATEGORY_REVERSE_MAP,
  EXPERIENCE_FORM_TEXT,
  MAX_COMPETENCIES,
} from './constants';

import { usePostUserExperienceMutation } from '@/api/user';
import {
  CATEGORY_PAIRS,
  userExperienceSchema,
  type DisplayExperienceCategory,
  type UserExperience,
} from '@/api/userSchema';
import { CompetencyBadges } from './components/CompetencyBadges';
import { ExperienceCategoryModal } from './components/ExperienceCategoryModal';
import { FieldSection } from './components/FeildSection';
import { PeriodSelectModal } from './components/PeriodSelectModal';
import { TooltipButton } from './components/TooltipButton';

// 기본값 정의
// TODO: nullable ??
export const defaultFormData: Partial<UserExperience> = {
  title: '',
  experienceCategory: undefined,
  customCategoryName: '',
  organization: '',
  role: '',
  activityType: 'INDIVIDUAL',
  startDate: '',
  endDate: '',
  situation: '',
  task: '',
  action: '',
  result: '',
  learnings: '',
  coreCompetency: '',
  isAdminAdded: false,
};

interface ExperienceFormProps {
  onClose: () => void;
  initialData?: UserExperience;
}

export const ExperienceForm = ({
  onClose,
  initialData,
}: ExperienceFormProps) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<UserExperience>({
    resolver: zodResolver(userExperienceSchema),
    defaultValues: initialData || defaultFormData,
  });

  const formData = watch();
  const experienceCategory = watch('experienceCategory');

  // API mutation
  const createExperienceMutation = usePostUserExperienceMutation();

  // 초기 데이터 설정
  useEffect(() => {
    if (initialData) {
      Object.entries(initialData).forEach(([key, value]) => {
        setValue(key as keyof UserExperience, value, {
          shouldDirty: false,
        });
      });
      // startDate에서 연도 추출
      if (initialData.startDate) {
        const year = parseInt(initialData.startDate.split('-')[0]);
        setDisplayYear(year);
      }
    }
  }, [initialData, setValue]);

  const handleCompetencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    // 핵심 역량 입력 상태 (콤마 4개까지 허용하여 5단어 제한)
    const commaCount = (text.match(/,/g) || []).length;
    if (commaCount > MAX_COMPETENCIES - 1) {
      return;
    }
    setValue('coreCompetency', text, { shouldDirty: true });
  };

  // 경험 분류 선택 모달 상태
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  // 기간 선택 모달 상태
  const [isStartPeriodModalOpen, setIsStartPeriodModalOpen] = useState(false);
  const [isEndPeriodModalOpen, setIsEndPeriodModalOpen] = useState(false);
  const [displayYear, setDisplayYear] = useState<number | null>(null);
  // 자동 저장 상태
  const [lastAutoSaveTime, setLastAutoSaveTime] = useState<Date | null>(null);

  // 기간 선택 핸들러
  const handleStartPeriodSelect = (year: number, month: number) => {
    const dateString = `${year}-${String(month).padStart(2, '0')}-01`;
    setValue('startDate', dateString, { shouldDirty: true });
  };

  const handleEndPeriodSelect = (year: number, month: number) => {
    const dateString = `${year}-${String(month).padStart(2, '0')}-01`;
    setValue('endDate', dateString, { shouldDirty: true });
    setDisplayYear(year);
  };

  // 폼 데이터를 API 요청 형식으로 변환
  const validateFormData = (data: UserExperience): UserExperience | null => {
    // TODO: 필수 필드 || 유효성 검사 로직 구현

    return {
      title: data.title,
      experienceCategory: data.experienceCategory,
      customCategoryName: data.customCategoryName,
      organization: data.organization,
      role: data.role,
      activityType: data.activityType,
      startDate: data.startDate,
      endDate: data.endDate,
      situation: data.situation,
      task: data.task,
      action: data.action,
      result: data.result,
      learnings: data.learnings,
      coreCompetency: data.coreCompetency,
      isAdminAdded: data.isAdminAdded || false,
    };
  };

  // 폼 제출 핸들러
  const onSubmit = async (data: UserExperience) => {
    const validData = validateFormData(data);
    console.log(validData);
    if (!validData) return;

    try {
      // await createExperienceMutation.mutateAsync(validData);
      alert('경험 정리가 성공적으로 저장되었습니다.');
      onClose();
    } catch (error) {
      console.error('경험 정리 저장 실패:', error);
      alert('저장 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const handleCategorySelect = (name: DisplayExperienceCategory) => {
    const apiCategory = CATEGORY_MAP[name];
    setValue('experienceCategory', apiCategory, { shouldDirty: true });
    // 기타가 아닌 경우 커스텀 입력값 초기화
    if (name !== '기타(직접입력)') {
      setValue('customCategoryName', '', { shouldDirty: true });
    }
    setIsCategoryModalOpen(false);
  };

  // 모달 오픈 시 스크롤 락
  useEffect(() => {
    document.body.style.overflow =
      isCategoryModalOpen || isStartPeriodModalOpen || isEndPeriodModalOpen
        ? 'hidden'
        : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isCategoryModalOpen, isStartPeriodModalOpen, isEndPeriodModalOpen]);

  // 자동 저장 로직 (30초마다)
  useEffect(() => {
    // 초기 데이터가 있거나 변경사항이 있을 때만 자동 저장
    if (!isDirty) return;

    const autoSaveInterval = setInterval(
      async () => {
        const validData = validateFormData(formData);
        if (!validData) return;

        try {
          console.log('auto save', validData);
          // await createExperienceMutation.mutateAsync(validData);
          setLastAutoSaveTime(new Date());
          // 자동 저장 후 isDirty 상태 리셋하지 않음 (사용자가 명시적으로 저장 버튼을 눌러야 함)
        } catch (error) {
          console.error('자동 저장 실패:', error);
        }
      },
      30000, // 30초
    );

    return () => clearInterval(autoSaveInterval);
  }, [isDirty, formData]); // formData 의존성 추가

  return (
    <>
      <div className="flex h-full flex-col bg-white">
        {/* 헤더 */}
        <header className="flex h-[72px] items-center justify-between px-4 py-5">
          <h1 className="text-small20 font-semibold">경험 작성</h1>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center"
          >
            <XIcon size={24} />
          </button>
        </header>

        {/* 스크롤 가능한 메인 컨텐츠 */}
        <div className="flex-1 overflow-y-auto px-7 pb-[60px] pt-2">
          {/* 가이드 텍스트 */}
          <div className="mb-6 rounded-sm bg-primary-5 px-4 py-3">
            <p className="text-xsmall14 font-normal leading-[1.375rem] text-neutral-30">
              활동이 다양할 수록 좋겠지만, 활동 내용 보다는 구체적인
              에피소드(직면한 문제, 내 역할, 역량, 배운점 등)을 중심으로 STAR
              양식을 정리해 주세요. 즉, 하나의 활동에도 여러 STAR 양식이 나올 수
              있습니다.
            </p>
            <span className="mt-1 flex items-center gap-1 text-sm text-primary-dark underline">
              <a
                href="https://letsintern.notion.site/28f5e77cbee180e6b9eff73282349c88"
                target="_blank"
                rel="noopener noreferrer"
              >
                👉다양한 경험 정리 우수 예시 보러가기👈
              </a>
            </span>
          </div>

          {/* 메인 폼 영역 */}
          <form
            id="experienceForm"
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-8 divide-y divide-neutral-85"
          >
            {/* 기본 정보 섹션 */}
            <div className="flex flex-col gap-5">
              <h2 className="text-small16 font-semibold text-neutral-0">
                기본 정보
              </h2>

              <div className="flex flex-col gap-4">
                {/* 경험 이름 */}
                <FieldSection.Root className="flex flex-col">
                  <FieldSection.Label className="mb-[6px]" htmlFor="title">
                    {EXPERIENCE_FORM_TEXT['title'].label}
                  </FieldSection.Label>
                  <FieldSection.Input<UserExperience>
                    id="title"
                    placeholder={EXPERIENCE_FORM_TEXT['title'].placeholder}
                    register={register}
                  />
                </FieldSection.Root>

                {/* 경험 분류 */}
                <div className="flex flex-col">
                  <label
                    htmlFor="experienceCategory"
                    className="mb-[6px] text-xsmall14 font-medium text-neutral-20 md:text-xsmall16"
                  >
                    {EXPERIENCE_FORM_TEXT['experienceCategory'].label}
                  </label>
                  {/* TODO: SelectButton 컴포넌트 적용 */}
                  <button
                    id="experienceCategory"
                    type="button"
                    onClick={() => setIsCategoryModalOpen(true)}
                    className="flex items-center justify-between rounded-xs border border-solid border-neutral-80 px-3 py-[9px] text-xsmall14 font-normal focus:border-primary focus:outline-none md:text-xsmall16"
                  >
                    <span
                      className={
                        formData?.experienceCategory
                          ? 'text-neutral-0'
                          : 'text-neutral-50'
                      }
                    >
                      {formData?.experienceCategory
                        ? CATEGORY_REVERSE_MAP[formData.experienceCategory]
                        : EXPERIENCE_FORM_TEXT['experienceCategory']
                            .placeholder}
                    </span>
                    <ChevronRight size={20} className="text-neutral-400" />
                  </button>

                  {experienceCategory === 'OTHER' && (
                    <FieldSection.Root className="mt-2">
                      <FieldSection.Input<UserExperience>
                        id="customCategoryName"
                        placeholder={
                          EXPERIENCE_FORM_TEXT['customCategoryName'].placeholder
                        }
                        register={register}
                        className="block w-full"
                      />
                    </FieldSection.Root>
                  )}
                </div>

                {/* 기관 */}
                <FieldSection.Root className="flex flex-col">
                  <FieldSection.Label
                    className="mb-[6px]"
                    htmlFor="organization"
                  >
                    {EXPERIENCE_FORM_TEXT['organization'].label}
                  </FieldSection.Label>
                  <FieldSection.Input<UserExperience>
                    id="organization"
                    placeholder={
                      EXPERIENCE_FORM_TEXT['organization'].placeholder
                    }
                    register={register}
                  />
                </FieldSection.Root>

                {/* 역할 및 담당 업무 */}
                <FieldSection.Root className="flex flex-col">
                  <FieldSection.Label className="mb-[6px]" htmlFor="role">
                    {EXPERIENCE_FORM_TEXT['role'].label}
                  </FieldSection.Label>
                  <FieldSection.Input<UserExperience>
                    id="role"
                    placeholder={EXPERIENCE_FORM_TEXT['role'].placeholder}
                    register={register}
                  />
                </FieldSection.Root>

                {/* 팀·개인 여부 */}
                <FieldSection.Root className="flex flex-col">
                  <FieldSection.Label
                    className="mb-[6px]"
                    htmlFor="activityType"
                  >
                    팀·개인 여부
                  </FieldSection.Label>
                  <div className="flex gap-4">
                    <label className="flex cursor-pointer items-center gap-2">
                      <FieldSection.Input<UserExperience>
                        id="activityType"
                        type="radio"
                        register={register}
                        value="INDIVIDUAL"
                      />
                      <span className="text-xsmall14 font-normal text-neutral-0 md:text-xsmall16">
                        개인
                      </span>
                    </label>
                    <label className="flex cursor-pointer items-center gap-2">
                      <FieldSection.Input<UserExperience>
                        id="activityType"
                        type="radio"
                        register={register}
                        value="TEAM"
                      />
                      <span className="text-xsmall14 font-normal text-neutral-0 md:text-xsmall16">
                        팀
                      </span>
                    </label>
                  </div>
                </FieldSection.Root>

                {/* 기간 */}
                <FieldSection.Root className="flex flex-col">
                  <FieldSection.Label className="mb-[6px]" htmlFor="period">
                    기간
                  </FieldSection.Label>
                  <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                      <button
                        type="button"
                        onClick={() => setIsStartPeriodModalOpen(true)}
                        className="flex w-full items-center justify-between rounded-xs border border-solid border-neutral-80 px-3 py-[10px] text-left text-xsmall14 font-normal focus:border-primary focus:outline-none md:text-xsmall16"
                      >
                        <span
                          className={
                            formData.startDate
                              ? 'text-neutral-0'
                              : 'text-neutral-50'
                          }
                        >
                          {formData.startDate
                            ? (() => {
                                const [year, month] =
                                  formData.startDate.split('-');
                                return `${year}.${String(month).padStart(2, '0')}`;
                              })()
                            : EXPERIENCE_FORM_TEXT['startDate'].placeholder}
                        </span>
                        <ChevronRight size={20} className="text-neutral-400" />
                      </button>
                    </div>
                    <span className="w-2 text-xsmall14 text-neutral-400 md:text-xsmall16">
                      -
                    </span>
                    <div className="relative flex-1">
                      <button
                        type="button"
                        onClick={() => setIsEndPeriodModalOpen(true)}
                        className="flex w-full items-center justify-between rounded-xs border border-solid border-neutral-80 px-3 py-[10px] text-left text-xsmall14 font-normal focus:border-primary focus:outline-none md:text-xsmall16"
                      >
                        <span
                          className={
                            formData.endDate
                              ? 'text-neutral-0'
                              : 'text-neutral-50'
                          }
                        >
                          {formData.endDate
                            ? (() => {
                                const [year, month] =
                                  formData.endDate.split('-');
                                return `${year}.${String(month).padStart(2, '0')}`;
                              })()
                            : EXPERIENCE_FORM_TEXT['endDate'].placeholder}
                        </span>
                        <ChevronRight size={20} className="text-neutral-400" />
                      </button>
                    </div>
                  </div>
                  {/* TODO: 유효성 검사 필요한지 확인 필요 */}
                </FieldSection.Root>

                {/* 연도 (자동 입력) */}
                {/* TODO: 시작 연도 & api 요청시 값 필요없음 */}
                <FieldSection.Root className="flex flex-col">
                  <FieldSection.Label className="mb-[6px]" htmlFor="year">
                    {EXPERIENCE_FORM_TEXT['year'].label}
                  </FieldSection.Label>
                  <input
                    id="year"
                    type="text"
                    value={displayYear ? displayYear.toString() : ''}
                    placeholder={EXPERIENCE_FORM_TEXT['year'].placeholder}
                    readOnly
                    className="rounded-xs border border-solid border-neutral-80 px-3 py-[10px] text-xsmall14 font-normal text-neutral-0 placeholder:text-neutral-50 focus:border-primary focus:outline-none disabled:bg-neutral-95 disabled:text-neutral-50 md:text-xsmall16"
                  />
                </FieldSection.Root>
              </div>
            </div>

            {/* ============================== 경험 상세 작성 섹션 ============================= */}
            <div className="flex flex-col gap-5 pt-8">
              <h2 className="text-small16 font-semibold text-neutral-0">
                경험 상세 작성
              </h2>

              <div className="flex flex-col gap-5">
                {(
                  [
                    'situation',
                    'task',
                    'action',
                    'result',
                    'learnings',
                  ] as const satisfies readonly (keyof UserExperience)[]
                ).map((id) => (
                  <FieldSection.Root key={id}>
                    <div className="mb-[6px] flex items-center justify-between">
                      <FieldSection.Label htmlFor={id}>
                        {EXPERIENCE_FORM_TEXT[id].label}
                      </FieldSection.Label>
                      <TooltipButton
                        example={EXPERIENCE_FORM_TEXT[id].exampleTooltips || ''}
                      />
                    </div>
                    <FieldSection.Description>
                      {EXPERIENCE_FORM_TEXT[id].description}
                    </FieldSection.Description>
                    <FieldSection.Textarea
                      id={id}
                      register={register}
                      placeholder={EXPERIENCE_FORM_TEXT[id].placeholder}
                    />
                  </FieldSection.Root>
                ))}
              </div>
            </div>

            {/* ============================== 핵심 역량 섹션 ============================= */}
            <div className="flex flex-col gap-5 pt-8">
              <h2 className="text-small16 font-semibold text-neutral-0">
                핵심 역량
              </h2>

              <FieldSection.Root className="flex flex-col">
                <FieldSection.Label
                  className="mb-[6px]"
                  htmlFor="coreCompetency"
                >
                  {EXPERIENCE_FORM_TEXT['coreCompetency'].label}
                </FieldSection.Label>
                <FieldSection.Description>
                  {EXPERIENCE_FORM_TEXT['coreCompetency'].description}
                </FieldSection.Description>
                <FieldSection.Input<UserExperience>
                  id="coreCompetency"
                  value={formData.coreCompetency || ''}
                  onChange={handleCompetencyChange}
                  placeholder={
                    EXPERIENCE_FORM_TEXT['coreCompetency'].placeholder
                  }
                />
                <CompetencyBadges
                  coreCompetency={formData.coreCompetency || ''}
                  onRemove={(index) => {
                    if (!formData.coreCompetency) return;
                    const competencies = formData.coreCompetency.split(',');
                    competencies.splice(index, 1);
                    setValue('coreCompetency', competencies.join(','), {
                      shouldDirty: true,
                    });
                  }}
                />
              </FieldSection.Root>
            </div>
          </form>
        </div>

        {/* 푸터 */}
        <footer className="flex h-[100px] flex-col items-center gap-1 border-t border-neutral-85 px-5 py-4 md:h-[64px] md:flex-row md:justify-end md:gap-4 md:border-t-0 md:py-3">
          {/* 자동 저장 시간 표시 */}
          <div className="text-xxsmall12 text-neutral-50 md:text-xsmall14 md:leading-[1.375rem]">
            {lastAutoSaveTime &&
              `자동 저장 완료 ${lastAutoSaveTime.getMonth() + 1}.${lastAutoSaveTime.getDate()} ${String(lastAutoSaveTime.getHours()).padStart(2, '0')}:${String(lastAutoSaveTime.getMinutes()).padStart(2, '0')}`}
          </div>
          <button
            type="submit"
            form="experienceForm"
            className="w-full rounded-sm bg-primary px-3 py-3 text-xsmall16 font-medium text-white hover:bg-primary-hover disabled:bg-neutral-70 disabled:text-white md:w-[80px] md:py-2"
            disabled={!isDirty || createExperienceMutation.isPending}
          >
            {createExperienceMutation.isPending ? '저장 중...' : '저장'}
          </button>
        </footer>
      </div>

      <ExperienceCategoryModal
        open={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        selected={
          experienceCategory ? CATEGORY_REVERSE_MAP[experienceCategory] : ''
        }
        categories={CATEGORY_PAIRS.map(([d]) => d)}
        onSelect={handleCategorySelect}
      />

      <PeriodSelectModal
        isOpen={isStartPeriodModalOpen}
        onClose={() => setIsStartPeriodModalOpen(false)}
        onSelect={handleStartPeriodSelect}
        initialYear={
          formData.startDate ? parseInt(formData.startDate.split('-')[0]) : null
        }
        initialMonth={
          formData.startDate ? parseInt(formData.startDate.split('-')[1]) : null
        }
      />

      <PeriodSelectModal
        isOpen={isEndPeriodModalOpen}
        onClose={() => setIsEndPeriodModalOpen(false)}
        onSelect={handleEndPeriodSelect}
        initialYear={
          formData.endDate ? parseInt(formData.endDate.split('-')[0]) : null
        }
        initialMonth={
          formData.endDate ? parseInt(formData.endDate.split('-')[1]) : null
        }
      />
    </>
  );
};
