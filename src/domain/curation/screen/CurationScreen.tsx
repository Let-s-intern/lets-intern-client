'use client';
import ChallengeCompareSection from '../challenge-comparison/ChallengeCompareSection';
import FaqSection from '../faq/FaqSection';
import { heroCopy, stepLabels } from '../flow/copy';
import CurationStepper from '../flow/CurationStepper';
import PersonaSelector from '../flow/PersonaSelector';
import { QUESTION_MAP } from '../flow/questions';
import QuestionStep from '../flow/QuestionStep';
import ResultSection from '../flow/ResultSection';
import { useCurationFlow } from '../flow/useCurationFlow';
import CurationHero from '../hero/CurationHero';
import CurationStickyNav from '../nav/CurationStickyNav';
import { SECTION_IDS, STICKY_NAV_HEIGHT } from '../shared/sectionIds';
import type { CurationQuestion, PersonaId } from '../types';

interface CurationFormProps {
  currentStep: number;
  personaId?: PersonaId;
  questionSet?: CurationQuestion[];
  step1Value: string;
  step2Value: string;
  step1Error?: string;
  step2Error?: string;
  onSelectPersona: (id: PersonaId) => void;
  onSelectStep1: (val: string) => void;
  onSelectStep2: (val: string) => void;
}

const CurationForm = ({
  currentStep,
  personaId,
  questionSet,
  step1Value,
  step2Value,
  step1Error,
  step2Error,
  onSelectPersona,
  onSelectStep1,
  onSelectStep2,
}: CurationFormProps) => {
  const step2Question = questionSet?.[1];
  const step2Filtered = step2Question
    ? {
        ...step2Question,
        options: step2Question.options.filter(
          (opt) => !opt.group || opt.group === step1Value,
        ),
      }
    : undefined;

  return (
    <form className="mt-8 flex flex-col gap-8">
      {currentStep === 0 && (
        <PersonaSelector selected={personaId} onSelect={onSelectPersona} />
      )}
      {currentStep === 1 && questionSet && (
        <QuestionStep
          question={questionSet[0]}
          value={step1Value}
          onChange={onSelectStep1}
          error={step1Error}
        />
      )}
      {currentStep === 2 && step2Filtered && (
        <QuestionStep
          question={step2Filtered}
          value={step2Value}
          onChange={onSelectStep2}
          error={step2Error}
        />
      )}
    </form>
  );
};

const CurationScreen = () => {
  const {
    formRef,
    currentStep,
    personaId,
    questionSet,
    errors,
    watch,
    setValue,
    goNext,
    goToStep,
    handleRestart,
    result,
    scrollToForm,
  } = useCurationFlow({ questionMap: QUESTION_MAP });

  const handleRestartAndScroll = () => {
    handleRestart();
    requestAnimationFrame(() => scrollToForm());
  };

  // Sticky nav 높이를 고려한 스크롤 함수
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (!section) return;

    const offsetPosition =
      section.getBoundingClientRect().top + window.scrollY - STICKY_NAV_HEIGHT;

    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
  };

  return (
    <main className="flex min-h-screen w-full flex-col">
      <CurationHero copy={heroCopy} />

      {/* Sticky Navigation Bar */}
      <CurationStickyNav
        onScrollToForm={() => scrollToSection(SECTION_IDS.FORM)}
        onScrollToChallengeComparison={() =>
          scrollToSection(SECTION_IDS.CHALLENGE_COMPARISON)
        }
        onScrollToFaq={() => scrollToSection(SECTION_IDS.FAQ)}
      />

      {/* Curation Selection Section */}
      <section
        className="flex min-h-screen w-full items-start justify-center"
        id={SECTION_IDS.FORM}
      >
        <div
          className="mx-auto flex w-full max-w-[73.75rem] flex-col gap-4 px-6 py-14 md:px-10"
          ref={formRef}
        >
          <div className="flex flex-col items-center self-stretch py-8 md:py-[3.75rem]">
            <p className="mb-16 text-center text-lg font-semibold leading-6 text-indigo-500">
              3초 큐레이션
            </p>
            <h2 className="mb-4 text-center text-2xl font-semibold leading-tight text-neutral-0 md:text-3xl md:leading-10">
              나에게 맞는 프로그램 찾기
            </h2>
            <p className="text-center text-base font-semibold leading-6 text-zinc-600 md:text-lg">
              간단한 질문으로 맞춤 챌린지와 플랜을 추천받아 보세요
            </p>
          </div>
          <CurationStepper
            currentStep={currentStep}
            steps={stepLabels}
            onStepClick={goToStep}
          />

          {!result && (
            <CurationForm
              currentStep={currentStep}
              personaId={personaId}
              questionSet={questionSet}
              step1Value={watch('step1')}
              step2Value={watch('step2')}
              step1Error={errors.step1?.message}
              step2Error={errors.step2?.message}
              onSelectPersona={(id) => {
                setValue('personaId', id, { shouldValidate: true });
                goNext();
              }}
              onSelectStep1={(val) => {
                setValue('step1', val, { shouldValidate: true });
                goNext();
              }}
              onSelectStep2={(val) => {
                setValue('step2', val, { shouldValidate: true });
                goNext();
              }}
            />
          )}

          {result && (
            <div className="pt-8">
              <ResultSection
                result={result}
                onRestart={handleRestartAndScroll}
              />
            </div>
          )}
        </div>
      </section>

      {/* Section Divider */}
      <div className="mx-6 border-t border-neutral-90 md:mx-10 lg:mx-[7.5rem]" />

      {/* Challenge Comparison Section */}
      <section className="w-full bg-[#f9f9f8]">
        <div className="flex w-full flex-col items-center pb-[120px] pt-10">
          <ChallengeCompareSection />
        </div>
      </section>

      {/* Section Divider */}
      <div className="mx-6 border-t border-neutral-90 md:mx-10 lg:mx-[7.5rem]" />

      {/* FAQ Section */}
      <section className="w-full bg-white">
        <div className="mx-auto flex w-full max-w-[73.75rem] flex-col gap-16 px-6 py-24 md:px-10">
          <FaqSection />
        </div>
      </section>
    </main>
  );
};

export default CurationScreen;
