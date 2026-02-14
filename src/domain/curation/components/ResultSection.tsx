import SolidButton from '@/common/button/SolidButton';
import { GUIDE_STEPS, PROGRAMS } from '../constants';
import { CurationResult, ProgramRecommendation } from '../types';

interface ResultSectionProps {
  result: CurationResult | null;
  onRestart: () => void;
}

const RecommendationCard = ({ recommendation }: { recommendation: ProgramRecommendation }) => {
  const program = PROGRAMS[recommendation.programId];
  const plan =
    program.plans.find((p) => p.id === recommendation.suggestedPlanId) ?? program.plans[0];

  return (
    <div className="flex h-full flex-col gap-y-4 rounded-2xl border-2 border-neutral-90 bg-gradient-to-br from-white to-gray-50 p-6 shadow-lg transition-all hover:shadow-xl hover:scale-[1.02]">
      <div className="flex items-center gap-2">
        <span
          className={`rounded-full px-3 py-1.5 text-xsmall12 font-bold shadow-sm ${
            recommendation.emphasis === 'primary'
              ? 'bg-gradient-to-r from-primary to-primary-80 text-white'
              : 'bg-gradient-to-r from-primary-10 to-primary-5 text-primary'
          }`}
        >
          {recommendation.emphasis === 'primary' ? '주요 추천' : '보완 추천'}
        </span>
        {program.badge && (
          <span className="rounded-full bg-neutral-90 px-3 py-1.5 text-xsmall12 font-semibold text-neutral-40">
            {program.badge}
          </span>
        )}
      </div>
      <div className="text-medium20 font-black text-neutral-0">{program.title}</div>
      <p className="text-small15 font-medium text-neutral-40">{program.subtitle}</p>
      <div className="flex flex-wrap gap-2 text-xsmall13 font-medium text-neutral-40">
        <span className="rounded-lg bg-neutral-95 px-2.5 py-1.5">대상: {program.target}</span>
        <span className="rounded-lg bg-neutral-95 px-2.5 py-1.5">기간: {program.duration}</span>
        <span className="rounded-lg bg-neutral-95 px-2.5 py-1.5">피드백: {program.feedback}</span>
      </div>
      <div className="rounded-xl bg-gradient-to-br from-primary-5 to-primary-10 border border-primary/20 px-4 py-3 text-small14">
        <p className="font-bold text-primary">이 조합으로 진행하세요</p>
        <p className="pt-1.5 font-medium leading-relaxed text-neutral-20">{recommendation.reason}</p>
      </div>
      <div className="flex flex-col gap-2 rounded-xl border border-neutral-90 bg-white px-4 py-3 shadow-sm">
        <div className="text-xsmall13 font-semibold text-neutral-40">추천 플랜</div>
        <div className="text-medium18 font-black text-neutral-0">{plan.name}</div>
        <div className="text-small14 font-medium text-neutral-30">
          {plan.price}
          {plan.note ? ` · ${plan.note}` : ''}
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <div className="text-xsmall13 font-semibold text-neutral-40">결과물</div>
        <div className="text-small15 font-medium leading-relaxed text-neutral-0">
          {program.deliverable}
        </div>
      </div>
    </div>
  );
};

const ResultSection = ({ result, onRestart }: ResultSectionProps) => {
  return (
    <section className="w-full py-8" id="curation-result">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary-10 to-primary-5 px-4 py-2 text-small14 font-bold text-primary shadow-sm">
            <span className="text-medium18">🎯</span>
            <span>추천 결과</span>
          </div>
          <h3 className="text-large28 font-black text-neutral-0 md:text-large32">
            맞춤 추천 프로그램
          </h3>
          <p className="text-small16 font-medium text-neutral-40">
            답변을 기반으로 챌린지, 플랜, 병행 가이드를 제안합니다.
          </p>
        </div>

        {!result && (
          <div className="rounded-xl border border-dashed border-neutral-85 bg-white px-4 py-8 text-center shadow-sm">
            <p className="text-small16 font-semibold text-neutral-0">아직 결과가 없어요.</p>
            <p className="text-xsmall14 text-neutral-40">
              준비 상태와 질문 2개를 완료하면 맞춤 추천을 보여드릴게요.
            </p>
          </div>
        )}

        {result && (
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-3 rounded-2xl bg-gradient-to-br from-primary-5 to-white border-2 border-primary/20 p-6 shadow-lg text-center">
              <p className="text-medium18 font-black text-primary">{result.headline}</p>
              <p className="text-small16 font-medium leading-relaxed text-neutral-30">
                {result.summary}
              </p>
            </div>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {result.recommendations.map((rec) => (
                <RecommendationCard
                  key={`${rec.programId}-${rec.emphasis}`}
                  recommendation={rec}
                />
              ))}
            </div>
            <div className="rounded-2xl border-2 border-neutral-90 bg-gradient-to-br from-neutral-96 to-white px-6 py-5 shadow-sm">
              <p className="text-small16 font-black text-neutral-0 mb-3">병행 수강 가이드</p>
              <ul className="list-disc space-y-2 pl-5 text-small15 text-neutral-0">
                {GUIDE_STEPS.map((step) => (
                  <li key={step}>{step}</li>
                ))}
                {result.emphasisNotes?.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </div>
            <div className="flex justify-center pt-4">
              <SolidButton variant="secondary" size="lg" onClick={onRestart}>
                다시 선택하기
              </SolidButton>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ResultSection;
