import type {
  CreateLiveReq,
  ProgramClassification,
  UpdateLiveReq,
} from '@/schema';

/**
 * 서면(SEOMYEON) 자동 분류 상수.
 *
 * PRD-서면라이브 분리 §5.3 — 서면 생성/수정 제출 시
 * `programTypeInfo` 에 DOCUMENT_PREPARATION 이 항상 포함되어야 한다.
 */
export const SEOMYEON_REQUIRED_CLASSIFICATION: ProgramClassification =
  'DOCUMENT_PREPARATION';

type ProgramTypeInfoEntry = {
  classificationInfo: { programClassification: ProgramClassification };
};

/**
 * 입력의 `programTypeInfo` 에 DOCUMENT_PREPARATION 분류가 포함되어 있는지 확인.
 */
function hasDocumentPreparation(
  programTypeInfo: ProgramTypeInfoEntry[] | undefined,
): boolean {
  if (!programTypeInfo) return false;
  return programTypeInfo.some(
    (entry) =>
      entry.classificationInfo.programClassification ===
      SEOMYEON_REQUIRED_CLASSIFICATION,
  );
}

/**
 * 서면 모드(SEOMYEON)일 때 폼 입력에 자동 매핑을 적용한다.
 *
 * - `programTypeInfo`: DOCUMENT_PREPARATION 이 없으면 추가 (있으면 중복 방지)
 *
 * Q2/Q4 미해결로 progressType/place/시간 필드는 현 시점 그대로 둔다 (PRD §10).
 *
 * @param input — 폼 state (Omit<.., 'desc'>)
 * @returns 자동 매핑이 적용된 새 객체. 원본은 변경하지 않는다.
 */
export function applySeomyeonDefaults<
  T extends Omit<CreateLiveReq, 'desc'> | Omit<UpdateLiveReq, 'desc'>,
>(input: T): T {
  const existing = (input as { programTypeInfo?: ProgramTypeInfoEntry[] })
    .programTypeInfo;

  if (hasDocumentPreparation(existing)) {
    return input;
  }

  const next: ProgramTypeInfoEntry[] = [
    ...(existing ?? []),
    {
      classificationInfo: {
        programClassification: SEOMYEON_REQUIRED_CLASSIFICATION,
      },
    },
  ];

  return { ...input, programTypeInfo: next };
}
