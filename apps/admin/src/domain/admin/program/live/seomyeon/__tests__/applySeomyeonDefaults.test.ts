import { describe, expect, it } from 'vitest';

import type { CreateLiveReq, UpdateLiveReq } from '@/schema';

import {
  SEOMYEON_REQUIRED_CLASSIFICATION,
  applySeomyeonDefaults,
} from '../applySeomyeonDefaults';

describe('applySeomyeonDefaults', () => {
  it('programTypeInfo가 비어 있으면 DOCUMENT_PREPARATION을 자동 추가한다', () => {
    const input = {
      programTypeInfo: [],
    } as unknown as Omit<CreateLiveReq, 'desc'>;

    const result = applySeomyeonDefaults(input);

    expect(result.programTypeInfo).toHaveLength(1);
    expect(result.programTypeInfo[0]?.classificationInfo.programClassification).toBe(
      SEOMYEON_REQUIRED_CLASSIFICATION,
    );
  });

  it('이미 DOCUMENT_PREPARATION이 포함되어 있으면 변경하지 않는다 (중복 방지)', () => {
    const input = {
      programTypeInfo: [
        {
          classificationInfo: {
            programClassification: SEOMYEON_REQUIRED_CLASSIFICATION,
          },
        },
      ],
    } as unknown as Omit<CreateLiveReq, 'desc'>;

    const result = applySeomyeonDefaults(input);

    expect(result).toBe(input); // 동일 참조 반환
    expect(result.programTypeInfo).toHaveLength(1);
  });

  it('다른 분류가 있으면 DOCUMENT_PREPARATION만 추가한다 (기존 보존)', () => {
    const input = {
      programTypeInfo: [
        {
          classificationInfo: { programClassification: 'CAREER_SEARCH' as const },
        },
      ],
    } as unknown as Omit<CreateLiveReq, 'desc'>;

    const result = applySeomyeonDefaults(input);

    expect(result.programTypeInfo).toHaveLength(2);
    expect(
      result.programTypeInfo.map(
        (e) => e.classificationInfo.programClassification,
      ),
    ).toEqual(
      expect.arrayContaining(['CAREER_SEARCH', SEOMYEON_REQUIRED_CLASSIFICATION]),
    );
  });

  it('UpdateLiveReq에서 programTypeInfo가 undefined여도 안전하게 추가한다', () => {
    const input: Omit<UpdateLiveReq, 'desc'> = {};

    const result = applySeomyeonDefaults(input);

    expect(result.programTypeInfo).toHaveLength(1);
    expect(result.programTypeInfo?.[0]?.classificationInfo.programClassification).toBe(
      SEOMYEON_REQUIRED_CLASSIFICATION,
    );
  });

  it('원본 input을 변경하지 않는다 (immutable)', () => {
    const original = {
      programTypeInfo: [],
    } as unknown as Omit<CreateLiveReq, 'desc'>;

    applySeomyeonDefaults(original);

    expect(original.programTypeInfo).toEqual([]);
  });
});
