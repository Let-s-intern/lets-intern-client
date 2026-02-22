import { describe, expect, it } from 'vitest';
import { PROGRAMS } from '../data/constants';
import { computeCurationResult } from './curationEngine';

describe('computeCurationResult', () => {
  it('recommends 경험정리 우선 when starter needs experience', () => {
    const result = computeCurationResult({
      personaId: 'starter',
      step1: 'needs-experience',
      step2: 'time-tight',
    });

    const primary = result.recommendations[0];
    expect(primary.programId).toBe('experience');
    expect(primary.suggestedPlanId).toBe('basic');
    expect(result.recommendations.map((r) => r.programId)).toContain('resume');
  });

  it('routes enterprise cover persona to 대기업 자소서 with intensive plan', () => {
    const result = computeCurationResult({
      personaId: 'coverLetter',
      step1: 'enterprise-cover',
      step2: 'needs-intensive',
    });

    const primary = result.recommendations[0];
    expect(primary.programId).toBe('enterpriseCover');
    const program = PROGRAMS[primary.programId];
    expect(program.plans.map((p) => p.id)).toContain(primary.suggestedPlanId);
  });

  it('maps marketing 포트폴리오 니즈 to 마케팅 올인원', () => {
    const result = computeCurationResult({
      personaId: 'portfolio',
      step1: 'marketing-track',
      step2: 'need-feedback',
    });

    expect(result.recommendations[0].programId).toBe('marketingAllInOne');
    expect(result.recommendations[0].suggestedPlanId).toBe('standard');
  });
});
