'use client';
import { useMemo } from 'react';
import { QUESTION_MAP } from '../data/constants';
import { defaultPersonaId, heroCopy, stepLabels } from '../data/copy';
import { useCurationFlow } from '../hooks/useCurationFlow';
import ChallengeComparisonSection from '../ui/ChallengeComparisonSection';
import CurationHero from '../ui/CurationHero';
import CurationStepper from '../ui/CurationStepper';
import CurationStickyNav from '../ui/CurationStickyNav';
import FaqSection from '../ui/FaqSection';
import FrequentComparisonSection from '../ui/FrequentComparisonSection';
import PersonaSelector from '../ui/PersonaSelector';
import QuestionStep from '../ui/QuestionStep';
import ResultSection from '../ui/ResultSection';

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

  const highlightedPrograms = useMemo(() => {
    if (!result?.recommendations) return { primary: null, secondary: [] };
    const [primary, ...secondary] = result.recommendations.map(
      (r) => r.programId,
    );
    return { primary, secondary };
  }, [result]);

  const handleRestartAndScroll = () => {
    handleRestart();
    requestAnimationFrame(() => scrollToForm());
  };

  // Sticky nav 높이를 고려한 스크롤 함수
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (!section) return;

    const navHeight = 60; // sticky nav 높이 (약 56-60px)
    const offset = navHeight + 20; // 여유 공간 추가
    const elementPosition = section.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.scrollY - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    });
  };

  return (
    <main className="flex min-h-screen w-full flex-col">
      <CurationHero copy={heroCopy} />

      {/* Sticky Navigation Bar */}
      <CurationStickyNav
        onScrollToForm={() => scrollToSection('curation-form')}
        onScrollToChallengeComparison={() =>
          scrollToSection('curation-challenge-comparison')
        }
        onScrollToFrequentComparison={() =>
          scrollToSection('curation-frequent-comparison')
        }
        onScrollToFaq={() => scrollToSection('curation-faq')}
      />

      {/* Curation Selection Section */}
      <section
        className="w-full"
        id="curation-form"
      >
        <div
          className="flex w-full flex-col gap-10 px-[120px] py-14"
          ref={formRef}
        >
          <div className="flex flex-col items-center gap-5 self-stretch py-[3.75rem]">
            <p className="text-center text-lg font-semibold leading-6 text-indigo-500">
              3초 큐레이션
            </p>
            <h2 className="text-center text-3xl font-bold leading-10 text-neutral-0">
              나에게 맞는 프로그램 찾기
            </h2>
            <p className="text-center text-lg font-semibold leading-6 text-zinc-600">
              간단한 질문으로 맞춤 챌린지와 플랜을 추천받아 보세요
            </p>
          </div>
          <CurationStepper
            currentStep={currentStep}
            steps={stepLabels}
            onStepClick={goToStep}
          />

          {!result && (
            <form className="flex flex-col gap-8">
              {currentStep === 0 && (
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

      {/* Comparison & FAQ Section */}
      <section className="w-full bg-white">
        <div className="flex w-full flex-col gap-16 px-[120px] py-24">
          <ChallengeComparisonSection
            highlightedPrograms={highlightedPrograms}
          />
          <FrequentComparisonSection />
          <FaqSection />
        </div>
      </section>
    </main>
  );
};

export default CurationScreen;
