'use client';
import ComparisonSection from './components/ComparisonSection';
import CurationHero from './components/CurationHero';
import CurationStepper from './components/CurationStepper';
import FaqSection from './components/FaqSection';
import PersonaSelector from './components/PersonaSelector';
import QuestionStep from './components/QuestionStep';
import ResultSection from './components/ResultSection';
import { QUESTION_MAP } from './constants';
import { defaultPersonaId, heroCopy, stepLabels } from './copy';
import { useCurationFlow } from './hooks/useCurationFlow';

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
  } = useCurationFlow({ defaultPersonaId, questionMap: QUESTION_MAP });

  const handleRestartAndScroll = () => {
    handleRestart();
    requestAnimationFrame(() => scrollToForm());
  };

  return (
    <main className="flex min-h-screen w-full flex-col">
      <CurationHero
        copy={heroCopy}
        onStart={scrollToForm}
        onScrollToComparison={() =>
          document.getElementById('curation-comparison')?.scrollIntoView({ behavior: 'smooth' })
        }
      />
      
      {/* Curation Selection Section */}
      <section className="w-full bg-white">
        <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-10 px-6 py-12" ref={formRef}>
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary-10 to-primary-5 px-4 py-2 text-small14 font-bold text-primary shadow-sm">
              <span className="text-medium18">✨</span>
              <span>3초 큐레이션</span>
            </div>
            <h2 className="text-large32 font-black leading-tight text-neutral-0 md:text-large36">
              나에게 맞는 프로그램 찾기
            </h2>
            <p className="text-medium18 font-medium text-neutral-40">
              간단한 질문으로 맞춤 챌린지와 플랜을 추천받으세요
            </p>
          </div>
          <CurationStepper currentStep={currentStep} steps={stepLabels} onStepClick={goToStep} />

          {!result && (
            <form className="flex flex-col gap-8">{currentStep === 0 && (
                <PersonaSelector
                  selected={personaId}
                  onSelect={(id) => {
                    setValue('personaId', id, { shouldValidate: true });
                    goNext();
                  }}
                />
              )}

              {currentStep === 1 && questionSet && (
                <QuestionStep
                  question={questionSet[0]}
                  value={watch('step1')}
                  onChange={(val) => {
                    setValue('step1', val, { shouldValidate: true });
                    goNext();
                  }}
                  error={errors.step1?.message}
                />
              )}

              {currentStep === 2 && questionSet && (
                <QuestionStep
                  question={questionSet[1]}
                  value={watch('step2')}
                  onChange={(val) => {
                    setValue('step2', val, { shouldValidate: true });
                    goNext();
                  }}
                  error={errors.step2?.message}
                />
              )}
            </form>
          )}

          {result && <ResultSection result={result} onRestart={handleRestartAndScroll} />}
        </div>
      </section>

      {/* Comparison & FAQ Section */}
      <section className="w-full bg-white">
        <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-12 px-6 py-24">
          <ComparisonSection />
          <FaqSection />
        </div>
      </section>
    </main>
  );
};

export default CurationScreen;
