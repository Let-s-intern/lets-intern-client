import SolidButton from '@/common/button/SolidButton';
import { GUIDE_STEPS, PROGRAMS } from '../constants';
import { CurationResult, ProgramRecommendation } from '../types';

interface ResultSectionProps {
  result: CurationResult | null;
  onRestart: () => void;
}

const RecommendationCard = ({ recommendation }: { recommendation: ProgramRecommendation }) => {
  const program = PROGRAMS[recommendation.programId];
  const plan = program.plans.find((p) => p.id === recommendation.suggestedPlanId) ??
    program.plans[0];

  return (
    <div className="flex h-full flex-col gap-y-3 rounded-xl border border-neutral-90 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="rounded-md bg-primary-10 px-2 py-1 text-xsmall12 font-semibold text-primary">
          {recommendation.emphasis === 'primary' ? '주요 추천' : '보완 추천'}
        </span>
        {program.badge && (
          <span className="rounded-md bg-neutral-95 px-2 py-1 text-xsmall12 font-semibold text-neutral-40">
            {program.badge}
          </span>
        )}
      </div>
      <div className="text-small18 font-semibold text-neutral-0">{program.title}</div>
      <p className="text-xsmall14 text-neutral-40">{program.subtitle}</p>
      <div className="flex flex-wrap gap-2 text-xsmall13 text-neutral-40">
        <span className="rounded-md bg-neutral-95 px-2 py-1">대상: {program.target}</span>
        <span className="rounded-md bg-neutral-95 px-2 py-1">기간: {program.duration}</span>
        <span className="rounded-md bg-neutral-95 px-2 py-1">피드백: {program.feedback}</span>
      </div>
      <div className="rounded-lg bg-primary-5 px-3 py-2 text-xsmall14 text-neutral-10">
        <p className="font-semibold text-primary">이 조합으로 진행하세요</p>
        <p className="pt-1 text-neutral-10">{recommendation.reason}</p>
      </div>
      <div className="flex flex-col gap-1 rounded-lg bg-neutral-96 px-3 py-2">
        <div className="text-xsmall13 text-neutral-40">추천 플랜</div>
        <div className="text-small16 font-semibold text-neutral-0">{plan.name}</div>
        <div className="text-xsmall14 text-neutral-30">{plan.price}{plan.note ? ` · ${plan.note}` : ''}</div>
      </div>
      <div>
        <div className="text-xsmall13 text-neutral-40">결과물</div>
        <div className="text-xsmall15 text-neutral-0">{program.deliverable}</div>
      </div>
    </div>
  );
};

const ResultSection = ({ result, onRestart }: ResultSectionProps) => {
  return (
    <section className="w-full" id="curation-result">
      <div className="flex items-center justify-between pb-4">
        <div className="flex flex-col gap-1">
          <h3 className="text-medium22 font-bold text-neutral-0">추천 결과</h3>
          <p className="text-xsmall15 text-neutral-40">
            답변을 기반으로 챌린지, 플랜, 병행 가이드를 제안합니다.
          </p>
        </div>
        <SolidButton variant="secondary" size="md" onClick={onRestart}>
          다시 선택하기
        </SolidButton>
      </div>

      {!result && (
        <div className="rounded-xl border border-dashed border-neutral-85 bg-white px-4 py-8 text-center shadow-sm">
          <p className="text-small16 font-semibold text-neutral-0">아직 결과가 없어요.</p>
            <p className="text-xsmall14 text-neutral-40">준비 상태와 질문 2개를 완료하면 맞춤 추천을 보여드릴게요.</p>
        </div>
      )}

      {result && (
        <div className="flex flex-col gap-6 rounded-xl border border-neutral-90 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-2">
            <p className="text-xsmall14 font-semibold text-primary">{result.headline}</p>
            <p className="text-small16 text-neutral-30">{result.summary}</p>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {result.recommendations.map((rec) => (
              <RecommendationCard key={`${rec.programId}-${rec.emphasis}`} recommendation={rec} />
            ))}
          </div>
          <div className="rounded-lg bg-neutral-96 px-4 py-3">
            <p className="text-xsmall13 font-semibold text-neutral-30">병행 수강 가이드</p>
            <ul className="list-disc space-y-2 pl-5 pt-2 text-xsmall14 text-neutral-0">
              {GUIDE_STEPS.map((step) => (
                <li key={step}>{step}</li>
              ))}
              {result.emphasisNotes?.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
};

export default ResultSection;
