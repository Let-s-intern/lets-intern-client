'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronRight, XIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { EXPERIENCE_FORM, MAX_COMPETENCIES } from './constants';

import {
  defaultFormData,
  ExperienceFormData,
  experienceFormSchema,
} from './experienceFormSchema';

import { FieldSection } from './FeildSection';
import { TooltipButton } from './TooltipButton';

interface ExperienceFormProps {
  onClose: () => void;
  initialData?: ExperienceFormData;
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
  } = useForm<ExperienceFormData>({
    resolver: zodResolver(experienceFormSchema),
    defaultValues: initialData || defaultFormData,
  });

  const formData = watch();

  // 초기 데이터 설정
  useEffect(() => {
    if (initialData) {
      Object.entries(initialData).forEach(([key, value]) => {
        setValue(key as keyof ExperienceFormData, value, {
          shouldDirty: false,
        });
      });
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

  // 폼 제출 핸들러
  const onSubmit = (data: ExperienceFormData) => {
    console.log('Form submitted:', data);
    // TODO: API 호출
    onClose();
  };

  return (
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
              <FieldSection.Root className="flex flex-col gap-2">
                <FieldSection.Label htmlFor="experienceName">
                  경험 이름
                </FieldSection.Label>
                <FieldSection.Input<ExperienceFormData>
                  id="experienceName"
                  placeholder={EXPERIENCE_FORM['experienceName'].placeholder}
                  register={register}
                />
              </FieldSection.Root>

              {/* 경험 분류 */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="experienceCategory"
                  className="text-xsmall16 font-medium text-neutral-20"
                >
                  경험 분류
                </label>
                <button
                  id="experienceCategory"
                  type="button"
                  onClick={() => setIsCategoryModalOpen(true)}
                  className="flex items-center justify-between rounded-xs border border-solid border-neutral-80 px-3 py-[9px] text-xsmall16 font-normal focus:border-primary focus:outline-none"
                >
                  <span
                    className={
                      formData?.experienceCategory
                        ? 'text-neutral-0'
                        : 'text-neutral-50'
                    }
                  >
                    {formData?.experienceCategory ||
                      EXPERIENCE_FORM['experienceCategory'].placeholder}
                  </span>
                  <ChevronRight size={20} className="text-neutral-400" />
                </button>
              </div>

              {/* 기관 */}
              <FieldSection.Root className="flex flex-col gap-2">
                <FieldSection.Label htmlFor="organization">
                  기관
                </FieldSection.Label>
                <FieldSection.Input<ExperienceFormData>
                  id="organization"
                  placeholder={EXPERIENCE_FORM['organization'].placeholder}
                  register={register}
                />
              </FieldSection.Root>

              {/* 역할 및 담당 업무 */}
              <FieldSection.Root className="flex flex-col gap-2">
                <FieldSection.Label htmlFor="roleAndResponsibilities">
                  역할 및 담당 업무
                </FieldSection.Label>
                <FieldSection.Input<ExperienceFormData>
                  id="roleAndResponsibilities"
                  placeholder={
                    EXPERIENCE_FORM['roleAndResponsibilities'].placeholder
                  }
                  register={register}
                />
              </FieldSection.Root>

              {/* 팀·개인 여부 */}
              <FieldSection.Root className="flex flex-col gap-2">
                <FieldSection.Label htmlFor="type">
                  팀·개인 여부
                </FieldSection.Label>
                <div className="flex gap-4">
                  <label className="flex cursor-pointer items-center gap-2">
                    <FieldSection.Input<ExperienceFormData>
                      id="type"
                      type="radio"
                      register={register}
                      value="INDIVIDUAL"
                    />
                    <span className="text-xsmall16 font-normal text-neutral-0">
                      개인
                    </span>
                  </label>
                  <label className="flex cursor-pointer items-center gap-2">
                    <FieldSection.Input<ExperienceFormData>
                      id="type"
                      type="radio"
                      register={register}
                      value="TEAM"
                    />
                    <span className="text-xsmall16 font-normal text-neutral-0">
                      팀
                    </span>
                  </label>
                </div>
              </FieldSection.Root>

              {/* 기간 */}
              <FieldSection.Root className="flex flex-col gap-4">
                <FieldSection.Label htmlFor="period">기간</FieldSection.Label>
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <button
                      type="button"
                      onClick={() => setIsStartPeriodModalOpen(true)}
                      className="flex w-full items-center justify-between rounded-xs border border-solid border-neutral-80 px-3 py-[10px] text-left text-xsmall16 font-normal focus:border-primary focus:outline-none"
                    >
                      {/* TODO: date로 관리 */}
                      <span
                        className={
                          formData.startDate
                            ? 'text-neutral-0'
                            : 'text-neutral-50'
                        }
                      >
                        {formData.startDate
                          ? `${formData.startDate}년 ${formData.startDate}월`
                          : EXPERIENCE_FORM['startDate'].placeholder}
                      </span>
                      <ChevronRight size={20} className="text-neutral-400" />
                    </button>
                  </div>
                  <span className="w-2 text-xsmall16 text-neutral-400">-</span>
                  <div className="relative flex-1">
                    <button
                      type="button"
                      onClick={() => setIsEndPeriodModalOpen(true)}
                      className="flex w-full items-center justify-between rounded-xs border border-solid border-neutral-80 px-3 py-[10px] text-left text-xsmall16 font-normal focus:border-primary focus:outline-none"
                    >
                      {/* TODO: date로 관리 */}
                      <span
                        className={
                          formData.endDate
                            ? 'text-neutral-0'
                            : 'text-neutral-50'
                        }
                      >
                        {formData.endDate
                          ? `${formData.endDate}년 ${formData.endDate}월`
                          : EXPERIENCE_FORM['endDate'].placeholder}
                      </span>
                      <ChevronRight size={20} className="text-neutral-400" />
                    </button>
                  </div>
                </div>
              </FieldSection.Root>

              {/* 연도 (자동 입력) */}
              <FieldSection.Root className="flex flex-col gap-2">
                <FieldSection.Label htmlFor="year">연도</FieldSection.Label>
                <FieldSection.Input<ExperienceFormData>
                  id="year"
                  type="text"
                  register={register}
                  placeholder={EXPERIENCE_FORM['year'].placeholder}
                  readOnly
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
                ] as const satisfies readonly (keyof ExperienceFormData)[]
              ).map((id) => (
                <FieldSection.Root key={id}>
                  <div className="mb-[6px] flex items-center justify-between">
                    <FieldSection.Label htmlFor={id}>
                      {EXPERIENCE_FORM[id].label}
                    </FieldSection.Label>
                    <TooltipButton
                      example={EXPERIENCE_FORM[id].exampleTooltips || ''}
                    />
                  </div>
                  <FieldSection.Description>
                    {EXPERIENCE_FORM[id].description}
                  </FieldSection.Description>
                  <FieldSection.Textarea
                    id={id}
                    register={register}
                    placeholder={EXPERIENCE_FORM[id].placeholder}
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

            <div className="flex flex-col gap-[6px]">
              <label
                htmlFor="coreCompetency"
                className="text-xsmall16 font-medium text-neutral-20"
              >
                핵심 역량 (최대 5개)
              </label>
              <p className="text-xsmall14 font-normal text-[#7F7F7F]">
                키워드를 입력한 뒤 콤마(,)를 누르면 자동으로 태그가
                만들어집니다.
              </p>
              {/* 입력 필드 (콤마 4개 제한) */}
              <input
                id="coreCompetency"
                type="text"
                value={formData.coreCompetency || ''}
                onChange={handleCompetencyChange}
                placeholder={EXPERIENCE_FORM['coreCompetency'].placeholder}
                className="rounded-xs border border-solid border-neutral-80 px-3 py-[9px] text-xsmall16 font-normal placeholder:text-neutral-50 focus:border-primary focus:outline-none"
              />
            </div>
          </div>
        </form>
      </div>

      {/* 푸터 */}
      <footer className="flex h-[64px] items-center justify-end gap-4 px-5 py-3">
        {/* TODO: 자동 저장 시간 표시 */}
        <div className="text-xsmall14 leading-[1.375rem] text-neutral-50">
          자동 저장 완료 10.19 04:17
        </div>
        <button
          type="submit"
          form="experienceForm"
          className="w-[80px] rounded-sm bg-primary px-3 py-2 text-xsmall16 font-medium text-white hover:bg-primary-hover disabled:bg-neutral-70 disabled:text-white"
          disabled={!isDirty}
        >
          저장
        </button>
      </footer>
    </div>
  );
};
