import { PROGRAMS } from '../constants';
import {
    CurationResult,
    FormValues,
    PersonaId,
    PlanId,
    ProgramId,
    ProgramRecommendation,
} from '../types';

const planPriorityByIntent: Record<string, PlanId[]> = {
  basic: ['basic', 'standard', 'premium'],
  feedback: ['standard', 'premium', 'basic'],
  intensive: ['premium', 'standard', 'basic'],
};

const pickPlan = (programId: ProgramId, intent: keyof typeof planPriorityByIntent) => {
  const program = PROGRAMS[programId];
  const available = program.plans.map((plan) => plan.id);
  const priority = planPriorityByIntent[intent];
  const matched = priority.find((planId) => available.includes(planId));
  return matched ?? available[0];
};

const uniqByProgram = (items: ProgramRecommendation[]) => {
  const seen = new Set<ProgramId>();
  return items.filter((item) => {
    if (seen.has(item.programId)) return false;
    seen.add(item.programId);
    return true;
  });
};

const buildResult = ({
  personaId,
  headline,
  summary,
  recommendations,
  notes,
}: {
  personaId: PersonaId;
  headline: string;
  summary: string;
  recommendations: ProgramRecommendation[];
  notes?: string[];
}): CurationResult => ({
  personaId,
  headline,
  summary,
  recommendations: uniqByProgram(recommendations),
  emphasisNotes: notes,
});

export const computeCurationResult = (values: FormValues): CurationResult => {
  const personaId = values.personaId ?? 'starter';
  const { step1, step2 } = values;

  switch (personaId) {
    case 'starter': {
      if (step1 === 'needs-resume') {
        return buildResult({
          personaId,
          headline: '이번 주 안에 제출해야 한다면, 이력서 → 자소서 순서로',
          summary:
            '이력서를 1주 안에 완성하고, 여유가 되는 대로 자소서를 병행하세요. 경험 소재가 부족하다면 경험정리 챌린지를 짧게 끼워 넣어도 좋습니다.',
          recommendations: [
            {
              programId: 'resume',
              emphasis: 'primary',
              reason: '공고 대응을 위한 1주 완성 트랙',
              suggestedPlanId: pickPlan('resume', step2 === 'need-feedback' ? 'feedback' : 'basic'),
            },
            {
              programId: 'coverLetter',
              emphasis: 'secondary',
              reason: '제출 후 지원동기/직무 역량을 다듬기 위한 후속 코스',
              suggestedPlanId: pickPlan('coverLetter', 'basic'),
            },
          ],
        });
      }

      if (step1 === 'needs-bundle') {
        return buildResult({
          personaId,
          headline: '서류 전체를 정비하고 싶다면 자소서 → 포트폴리오 순서로',
          summary:
            '자소서 핵심 문항을 먼저 완성하고, 직무 사례가 필요하면 포트폴리오 챌린지를 바로 이어가세요. 시간이 부족하면 자소서만 우선 마감해도 됩니다.',
          recommendations: [
            {
              programId: 'coverLetter',
              emphasis: 'primary',
              reason: '직무 분석과 지원동기를 빠르게 정리',
              suggestedPlanId: pickPlan('coverLetter', step2 === 'need-feedback' ? 'feedback' : 'basic'),
            },
            {
              programId: 'portfolio',
              emphasis: 'secondary',
              reason: '직무 사례와 자료가 필요할 때 후속으로 연결',
              suggestedPlanId: pickPlan('portfolio', step2 === 'need-portfolio' ? 'feedback' : 'basic'),
            },
          ],
        });
      }

      return buildResult({
        personaId,
        headline: '경험 소재부터 쌓고, 이력서로 이어가기',
        summary:
          '경험 소재가 부족하다면 2주 동안 STAR 기반으로 정리한 뒤, 1주 차에 이력서를 완성하세요. 지원 일정이 빠르면 경험정리 1~2회차만 빠르게 끝내고 이력서를 곧바로 진행해도 됩니다.',
        recommendations: [
          {
            programId: 'experience',
            emphasis: 'primary',
            reason: '소재 발굴과 구조화를 위한 첫 단계',
            suggestedPlanId: pickPlan('experience', step2 === 'need-feedback' ? 'feedback' : 'basic'),
          },
          {
            programId: 'resume',
            emphasis: 'secondary',
            reason: '정리한 소재를 채용 관점으로 전환',
            suggestedPlanId: pickPlan('resume', step2 === 'time-tight' ? 'basic' : 'feedback'),
          },
        ],
      });
    }

    case 'resume': {
      const headline =
        step2 === 'deadline-soon'
          ? '이번 주 안에 제출: 이력서 단일 집중'
          : '여유가 있다면 경험정리 또는 자소서를 곁들이기';

      const recommendations: ProgramRecommendation[] = [
        {
          programId: 'resume',
          emphasis: 'primary',
          reason: '지원 일정에 맞춘 1주 완성',
          suggestedPlanId: pickPlan('resume', step2 === 'deadline-soon' ? 'basic' : 'feedback'),
        },
      ];

      if (step1 === 'first-resume') {
        recommendations.push({
          programId: 'experience',
          emphasis: 'secondary',
          reason: '소재가 부족할 때 보강용',
          suggestedPlanId: pickPlan('experience', 'basic'),
        });
      }

      if (step1 === 'career-shift') {
        recommendations.push({
          programId: 'coverLetter',
          emphasis: 'secondary',
          reason: '직무/산업 전환 스토리 보강',
          suggestedPlanId: pickPlan('coverLetter', 'feedback'),
        });
      }

      return buildResult({
        personaId,
        headline,
        summary:
          '마감이 임박하면 이력서만 완성하고, 여유가 있으면 경험정리나 자소서를 병행해 완성도를 높이세요.',
        recommendations,
      });
    }

    case 'coverLetter': {
      if (step1 === 'enterprise-cover') {
        return buildResult({
          personaId,
          headline: '공채 문항 대비는 대기업 자소서 트랙으로',
          summary:
            '산업/기업 분석과 문항별 멘토링이 포함된 트랙이 필요합니다. 지원 일정에 따라 스탠다드(2회) 또는 프리미엄(4회) 피드백을 선택하세요.',
          recommendations: [
            {
              programId: 'enterpriseCover',
              emphasis: 'primary',
              reason: '공채 문항·현직자 특강 포함',
              suggestedPlanId: pickPlan(
                'enterpriseCover',
                step2 === 'needs-intensive' ? 'intensive' : 'feedback',
              ),
            },
          ],
        });
      }

      const recommendations: ProgramRecommendation[] = [
        {
          programId: 'coverLetter',
          emphasis: 'primary',
          reason: '직무 역량/지원동기 핵심 정리',
          suggestedPlanId: pickPlan(
            'coverLetter',
            step2 === 'needs-intensive'
              ? 'intensive'
              : step2 === 'needs-iteration'
                ? 'feedback'
                : 'basic',
          ),
        },
      ];

      if (step1 === 'portfolio-linked') {
        recommendations.push({
          programId: 'portfolio',
          emphasis: 'secondary',
          reason: '직무 사례와 포트폴리오를 함께 준비',
          suggestedPlanId: pickPlan('portfolio', step2 === 'needs-intensive' ? 'feedback' : 'basic'),
        });
      }

      return buildResult({
        personaId,
        headline: '직무형 자소서는 2주 완성 트랙으로',
        summary:
          '직무 분석과 스토리라인을 잡은 뒤, 피드백 강도에 맞춰 플랜을 선택하세요. 포트폴리오 연계가 필요하면 후속으로 이어가면 됩니다.',
        recommendations,
      });
    }

    case 'portfolio': {
      const baseProgram =
        step1 === 'marketing-track'
          ? 'marketingAllInOne'
          : step1 === 'hr-track'
            ? 'hrAllInOne'
            : 'portfolio';

      const recommendations: ProgramRecommendation[] = [
        {
          programId: baseProgram,
          emphasis: 'primary',
          reason: '직무 맞춤 포트폴리오/서류 완성',
          suggestedPlanId: pickPlan(
            baseProgram,
            step2 === 'need-feedback'
              ? 'feedback'
              : step2 === 'has-drafts'
                ? 'basic'
                : 'feedback',
          ),
        },
      ];

      if (baseProgram === 'portfolio' && step2 === 'need-templates') {
        recommendations.push({
          programId: 'coverLetter',
          emphasis: 'secondary',
          reason: '자소서 템플릿과 연계해 스토리 보강',
          suggestedPlanId: pickPlan('coverLetter', 'basic'),
        });
      }

      return buildResult({
        personaId,
        headline: '직무 사례를 입증할 포트폴리오 설계',
        summary:
          '포트폴리오를 핵심 근거로 삼고 싶다면 직무 트랙을 선택하세요. 초안이 있다면 구조화에 집중하고, 없다면 템플릿과 예시를 활용해 빠르게 골격을 세우면 됩니다.',
        recommendations,
      });
    }

    case 'specialized': {
      const trackProgram: Record<string, ProgramId> = {
        enterprise: 'enterpriseCover',
        marketing: 'marketingAllInOne',
        hr: 'hrAllInOne',
      };

      const selectedTrack = trackProgram[step1] ?? 'enterpriseCover';

      const recommendations: ProgramRecommendation[] = [
        {
          programId: selectedTrack,
          emphasis: 'primary',
          reason: '특화 트랙 중심 진행',
          suggestedPlanId: pickPlan(
            selectedTrack,
            step2 === 'need-feedback'
              ? 'intensive'
              : step2 === 'ready-to-run'
                ? 'feedback'
                : 'basic',
          ),
        },
      ];

      if (step2 === 'need-experience') {
        recommendations.push({
          programId: 'experience',
          emphasis: 'secondary',
          reason: '특화 트랙 전 소재 보강',
          suggestedPlanId: pickPlan('experience', 'basic'),
        });
      }

      return buildResult({
        personaId,
        headline: '특화 트랙에 집중하고, 필요한 만큼 소재를 보강',
        summary:
          '현직자 특강과 심화 피드백이 포함된 트랙을 중심으로 진행하세요. 소재가 부족하면 경험정리를 짧게 추가해 흐름을 잡아두면 좋습니다.',
        recommendations,
      });
    }

    case 'dontKnow': {
      // 막 시작한 경우
      if (step1 === 'just-started') {
        if (step2 === 'dont-know-what') {
          return buildResult({
            personaId,
            headline: '경험정리부터 시작해서 흐름을 잡으세요',
            summary:
              '취준을 막 시작했다면 경험정리로 소재를 확보한 후 이력서로 이어가는 것이 가장 안전합니다.',
            recommendations: [
              {
                programId: 'experience',
                emphasis: 'primary',
                reason: '경험 소재 확보와 구조화',
                suggestedPlanId: pickPlan('experience', 'basic'),
              },
              {
                programId: 'resume',
                emphasis: 'secondary',
                reason: '경험을 바탕으로 이력서 완성',
                suggestedPlanId: pickPlan('resume', 'basic'),
              },
            ],
          });
        }
        
        if (step2 === 'lack-time') {
          return buildResult({
            personaId,
            headline: '시간이 부족하다면 이력서 1주 완성부터',
            summary:
              '빠르게 서류를 준비해야 한다면 이력서 1주 완성으로 시작하고, 여유가 생기면 자소서를 보완하세요.',
            recommendations: [
              {
                programId: 'resume',
                emphasis: 'primary',
                reason: '1주 안에 빠른 이력서 완성',
                suggestedPlanId: pickPlan('resume', 'basic'),
              },
              {
                programId: 'coverLetter',
                emphasis: 'secondary',
                reason: '이력서 완성 후 자소서로 확장',
                suggestedPlanId: pickPlan('coverLetter', 'basic'),
              },
            ],
          });
        }

        return buildResult({
          personaId,
          headline: '경험정리 후 피드백과 함께 서류 완성',
          summary:
            '품질이 걱정된다면 피드백이 포함된 플랜으로 경험정리와 이력서를 차근차근 준비하세요.',
          recommendations: [
            {
              programId: 'experience',
              emphasis: 'primary',
              reason: '경험 소재 확보',
              suggestedPlanId: pickPlan('experience', 'basic'),
            },
            {
              programId: 'resume',
              emphasis: 'secondary',
              reason: '피드백 받으며 이력서 완성',
              suggestedPlanId: pickPlan('resume', 'feedback'),
            },
          ],
        });
      }

      // 서류 작성 중인 경우
      if (step1 === 'working-on-docs') {
        if (step2 === 'lack-time') {
          return buildResult({
            personaId,
            headline: '시간이 부족하다면 이력서 집중 완성',
            summary:
              '서류를 작성 중이지만 시간이 부족하다면 이력서를 먼저 마무리하고, 자소서는 후순위로 미루세요.',
            recommendations: [
              {
                programId: 'resume',
                emphasis: 'primary',
                reason: '1주 안에 이력서 완성',
                suggestedPlanId: pickPlan('resume', 'basic'),
              },
              {
                programId: 'coverLetter',
                emphasis: 'secondary',
                reason: '여유가 생기면 자소서 보완',
                suggestedPlanId: pickPlan('coverLetter', 'basic'),
              },
            ],
          });
        }

        if (step2 === 'quality-concern') {
          return buildResult({
            personaId,
            headline: '품질이 걱정되면 피드백 플랜을 선택하세요',
            summary:
              '작성한 내용이 걱정된다면 자소서 챌린지로 직무 분석과 스토리를 보강하고 피드백을 받으세요.',
            recommendations: [
              {
                programId: 'coverLetter',
                emphasis: 'primary',
                reason: '직무 분석과 스토리 강화',
                suggestedPlanId: pickPlan('coverLetter', 'feedback'),
              },
              {
                programId: 'portfolio',
                emphasis: 'secondary',
                reason: '직무 사례가 필요하면 포트폴리오 추가',
                suggestedPlanId: pickPlan('portfolio', 'basic'),
              },
            ],
          });
        }

        return buildResult({
          personaId,
          headline: '자소서 챌린지로 서류를 고도화하세요',
          summary:
            '서류를 작성 중이라면 자소서 챌린지로 직무 역량과 지원동기를 탄탄하게 만드세요.',
          recommendations: [
            {
              programId: 'coverLetter',
              emphasis: 'primary',
              reason: '직무 분석과 자소서 완성',
              suggestedPlanId: pickPlan('coverLetter', 'basic'),
            },
            {
              programId: 'resume',
              emphasis: 'secondary',
              reason: '이력서 구조화 보완',
              suggestedPlanId: pickPlan('resume', 'basic'),
            },
          ],
        });
      }

      // 거의 완성한 경우
      if (step1 === 'almost-ready') {
        if (step2 === 'quality-concern') {
          return buildResult({
            personaId,
            headline: '마지막 점검은 피드백 리포트로',
            summary:
              '서류가 거의 완성되었다면 빠른 피드백으로 최종 점검을 받으세요. 포트폴리오가 필요하면 추가 준비하세요.',
            recommendations: [
              {
                programId: 'coverLetter',
                emphasis: 'primary',
                reason: '자소서 최종 점검과 보완',
                suggestedPlanId: pickPlan('coverLetter', 'standard'),
              },
              {
                programId: 'portfolio',
                emphasis: 'secondary',
                reason: '직무 자료가 필요하면 포트폴리오 준비',
                suggestedPlanId: pickPlan('portfolio', 'basic'),
              },
            ],
          });
        }

        return buildResult({
          personaId,
          headline: '포트폴리오나 특화 트랙으로 차별화하세요',
          summary:
            '서류가 거의 완성되었다면 포트폴리오로 직무 사례를 보강하거나, 대기업·마케팅·HR 특화 트랙을 고려해보세요.',
          recommendations: [
            {
              programId: 'portfolio',
              emphasis: 'primary',
              reason: '직무 사례와 포트폴리오 준비',
              suggestedPlanId: pickPlan('portfolio', 'basic'),
            },
            {
              programId: 'enterpriseCover',
              emphasis: 'secondary',
              reason: '대기업 지원 시 특화 트랙',
              suggestedPlanId: pickPlan('enterpriseCover', 'basic'),
            },
          ],
        });
      }

      // 기본 케이스
      return buildResult({
        personaId,
        headline: '경험정리부터 시작해서 단계별로 진행하세요',
        summary:
          '상황이 명확하지 않다면 경험정리로 소재를 확보한 후 이력서와 자소서를 순서대로 준비하세요.',
        recommendations: [
          {
            programId: 'experience',
            emphasis: 'primary',
            reason: '경험 소재 확보',
            suggestedPlanId: pickPlan('experience', 'basic'),
          },
          {
            programId: 'coverLetter',
            emphasis: 'secondary',
            reason: '직무 역량 자소서 작성',
            suggestedPlanId: pickPlan('coverLetter', 'basic'),
          },
        ],
      });
    }

    default:
      return buildResult({
        personaId: 'starter',
        headline: '경험부터 정리하고 이력서로 확장',
        summary:
          '기본 서류를 준비하지 않았다면 경험정리 → 이력서 순으로 진행하는 것이 가장 안전합니다.',
        recommendations: [
          {
            programId: 'experience',
            emphasis: 'primary',
            reason: '소재 확보',
            suggestedPlanId: pickPlan('experience', 'basic'),
          },
          {
            programId: 'resume',
            emphasis: 'secondary',
            reason: '채용 관점 구조화',
            suggestedPlanId: pickPlan('resume', 'basic'),
          },
        ],
      });
  }
};
