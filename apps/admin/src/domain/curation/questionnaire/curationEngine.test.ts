import { describe, expect, it } from 'vitest';
import { PROGRAMS } from '../shared/programs';
import { computeCurationResult } from './curationEngine';
import {
  STARTER_S1,
  STARTER_S2,
  COVER_S1,
  COVER_S2,
  PORTFOLIO_S1,
  PORTFOLIO_S2,
} from './data/optionIds';

describe('computeCurationResult', () => {
  it('recommends 경험정리 우선 when starter has experience', () => {
    const result = computeCurationResult({
      personaId: 'starter',
      step1: STARTER_S1.HAS_EXPERIENCE,
      step2: STARTER_S2.SELF_GUIDE,
    });

    const primary = result.recommendations[0];
    expect(primary.programId).toBe('experience');
    expect(primary.suggestedPlanId).toBe('basic');
    expect(result.recommendations.map((r) => r.programId)).toContain('resume');
  });

  it('routes enterprise cover persona to 대기업 자소서 with intensive plan', () => {
    const result = computeCurationResult({
      personaId: 'coverLetter',
      step1: COVER_S1.ENTERPRISE_COVER,
      step2: COVER_S2.ENTERPRISE_INTENSIVE,
    });

    const primary = result.recommendations[0];
    expect(primary.programId).toBe('enterpriseCover');
    expect(primary.suggestedPlanId).toBe('premium');
    const program = PROGRAMS[primary.programId];
    expect(program.plans.map((p) => p.id)).toContain(primary.suggestedPlanId);
  });

  it('maps marketing 포트폴리오 니즈 to 마케팅 올인원', () => {
    const result = computeCurationResult({
      personaId: 'portfolio',
      step1: PORTFOLIO_S1.MARKETING_TRACK,
      step2: PORTFOLIO_S2.MKT_MENTOR,
    });

    expect(result.recommendations[0].programId).toBe('marketingAllInOne');
    expect(result.recommendations[0].suggestedPlanId).toBe('standard');
  });
});
