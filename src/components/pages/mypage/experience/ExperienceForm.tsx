'use client';

import Polygon from '@/assets/icons/polygon.svg?react';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronRight, XIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { EXAMPLE_TOOLTIPS, MAX_COMPETENCIES, PLACEHOLDERS } from './constants';

import {
  defaultFormData,
  ExperienceFormData,
  experienceFormSchema,
} from './experienceFormSchema';

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
    setValue('coreCompetenciesText', text, { shouldDirty: true });
  };

  // 경험 분류 선택 모달 상태
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  // 기간 선택 모달 상태
  const [isStartPeriodModalOpen, setIsStartPeriodModalOpen] = useState(false);
  const [isEndPeriodModalOpen, setIsEndPeriodModalOpen] = useState(false);

  const [hoveredTooltip, setHoveredTooltip] = useState<
    'situation' | 'task' | 'action' | 'result' | 'learnings' | null
  >(null);

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
              <div className="flex flex-col gap-[6px]">
                <label
                  htmlFor="experienceName"
                  className="text-xsmall16 font-medium text-neutral-20"
                >
                  경험 이름
                </label>
                <input
                  id="experienceName"
                  type="text"
                  {...register('experienceName')}
                  placeholder={PLACEHOLDERS.experienceName}
                  className="rounded-xs border border-solid border-neutral-80 px-3 py-[9px] text-xsmall16 font-normal placeholder:text-neutral-50 focus:border-primary focus:outline-none"
                />
              </div>

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
                      PLACEHOLDERS.experienceCategory}
                  </span>
                  <ChevronRight size={20} className="text-neutral-400" />
                </button>
              </div>

              {/* 기관 */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="organization"
                  className="text-xsmall16 font-medium text-neutral-20"
                >
                  기관
                </label>
                <input
                  id="organization"
                  type="text"
                  {...register('organization')}
                  placeholder={PLACEHOLDERS.organization}
                  className="rounded-xs border border-solid border-neutral-80 px-3 py-[9px] text-xsmall16 font-normal placeholder:text-neutral-50 focus:border-primary focus:outline-none"
                />
              </div>

              {/* 역할 및 담당 업무 */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="roleAndResponsibilities"
                  className="text-xsmall16 font-medium text-neutral-20"
                >
                  역할 및 담당 업무
                </label>
                <input
                  id="roleAndResponsibilities"
                  type="text"
                  {...register('roleAndResponsibilities')}
                  placeholder={PLACEHOLDERS.roleAndResponsibilities}
                  className="rounded-xs border border-solid border-neutral-80 px-3 py-[9px] text-xsmall16 font-normal placeholder:text-neutral-50 focus:border-primary focus:outline-none"
                />
              </div>

              {/* 팀·개인 여부 */}
              <div className="flex flex-col gap-2">
                <label className="text-xsmall16 font-medium text-neutral-20">
                  팀·개인 여부
                </label>
                <div className="flex gap-4">
                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type="radio"
                      {...register('type')}
                      value="INDIVIDUAL"
                      className="m-[2.5px] h-[19px] w-[19px] cursor-pointer appearance-none rounded-full border border-solid border-neutral-70 checked:border-[5px] checked:border-primary-90"
                    />
                    <span className="text-xsmall16 font-normal text-neutral-0">
                      개인
                    </span>
                  </label>
                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type="radio"
                      {...register('type')}
                      value="TEAM"
                      className="m-[2.5px] h-[19px] w-[19px] cursor-pointer appearance-none rounded-full border border-solid border-neutral-70 checked:border-[5px] checked:border-primary-90"
                    />
                    <span className="text-xsmall16 font-normal text-neutral-0">
                      팀
                    </span>
                  </label>
                </div>
              </div>

              {/* 기간 */}
              <div className="flex flex-col gap-4">
                <label className="text-xsmall16 font-medium text-neutral-20">
                  기간
                </label>
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <button
                      type="button"
                      onClick={() => setIsStartPeriodModalOpen(true)}
                      className="flex w-full items-center justify-between rounded-xs border border-solid border-neutral-80 px-3 py-[10px] text-left text-xsmall16 font-normal focus:border-primary focus:outline-none"
                    >
                      <span
                        className={
                          formData.startYear && formData.startMonth
                            ? 'text-neutral-0'
                            : 'text-neutral-50'
                        }
                      >
                        {formData.startYear && formData.startMonth
                          ? `${formData.startYear}년 ${formData.startMonth}월`
                          : PLACEHOLDERS.startYear}
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
                      <span
                        className={
                          formData.endYear && formData.endMonth
                            ? 'text-neutral-0'
                            : 'text-neutral-50'
                        }
                      >
                        {formData.endYear && formData.endMonth
                          ? `${formData.endYear}년 ${formData.endMonth}월`
                          : PLACEHOLDERS.endYear}
                      </span>
                      <ChevronRight size={20} className="text-neutral-400" />
                    </button>
                  </div>
                </div>
              </div>

              {/* 연도 (자동 입력) */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="year"
                  className="text-xsmall16 font-medium text-neutral-20"
                >
                  연도
                </label>
                <input
                  id="year"
                  type="text"
                  {...register('year')}
                  placeholder={PLACEHOLDERS.year}
                  readOnly
                  className="rounded-xs border border-solid border-neutral-80 px-3 py-[9px] text-xsmall16 font-normal text-neutral-0 placeholder:text-neutral-50 focus:border-primary focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* ============================== 경험 상세 작성 섹션 ============================= */}
          <div className="flex flex-col gap-5 pt-8">
            <h2 className="text-small16 font-semibold text-neutral-0">
              경험 상세 작성
            </h2>

            <div className="flex flex-col gap-5">
              {/* Situation(상황) */}
              <div className="relative">
                <div className="mb-[6px] flex items-center justify-between">
                  <label
                    htmlFor="situation"
                    className="text-xsmall16 font-medium text-neutral-20"
                  >
                    Situation (상황)
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      className="rounded-xxs border border-neutral-80 px-[6px] py-1 text-xsmall14 font-medium text-primary-80"
                      onMouseEnter={() => setHoveredTooltip('situation')}
                      onMouseLeave={() => setHoveredTooltip(null)}
                    >
                      💡 참고 예시
                    </button>
                    {hoveredTooltip === 'situation' && (
                      <div className="z-[100]">
                        <Polygon
                          style={{
                            height: '11px',
                            width: '12px',
                            filter: 'drop-shadow(0 -1px 1px rgb(0,0,0,0.08))',
                          }}
                          className="absolute right-[50%] top-[calc(100%+2px)] z-[102] translate-x-1/2 text-white"
                          preserveAspectRatio="none"
                        />
                        <div
                          className="absolute right-0 top-[calc(100%+12px)] z-[101] w-[384px] rounded-xxs bg-white p-3 text-neutral-0 drop-shadow"
                          onMouseEnter={() => setHoveredTooltip('situation')}
                          onMouseLeave={() => setHoveredTooltip(null)}
                        >
                          <p className="whitespace-pre-line text-xsmall14 font-normal">
                            {EXAMPLE_TOOLTIPS.situation}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <p className="mb-[10px] text-xsmall14 font-normal text-[#7F7F7F]">
                  경험이 일어난 배경과 맥락을 간단히 설명해주세요.
                </p>
                <textarea
                  id="situation"
                  rows={4}
                  {...register('situation')}
                  placeholder={PLACEHOLDERS.situation}
                  className="inline-block h-[144px] w-full resize-none rounded-xxs border border-solid border-neutral-80 p-3 text-xsmall16 font-normal leading-[1.625rem] placeholder:text-neutral-50 focus:border-primary focus:outline-none"
                />
              </div>

              {/* Task (문제) */}
              <div className="relative">
                <div className="mb-[6px] flex items-center justify-between">
                  <label
                    htmlFor="task"
                    className="text-xsmall16 font-medium text-neutral-20"
                  >
                    Task (문제)
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      className="rounded-xxs border border-neutral-80 px-[6px] py-1 text-xsmall14 font-medium text-primary-80"
                      onMouseEnter={() => setHoveredTooltip('task')}
                      onMouseLeave={() => setHoveredTooltip(null)}
                    >
                      💡 참고 예시
                    </button>
                    {hoveredTooltip === 'task' && (
                      <div className="z-[100]">
                        <Polygon
                          style={{
                            height: '11px',
                            width: '12px',
                            filter: 'drop-shadow(0 -1px 1px rgb(0,0,0,0.08))',
                          }}
                          className="absolute right-[50%] top-[calc(100%+2px)] z-[102] translate-x-1/2 text-white"
                          preserveAspectRatio="none"
                        />
                        <div
                          className="absolute right-0 top-[calc(100%+12px)] z-[101] w-[384px] rounded-xxs bg-white p-3 text-neutral-0 drop-shadow"
                          onMouseEnter={() => setHoveredTooltip('task')}
                          onMouseLeave={() => setHoveredTooltip(null)}
                        >
                          <p className="whitespace-pre-line text-xsmall14 font-normal">
                            {EXAMPLE_TOOLTIPS.task}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <p className="mb-[10px] text-xsmall14 font-normal text-[#7F7F7F]">
                  그 상황에서 맡았던 목표나 해결해야 했던 과제를 구체적으로
                  적어주세요.
                </p>
                <textarea
                  id="task"
                  rows={4}
                  {...register('task')}
                  placeholder={PLACEHOLDERS.task}
                  className="inline-block h-[144px] w-full resize-none rounded-xxs border border-solid border-neutral-80 p-3 text-xsmall16 font-normal leading-[1.625rem] placeholder:text-neutral-50 focus:border-primary focus:outline-none"
                />
              </div>

              {/* Action (행동) */}
              <div className="relative">
                <div className="mb-[6px] flex items-center justify-between">
                  <label
                    htmlFor="action"
                    className="text-xsmall16 font-medium text-neutral-20"
                  >
                    Action (행동)
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      className="rounded-xxs border border-neutral-80 px-[6px] py-1 text-xsmall14 font-medium text-primary-80"
                      onMouseEnter={() => setHoveredTooltip('action')}
                      onMouseLeave={() => setHoveredTooltip(null)}
                    >
                      💡 참고 예시
                    </button>
                    {hoveredTooltip === 'action' && (
                      <div className="z-[100]">
                        <Polygon
                          style={{
                            height: '11px',
                            width: '12px',
                            filter: 'drop-shadow(0 -1px 1px rgb(0,0,0,0.08))',
                          }}
                          className="absolute right-[50%] top-[calc(100%+2px)] z-[102] translate-x-1/2 text-white"
                          preserveAspectRatio="none"
                        />
                        <div
                          className="absolute right-0 top-[calc(100%+12px)] z-[101] w-[384px] rounded-xxs bg-white p-3 text-neutral-0 drop-shadow"
                          onMouseEnter={() => setHoveredTooltip('action')}
                          onMouseLeave={() => setHoveredTooltip(null)}
                        >
                          <p className="whitespace-pre-line text-xsmall14 font-normal">
                            {EXAMPLE_TOOLTIPS.action}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <p className="mb-[10px] text-xsmall14 font-normal text-[#7F7F7F]">
                  과제를 해결하기 위해 직접 수행한 행동과 역할을 상세히
                  서술해주세요.
                </p>
                <textarea
                  id="action"
                  rows={4}
                  {...register('action')}
                  placeholder={PLACEHOLDERS.action}
                  className="inline-block h-[144px] w-full resize-none rounded-xxs border border-solid border-neutral-80 p-3 text-xsmall16 font-normal leading-[1.625rem] placeholder:text-neutral-50 focus:border-primary focus:outline-none"
                />
              </div>

              {/* Result (결과) */}
              <div className="relative">
                <div className="mb-[6px] flex items-center justify-between">
                  <label
                    htmlFor="result"
                    className="text-xsmall16 font-medium text-neutral-20"
                  >
                    Result (결과)
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      className="rounded-xxs border border-neutral-80 px-[6px] py-1 text-xsmall14 font-medium text-primary-80"
                      onMouseEnter={() => setHoveredTooltip('result')}
                      onMouseLeave={() => setHoveredTooltip(null)}
                    >
                      💡 참고 예시
                    </button>
                    {hoveredTooltip === 'result' && (
                      <div className="z-[100]">
                        <Polygon
                          style={{
                            height: '11px',
                            width: '12px',
                            filter: 'drop-shadow(0 -1px 1px rgb(0,0,0,0.08))',
                          }}
                          className="absolute right-[50%] top-[calc(100%+2px)] z-[102] translate-x-1/2 text-white"
                          preserveAspectRatio="none"
                        />
                        <div
                          className="absolute right-0 top-[calc(100%+12px)] z-[101] w-[384px] rounded-xxs bg-white p-3 text-neutral-0 drop-shadow"
                          onMouseEnter={() => setHoveredTooltip('result')}
                          onMouseLeave={() => setHoveredTooltip(null)}
                        >
                          <p className="whitespace-pre-line text-xsmall14 font-normal">
                            {EXAMPLE_TOOLTIPS.result}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <p className="mb-[10px] text-xsmall14 font-normal text-[#7F7F7F]">
                  그 행동을 통해 얻은 성과나 변화, 배운 점을 수치나 사례로
                  표현해주세요.
                </p>
                <textarea
                  id="result"
                  rows={4}
                  {...register('result')}
                  placeholder={PLACEHOLDERS.result}
                  className="inline-block h-[144px] w-full resize-none rounded-xxs border border-solid border-neutral-80 p-3 text-xsmall16 font-normal leading-[1.625rem] placeholder:text-neutral-50 focus:border-primary focus:outline-none"
                />
              </div>

              {/* 느낀 점 / 배운 점 */}
              <div className="relative">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="learnings"
                    className="text-xsmall16 font-medium text-neutral-20"
                  >
                    느낀 점 / 배운 점
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      className="rounded-xxs border border-neutral-80 px-[6px] py-1 text-xsmall14 font-medium text-primary-80"
                      onMouseEnter={() => setHoveredTooltip('learnings')}
                      onMouseLeave={() => setHoveredTooltip(null)}
                    >
                      💡 참고 예시
                    </button>
                    {hoveredTooltip === 'learnings' && (
                      <div className="z-[100]">
                        <Polygon
                          style={{
                            height: '11px',
                            width: '12px',
                            filter: 'drop-shadow(0 -1px 1px rgb(0,0,0,0.08))',
                          }}
                          className="absolute right-[50%] top-[calc(100%+2px)] z-[102] translate-x-1/2 text-white"
                          preserveAspectRatio="none"
                        />
                        <div
                          className="absolute right-0 top-[calc(100%+12px)] z-[101] w-[384px] rounded-xxs bg-white p-3 text-neutral-0 drop-shadow"
                          onMouseEnter={() => setHoveredTooltip('learnings')}
                          onMouseLeave={() => setHoveredTooltip(null)}
                        >
                          <p className="whitespace-pre-line text-xsmall14 font-normal">
                            {EXAMPLE_TOOLTIPS.learnings}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <p className="mb-[10px] text-xsmall14 font-normal text-[#7F7F7F]">
                  이 경험을 통해 얻은 깨달음이나 성장 포인트를 자유롭게
                  작성해주세요.
                </p>
                <textarea
                  id="learnings"
                  rows={4}
                  {...register('learnings')}
                  placeholder={PLACEHOLDERS.learnings}
                  className="inline-block h-[144px] w-full resize-none rounded-xxs border border-solid border-neutral-80 p-3 text-xsmall16 font-normal leading-[1.625rem] placeholder:text-neutral-50 focus:border-primary focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* ============================== 핵심 역량 섹션 ============================= */}
          <div className="flex flex-col gap-5 pt-8">
            <h2 className="text-small16 font-semibold text-neutral-0">
              핵심 역량
            </h2>

            <div className="flex flex-col gap-[6px]">
              <label
                htmlFor="coreCompetencies"
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
                id="coreCompetencies"
                type="text"
                value={formData.coreCompetenciesText || ''}
                onChange={handleCompetencyChange}
                placeholder={PLACEHOLDERS.coreCompetencies}
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
