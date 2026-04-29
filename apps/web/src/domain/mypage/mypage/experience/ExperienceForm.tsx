'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Asterisk, ChevronRight, XIcon } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  CATEGORY_MAP,
  CATEGORY_REVERSE_MAP,
  EXPERIENCE_FORM_TEXT,
  MAX_COMPETENCIES,
} from './constants';

import {
  UserExperienceFiltersQueryKey,
  UserExperienceQueryKey,
} from '@/api/experience/experience';
import { UserExperienceType } from '@/api/experience/experienceSchema';
import {
  useGetUserAdmin,
  usePatchUserExperienceMutation,
} from '@/api/user/user';
import {
  CATEGORY_PAIRS,
  userExperienceSchema,
  type DisplayExperienceCategory,
  type UserExperience,
} from '@/api/user/userSchema';
import { useUnsavedChangesWarning } from '@/hooks/useUnsavedChangesWarning';
import { UseMutationResult, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { ExperienceCategoryModal } from './components/ExperienceCategoryModal';
import { FieldSection } from './components/FieldSection';
import { PeriodSelectModal } from './components/PeriodSelectModal';
import { TooltipButton } from './components/TooltipButton';

const formatYYYYMM = (iso: string | undefined) => {
  const [year, month] = iso?.split('-') || [];
  return year && month ? `${year}.${String(month).padStart(2, '0')}` : '';
};

// 기본값 정의
export const defaultFormData: Partial<UserExperience> = {
  title: '',
  experienceCategory: undefined,
  customCategoryName: '',
  organ: '',
  role: '',
  activityType: 'INDIVIDUAL', // 기본값: 개인
  startDate: '',
  endDate: '',
  situation: '',
  task: '',
  action: '',
  result: '',
  reflection: '',
  coreCompetency: '',
};

export interface CreateExperienceResponse {
  userExperienceId: number;
}

export interface UpdateExperienceParams {
  id: number;
  data: UserExperience;
}

interface ExperienceFormProps {
  onClose: () => void;
  initialData: UserExperienceType | null;
  isCopy?: boolean;
  isAdminMode?: boolean;
  createMutation: UseMutationResult<
    CreateExperienceResponse,
    Error,
    UserExperience,
    unknown
  >;
}

const normalizeCoreCompetency = (competency: string | undefined): string => {
  if (!competency) return '';
  return competency
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
    .join(', ');
};

export const ExperienceForm = ({
  onClose,
  initialData,
  isCopy = false,
  isAdminMode = false,
  createMutation,
}: ExperienceFormProps) => {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    reset,
    getValues,
    formState: { errors, isDirty, isValid },
  } = useForm<UserExperience>({
    resolver: zodResolver(userExperienceSchema),
    mode: 'onBlur', // onBlur 시 자동 검증
    reValidateMode: 'onChange', // 변경 시 재검증
    defaultValues: defaultFormData,
  });

  const formData = watch();
  const experienceCategory = watch('experienceCategory');

  // API mutation
  const updateExperienceMutation = usePatchUserExperienceMutation();

  // 관리자 여부 조회
  const { data: isAdmin } = useGetUserAdmin();

  const onCloseDrawer = useCallback(() => {
    onClose();
    queryClient.invalidateQueries({ queryKey: [UserExperienceQueryKey] });
    queryClient.invalidateQueries({
      queryKey: [UserExperienceFiltersQueryKey],
    });
  }, [onClose, queryClient]);

  // 저장 완료 여부를 추적하는 ref
  const isSavedRef = useRef(false);
  // 생성된 경험 정리 ID (자동 저장 시 사용)
  const experienceIdRef = useRef<number | null>(initialData?.id ?? null);
  // 자동 저장 중 여부
  const isAutoSavingRef = useRef(false);
  // 디바운싱 타이머
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  // 기간 모드 상태
  const [periodMode, setPeriodMode] = useState<'start' | 'end' | null>(null);

  // 타이머 정리 함수
  const clearAutoSaveTimer = useCallback(() => {
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
      autoSaveTimerRef.current = null;
    }
  }, []);

  // 저장되지 않은 변경사항 경고
  useUnsavedChangesWarning(
    isDirty && !isSavedRef.current,
    '작성 중인 경험 정리가 저장되지 않았습니다. 저장하지 않고 나가시겠습니까?',
  );

  // 연도 범위 계산
  const startDate = watch('startDate');
  const endDate = watch('endDate');
  useEffect(() => {
    if (startDate && endDate) {
      const startYear = new Date(startDate).getFullYear();
      const endYear = new Date(endDate).getFullYear();
      const yearsInRange: number[] = [];
      for (let year = startYear; year <= endYear; year++) {
        yearsInRange.push(year);
      }
      setDisplayYears(yearsInRange);
    }
  }, [startDate, endDate]);

  // 초기 데이터 설정
  useEffect(() => {
    if (initialData) {
      // UserExperienceType과 UserExperienceInfo의 nullable 필드를 처리
      const formattedData: any = {
        ...initialData,
        title: initialData.title ?? '',
        experienceCategory: initialData.experienceCategory ?? undefined,
        organ: initialData.organ ?? '',
        role: initialData.role ?? '',
        situation: initialData.situation ?? '',
        task: initialData.task ?? '',
        action: initialData.action ?? '',
        result: initialData.result ?? '',
        reflection: initialData.reflection ?? '',
        coreCompetency: initialData.coreCompetency ?? '',
        customCategoryName: initialData.customCategoryName ?? '',
        startDate: initialData.startDate ?? '',
        endDate: initialData.endDate ?? '',
        activityType: initialData.activityType ?? 'INDIVIDUAL',
      };
      reset(formattedData, { keepDefaultValues: false });

      // startDate와 endDate에서 연도 범위 계산
      if (initialData.startDate && initialData.endDate) {
        const startYear = new Date(initialData.startDate).getFullYear();
        const endYear = new Date(initialData.endDate).getFullYear();

        const yearsInRange: number[] = [];
        for (let year = startYear; year <= endYear; year++) {
          yearsInRange.push(year);
        }
        setDisplayYears(yearsInRange);
      }

      // 복제 모드면 바로 저장
      if (isCopy && !initialData.id) setTimeout(() => handleAutoSave(), 0);
    }
  }, [initialData, reset, isCopy]);

  const handleCompetencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    // 핵심 역량 입력 상태 (콤마 4개까지 허용하여 5단어 제한)
    const commaCount = (text.match(/,/g) || []).length;
    if (commaCount > MAX_COMPETENCIES - 1) {
      return;
    }
    setValue('coreCompetency', text, { shouldDirty: true });
  };

  // 자동 저장 함수 (실제 저장 로직)
  const handleAutoSave = useCallback(async () => {
    // 어드민 모드면 자동 저장 안 함
    if (isAdminMode) return;

    // 이미 자동 저장 중이면 중복 실행 방지
    if (isAutoSavingRef.current) return;

    // isDirty 체크 - 변경사항이 없으면 저장 안 함 (복제가 아닐 때만 체크)
    if (!isCopy && !isDirty) return;

    // 폼 데이터 스냅샷 (단 한 번만!)
    const snapshot = getValues();

    // Zod 스키마로 전체 폼 검증 (필수값 체크 포함)
    const parsed = userExperienceSchema.safeParse(snapshot);

    // 필수값이 모두 채워지지 않았으면 자동 저장 안 함
    if (!parsed.success) {
      return;
    }

    isAutoSavingRef.current = true;

    try {
      const saveData = {
        ...parsed.data,
        coreCompetency: normalizeCoreCompetency(parsed.data.coreCompetency),
        yearBadges: displayYears,
      };

      // 첫 저장이면 POST, 이미 ID가 있으면 PATCH
      if (experienceIdRef.current) {
        await updateExperienceMutation.mutateAsync({
          id: experienceIdRef.current,
          data: saveData,
        });
      } else {
        const createData = {
          ...saveData,
          isAdminAdded: false,
        };
        const result = await createMutation.mutateAsync(createData);
        experienceIdRef.current = result.userExperienceId;
      }

      // 자동 저장 성공 시 시간 업데이트
      setLastAutoSaveTime(new Date());
      // 현재 값을 새로운 기준점으로 설정 (이후 변경사항 추적을 위해)
      if (!isCopy) reset(snapshot, { keepDefaultValues: false });
      console.log('자동 저장 완료');
    } catch (error) {
      console.error('자동 저장 실패:', error);
      const errorMessage =
        '자동 저장 중 오류가 발생했습니다. \n' +
        (isAxiosError(error)
          ? error.response?.data?.message
          : '다시 시도해주세요.');
      alert(errorMessage);
    } finally {
      isAutoSavingRef.current = false;
    }
  }, [
    isAdminMode,
    isDirty,
    getValues,
    updateExperienceMutation,
    createMutation,
    isAdmin,
  ]);

  // 3초 디바운싱된 자동 저장 함수
  const debouncedAutoSave = useCallback(() => {
    // 어드민 모드면 자동 저장 안 함
    if (isAdminMode) return;

    // 이전 타이머 제거
    clearAutoSaveTimer();

    // 3초 후 자동 저장 실행
    autoSaveTimerRef.current = setTimeout(() => {
      handleAutoSave();
    }, 3000);
  }, [isAdminMode, handleAutoSave, clearAutoSaveTimer]);

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return clearAutoSaveTimer;
  }, [clearAutoSaveTimer]);

  const handleCompetencyBlur = async () => {
    // 검증
    await trigger('coreCompetency');
    // 디바운싱된 자동 저장
    debouncedAutoSave();
  };

  // register의 onBlur에 자동 저장 로직 추가
  const registerWithAutoSave = (name: keyof UserExperience) => {
    const registered = register(name);
    return {
      ...registered,
      onBlur: async (e: React.FocusEvent<any>) => {
        // 기본 register의 onBlur 실행 (검증)
        await registered.onBlur?.(e);
        // 디바운싱된 자동 저장 실행
        debouncedAutoSave();
      },
    };
  };

  // 경험 분류 선택 모달 상태
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  // 기간 선택 모달 상태
  const [displayYears, setDisplayYears] = useState<number[]>([]);
  // 자동 저장 상태
  const [lastAutoSaveTime, setLastAutoSaveTime] = useState<Date | null>(null);

  // 기간 선택 핸들러
  const handleStartPeriodSelect = async (year: number, month: number) => {
    const dateString = `${year}-${String(month).padStart(2, '0')}-01`;
    setValue('startDate', dateString, { shouldDirty: true });
    // 기간 선택 후 검증 및 디바운싱된 자동 저장
    await trigger('startDate');
    debouncedAutoSave();
    setPeriodMode('end');
  };

  const handleEndPeriodSelect = async (year: number, month: number) => {
    const dateString = `${year}-${String(month).padStart(2, '0')}-01`;
    setValue('endDate', dateString, { shouldDirty: true });
    // 기간 선택 후 검증 및 디바운싱된 자동 저장
    await trigger('endDate');
    debouncedAutoSave();
    setPeriodMode(null);
  };
  const isManualSavingRef = useRef(false);
  // 폼 제출 핸들러 (명시적 저장)
  const onSubmit = async (data: UserExperience) => {
    // 이미 저장 중이면 리턴 (중복 방지)
    if (isManualSavingRef.current) return;
    // 자동 저장 타이머 정리 (중복 저장 방지)
    clearAutoSaveTimer();
    isManualSavingRef.current = true;

    try {
      const submitData = {
        ...data,
        coreCompetency: normalizeCoreCompetency(data.coreCompetency),
        yearBadges: displayYears,
      };
      // 자동 저장으로 이미 생성되었으면 업데이트, 아니면 생성
      if (experienceIdRef.current) {
        await updateExperienceMutation.mutateAsync({
          id: experienceIdRef.current,
          data: submitData,
        });
      } else {
        const createData = {
          ...submitData,
          isAdminAdded: false,
        };
        const result = await createMutation.mutateAsync(createData);
        experienceIdRef.current = result.userExperienceId;
      }

      // 저장 성공 시 플래그 설정
      isSavedRef.current = true;
      alert('경험 정리가 성공적으로 저장되었습니다.');
      onCloseDrawer();
    } catch (error) {
      console.error('경험 정리 저장 실패:', error);
      const errorMessage =
        '저장 중 오류가 발생했습니다. \n' +
        (isAxiosError(error)
          ? error.response?.data?.message
          : '다시 시도해주세요.');
      alert(errorMessage);
    } finally {
      isManualSavingRef.current = false; // 저장 종료
    }
  };

  const handleCategorySelect = async (name: DisplayExperienceCategory) => {
    const apiCategory = CATEGORY_MAP[name];
    setValue('experienceCategory', apiCategory, { shouldDirty: true });
    // 기타가 아닌 경우 커스텀 입력값 초기화
    if (name !== '기타(직접입력)') {
      setValue('customCategoryName', '', { shouldDirty: true });
    }
    setIsCategoryModalOpen(false);
    // 카테고리 선택 후 검증 및 디바운싱된 자동 저장
    await trigger('experienceCategory');
    debouncedAutoSave();
  };

  // 모달 오픈 시 스크롤 락
  useEffect(() => {
    document.body.style.overflow =
      isCategoryModalOpen || periodMode !== null ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isCategoryModalOpen, periodMode]);
  // X 버튼 클릭 핸들러 (저장되지 않은 변경사항 확인)
  const handleClose = () => {
    if (isDirty && !isSavedRef.current) {
      const confirmClose = window.confirm(
        '작성 중인 경험 정리가 저장되지 않았습니다. 저장하지 않고 나가시겠습니까?',
      );
      if (!confirmClose) {
        return;
      }
    }
    onCloseDrawer();
  };

  return (
    <>
      <div className="flex h-full flex-col bg-white">
        {/* 헤더 */}
        <header className="relative flex h-[72px] items-center justify-center px-7 py-5 md:justify-start">
          <h1 className="text-small20 font-semibold">경험 작성</h1>
          <button
            onClick={handleClose}
            className="absolute right-6 flex h-7 w-7 items-center justify-center"
          >
            <XIcon size={24} />
          </button>
        </header>

        {/* 스크롤 가능한 메인 컨텐츠 */}
        <div className="flex-1 overflow-y-auto px-7 pb-[60px]">
          {/* 가이드 텍스트 */}
          <div className="bg-primary-5 mb-6 rounded-sm px-4 py-3">
            <p className="text-xsmall14 text-neutral-30 font-normal leading-[1.375rem]">
              활동이 다양할 수록 좋겠지만, 활동 내용 보다는 구체적인
              에피소드(직면한 문제, 내 역할, 역량, 배운점 등)을 중심으로 STAR
              양식을 정리해 주세요. 즉, 하나의 활동에도 여러 STAR 양식이 나올 수
              있습니다.
            </p>
            <span className="text-primary-dark mt-1 flex items-center gap-1 text-sm underline">
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
            className="divide-neutral-85 flex flex-col gap-8 divide-y"
          >
            {/* 기본 정보 섹션 */}
            <div className="flex flex-col gap-5">
              <h2 className="text-small16 text-neutral-0 font-semibold">
                기본 정보
              </h2>

              <div className="flex flex-col gap-5">
                {/* 경험 이름 */}
                <FieldSection.Root className="flex flex-col">
                  <FieldSection.Label
                    isRequired={true}
                    className="mb-[6px]"
                    htmlFor="title"
                  >
                    {EXPERIENCE_FORM_TEXT['title'].label}
                  </FieldSection.Label>
                  <FieldSection.Input<UserExperience>
                    id="title"
                    placeholder={EXPERIENCE_FORM_TEXT['title'].placeholder}
                    {...registerWithAutoSave('title')}
                  />
                  {errors.title && (
                    <p className="text-xxsmall12 mt-1 text-red-500">
                      {errors.title.message}
                    </p>
                  )}
                </FieldSection.Root>
                {/* 경험 분류 */}
                <div className="flex flex-col">
                  <label
                    htmlFor="experienceCategory"
                    className="text-xsmall14 text-neutral-20 md:text-xsmall16 mb-[6px] flex items-center gap-1.5 font-medium"
                  >
                    <span>
                      {EXPERIENCE_FORM_TEXT['experienceCategory'].label}
                    </span>
                    <Asterisk className="text-primary pb-1" size={16} />
                  </label>
                  {/* TODO: SelectButton 컴포넌트 적용 */}
                  <button
                    id="experienceCategory"
                    type="button"
                    onClick={() => setIsCategoryModalOpen(true)}
                    className="rounded-xs border-neutral-80 text-xsmall14 focus:border-primary md:text-xsmall16 flex items-center justify-between border border-solid px-3 py-[9px] font-normal focus:outline-none"
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
                        {...registerWithAutoSave('customCategoryName')}
                        className="block w-full"
                      />
                      {errors.customCategoryName && (
                        <p className="text-xxsmall12 mt-1 text-red-500">
                          {errors.customCategoryName.message}
                        </p>
                      )}
                    </FieldSection.Root>
                  )}
                </div>

                {/* 기관 */}
                <FieldSection.Root className="flex flex-col">
                  <FieldSection.Label
                    isRequired={true}
                    className="mb-[6px]"
                    htmlFor="organ"
                  >
                    {EXPERIENCE_FORM_TEXT['organ'].label}
                  </FieldSection.Label>
                  <FieldSection.Input<UserExperience>
                    id="organ"
                    placeholder={EXPERIENCE_FORM_TEXT['organ'].placeholder}
                    {...registerWithAutoSave('organ')}
                  />
                  {errors.organ && (
                    <p className="text-xxsmall12 mt-1 text-red-500">
                      {errors.organ.message}
                    </p>
                  )}
                </FieldSection.Root>

                {/* 역할 및 담당 업무 */}
                <FieldSection.Root className="flex flex-col">
                  <FieldSection.Label
                    isRequired={true}
                    className="mb-[6px]"
                    htmlFor="role"
                  >
                    {EXPERIENCE_FORM_TEXT['role'].label}
                  </FieldSection.Label>
                  <FieldSection.Input<UserExperience>
                    id="role"
                    placeholder={EXPERIENCE_FORM_TEXT['role'].placeholder}
                    {...registerWithAutoSave('role')}
                  />
                  {errors.role && (
                    <p className="text-xxsmall12 mt-1 text-red-500">
                      {errors.role.message}
                    </p>
                  )}
                </FieldSection.Root>

                {/* 팀·개인 여부 */}
                <fieldset className="relative flex flex-col border-0 p-0">
                  <legend className="text-xsmall14 text-neutral-20 md:text-xsmall16 mb-[6px] flex items-center font-medium">
                    <span>팀·개인 여부</span>
                    <Asterisk className="text-primary pb-1" size={16} />
                  </legend>
                  <div className="flex gap-4" role="radiogroup">
                    <label
                      htmlFor="activityType-individual"
                      className="flex cursor-pointer items-center gap-2"
                    >
                      <FieldSection.Input<UserExperience>
                        id="activityType-individual"
                        type="radio"
                        value="INDIVIDUAL"
                        {...registerWithAutoSave('activityType')}
                        aria-invalid={!!errors.activityType}
                      />
                      <span className="text-xsmall14 text-neutral-0 md:text-xsmall16 font-normal">
                        개인
                      </span>
                    </label>
                    <label
                      htmlFor="activityType-team"
                      className="flex cursor-pointer items-center gap-2"
                    >
                      <FieldSection.Input<UserExperience>
                        id="activityType-team"
                        type="radio"
                        value="TEAM"
                        {...registerWithAutoSave('activityType')}
                        aria-invalid={!!errors.activityType}
                      />
                      <span className="text-xsmall14 text-neutral-0 md:text-xsmall16 font-normal">
                        팀
                      </span>
                    </label>
                  </div>
                  {errors.activityType && (
                    <p className="text-xxsmall12 mt-1 text-red-500">
                      {errors.activityType.message}
                    </p>
                  )}
                </fieldset>

                {/* 기간 */}
                <FieldSection.Root className="flex flex-col">
                  <FieldSection.Label
                    isRequired={true}
                    className="mb-[6px]"
                    htmlFor="period"
                  >
                    기간
                  </FieldSection.Label>
                  <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                      <button
                        type="button"
                        onClick={() => setPeriodMode('start')}
                        className="rounded-xs border-neutral-80 text-xsmall14 focus:border-primary md:text-xsmall16 flex w-full items-center justify-between border border-solid px-3 py-[10px] text-left font-normal focus:outline-none"
                      >
                        <span
                          className={
                            formData.startDate && formData.startDate !== ''
                              ? 'text-neutral-0'
                              : 'text-neutral-50'
                          }
                        >
                          {formatYYYYMM(formData.startDate) ||
                            EXPERIENCE_FORM_TEXT['startDate'].placeholder}
                        </span>
                        <ChevronRight size={20} className="text-neutral-400" />
                      </button>
                    </div>
                    <span className="text-xsmall14 md:text-xsmall16 w-2 text-neutral-400">
                      -
                    </span>
                    <div className="relative flex-1">
                      <button
                        type="button"
                        onClick={() => {
                          if (!formData.startDate) {
                            // 시작일이 없으면 시작 모달
                            setPeriodMode('start');
                          } else {
                            // 시작일이 있으면 종료 모달
                            setPeriodMode('end');
                          }
                        }}
                        className="rounded-xs border-neutral-80 text-xsmall14 focus:border-primary md:text-xsmall16 flex w-full items-center justify-between border border-solid px-3 py-[10px] text-left font-normal focus:outline-none"
                      >
                        <span
                          className={
                            formData.endDate && formData.endDate !== ''
                              ? 'text-neutral-0'
                              : 'text-neutral-50'
                          }
                        >
                          {formatYYYYMM(formData.endDate) ||
                            EXPERIENCE_FORM_TEXT['endDate'].placeholder}
                        </span>
                        <ChevronRight size={20} className="text-neutral-400" />
                      </button>
                    </div>
                  </div>
                  {(errors.endDate || errors.startDate) && (
                    <p className="text-xxsmall12 mt-1 text-red-500">
                      {errors.startDate?.message ?? errors.endDate?.message}
                    </p>
                  )}
                </FieldSection.Root>

                {/* 연도 (자동 입력) */}
                {/* TODO: 시작 연도 & api 요청시 값 필요없음 */}
                <FieldSection.Root className="flex flex-col">
                  <FieldSection.Label
                    isRequired={true}
                    className="mb-[6px]"
                    htmlFor="year"
                  >
                    {EXPERIENCE_FORM_TEXT['year'].label}
                  </FieldSection.Label>
                  <input
                    id="year"
                    type="text"
                    value={
                      displayYears.length > 0 ? displayYears.join(', ') : ''
                    }
                    placeholder={EXPERIENCE_FORM_TEXT['year'].placeholder}
                    readOnly
                    className="rounded-xs border-neutral-80 text-xsmall14 text-neutral-0 focus:border-primary disabled:bg-neutral-95 md:text-xsmall16 border border-solid px-3 py-[10px] font-normal placeholder:text-neutral-50 focus:outline-none disabled:text-neutral-50"
                  />
                </FieldSection.Root>
              </div>
            </div>

            {/* ============================== 경험 상세 작성 섹션 ============================= */}
            <div className="flex flex-col gap-5 pt-8">
              <h2 className="text-small16 text-neutral-0 font-semibold">
                경험 상세 작성
              </h2>

              <div className="flex flex-col gap-5">
                {(
                  [
                    'situation',
                    'task',
                    'action',
                    'result',
                    'reflection',
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
                      {...registerWithAutoSave(id)}
                      placeholder={EXPERIENCE_FORM_TEXT[id].placeholder}
                    />
                  </FieldSection.Root>
                ))}
              </div>
            </div>

            {/* ============================== 핵심 역량 섹션 ============================= */}
            <div className="flex flex-col gap-5 pt-8">
              <h2 className="text-small16 text-neutral-0 font-semibold">
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
                  onBlur={handleCompetencyBlur}
                  placeholder={
                    EXPERIENCE_FORM_TEXT['coreCompetency'].placeholder
                  }
                />
                {/* <CompetencyBadges
                  coreCompetency={formData.coreCompetency || ''}
                  onRemove={(index) => {
                    if (!formData.coreCompetency) return;
                    const competencies = formData.coreCompetency.split(',');
                    competencies.splice(index, 1);
                    setValue('coreCompetency', competencies.join(','), {
                      shouldDirty: true,
                    });
                  }}
                /> */}
              </FieldSection.Root>
            </div>
          </form>
        </div>

        {/* 푸터 */}
        <footer className="border-neutral-85 flex h-[100px] flex-col items-center gap-1 border-t px-5 py-4 md:h-[64px] md:flex-row md:justify-end md:gap-4 md:border-t-0 md:py-3">
          {/* 자동 저장 시간 표시 */}
          {!isAdminMode && (
            <div
              aria-live="polite"
              className="text-xxsmall12 md:text-xsmall14 h-4 text-neutral-50 md:h-[22px] md:leading-[1.375rem]"
            >
              {lastAutoSaveTime &&
                `자동 저장 완료 ${lastAutoSaveTime.getMonth() + 1}.${lastAutoSaveTime.getDate()} ${String(lastAutoSaveTime.getHours()).padStart(2, '0')}:${String(lastAutoSaveTime.getMinutes()).padStart(2, '0')}`}
            </div>
          )}
          <button
            type="submit"
            form="experienceForm"
            className="bg-primary text-xsmall16 hover:bg-primary-hover disabled:bg-neutral-70 w-full rounded-sm px-3 py-3 font-medium text-white disabled:text-white md:w-[80px] md:py-2"
            disabled={!isValid || isManualSavingRef.current}
          >
            저장
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

      {periodMode && (
        <PeriodSelectModal
          isOpen={!!periodMode}
          mode={periodMode}
          onClose={() => setPeriodMode(null)}
          onNext={() => setPeriodMode('end')}
          onPrev={() => setPeriodMode('start')}
          onSelect={
            periodMode === 'start'
              ? handleStartPeriodSelect
              : handleEndPeriodSelect
          }
          initialYear={
            periodMode === 'start'
              ? formData.startDate
                ? Number(formData.startDate.split('-')[0])
                : null
              : formData.endDate
                ? Number(formData.endDate.split('-')[0])
                : null
          }
          initialMonth={
            periodMode === 'start'
              ? formData.startDate
                ? Number(formData.startDate.split('-')[1])
                : null
              : formData.endDate
                ? Number(formData.endDate.split('-')[1])
                : null
          }
        />
      )}
    </>
  );
};
