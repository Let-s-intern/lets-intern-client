import { useEffect, useRef, useState } from 'react';

export type ConditionType =
  | 'APPLICATION_ALL'
  | 'CHALLENGE_ALL'
  | 'CHALLENGE_TYPE'
  | 'CHALLENGE_PROGRAM'
  | 'LIVE_ALL'
  | 'LIVE_PROGRAM';

export interface TargetCondition {
  conditionType: ConditionType;
  challengeType: string | null;
  targetProgramId: number | null;
}

export interface ChallengeTypeOption {
  challengeType: string;
  code: number;
  desc: string;
  challengeList: { id: number; title: string }[];
}

export interface ChipItem {
  label: string;
  condition: TargetCondition;
}

export interface TargetOptions {
  challengeTypeList: ChallengeTypeOption[];
  liveList: { id: number; title: string }[];
}

// ── pure helpers (모듈 수준 — 렌더마다 재생성 없음) ──────────────────────────

const mk = (
  type: ConditionType,
  challengeType?: string,
  targetProgramId?: number,
): TargetCondition => ({
  conditionType: type,
  challengeType: challengeType ?? null,
  targetProgramId: targetProgramId ?? null,
});

const has = (
  list: TargetCondition[],
  type: ConditionType,
  key?: string,
  pid?: number,
) =>
  list.some(
    (c) =>
      c.conditionType === type &&
      (key == null || c.challengeType === key) &&
      (pid == null || c.targetProgramId === pid),
  );

const except = (list: TargetCondition[], ...types: ConditionType[]) =>
  list.filter((c) => !types.includes(c.conditionType));

// 훅
export function useCouponTargetState(
  value: TargetCondition[],
  onChange: (conditions: TargetCondition[]) => void,
  options: TargetOptions,
) {
  const [conds, setConds] = useState(value);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  // 수정 모드: 쿼리 완료 후 외부에서 value가 바뀌면 내부 상태 동기화
  const prevValue = useRef(value);
  useEffect(() => {
    if (value !== prevValue.current) {
      prevValue.current = value;
      setConds(value);
    }
  }, [value]);

  // onChange는 렌더 후 한 번만 — 불필요한 부모 리렌더 방지
  const prevConds = useRef(conds);
  useEffect(() => {
    if (conds !== prevConds.current) {
      prevConds.current = conds;
      onChangeRef.current(conds);
    }
  }, [conds]);

  const { challengeTypeList, liveList } = options;

  function chipLabel(c: TargetCondition): string {
    if (c.conditionType === 'APPLICATION_ALL') return '전체 결제자';
    if (c.conditionType === 'CHALLENGE_ALL') return '챌린지 전체';
    if (c.conditionType === 'LIVE_ALL') return 'LIVE 클래스 전체';
    if (c.conditionType === 'CHALLENGE_TYPE')
      return `${challengeTypeList.find((t) => t.challengeType === c.challengeType)?.desc} 전체`;
    if (c.conditionType === 'CHALLENGE_PROGRAM')
      return (
        challengeTypeList
          .flatMap((t) => t.challengeList)
          .find((p) => p.id === c.targetProgramId)?.title ?? ''
      );
    return liveList.find((p) => p.id === c.targetProgramId)?.title ?? '';
  }

  const $ = (type: ConditionType, key?: string, pid?: number) =>
    has(conds, type, key, pid);

  const allPayers = $('APPLICATION_ALL');
  const challengeAll = $('CHALLENGE_ALL');
  const liveAll = $('LIVE_ALL');

  return {
    allPayers,
    toggleAllPayers: () =>
      setConds(
        allPayers ? except(conds, 'APPLICATION_ALL') : [mk('APPLICATION_ALL')],
      ),

    challenge: {
      mode: (challengeAll
        ? 'all'
        : conds.some((c) => c.conditionType.startsWith('CHALLENGE'))
          ? 'partial'
          : 'none') as 'all' | 'partial' | 'none',
      count: conds.filter((c) => c.conditionType.startsWith('CHALLENGE'))
        .length,
      typeMode: Object.fromEntries(
        challengeTypeList.map((t) => [
          t.challengeType,
          challengeAll || $('CHALLENGE_TYPE', t.challengeType)
            ? 'all'
            : t.challengeList.some((p) =>
                  $('CHALLENGE_PROGRAM', undefined, p.id),
                )
              ? 'partial'
              : 'none',
        ]),
      ) as Record<string, 'all' | 'partial' | 'none'>,
      checkedPrograms: new Set(
        challengeTypeList.flatMap((t) =>
          t.challengeList
            .filter(
              (p) =>
                challengeAll ||
                $('CHALLENGE_TYPE', t.challengeType) ||
                $('CHALLENGE_PROGRAM', undefined, p.id),
            )
            .map((p) => p.id),
        ),
      ),
      toggleAll: () =>
        setConds(
          challengeAll
            ? except(conds, 'CHALLENGE_ALL')
            : [
                ...except(
                  conds,
                  'CHALLENGE_ALL',
                  'CHALLENGE_TYPE',
                  'CHALLENGE_PROGRAM',
                ),
                mk('CHALLENGE_ALL'),
              ],
        ),
      toggleType: (type: string) => {
        if ($('CHALLENGE_TYPE', type)) {
          setConds(
            conds.filter(
              (c) =>
                !(
                  c.conditionType === 'CHALLENGE_TYPE' &&
                  c.challengeType === type
                ),
            ),
          );
        } else {
          const pids =
            challengeTypeList
              .find((t) => t.challengeType === type)
              ?.challengeList.map((p) => p.id) ?? [];
          setConds([
            ...conds.filter(
              (c) =>
                !(
                  c.conditionType === 'CHALLENGE_PROGRAM' &&
                  pids.includes(c.targetProgramId!)
                ),
            ),
            mk('CHALLENGE_TYPE', type),
          ]);
        }
      },
      toggleProgram: (type: string, pid: number) => {
        if (challengeAll || $('CHALLENGE_TYPE', type)) return;
        setConds(
          $('CHALLENGE_PROGRAM', undefined, pid)
            ? conds.filter(
                (c) =>
                  !(
                    c.conditionType === 'CHALLENGE_PROGRAM' &&
                    c.targetProgramId === pid
                  ),
              )
            : [...conds, mk('CHALLENGE_PROGRAM', undefined, pid)],
        );
      },
    },

    live: {
      mode: (liveAll
        ? 'all'
        : conds.some((c) => c.conditionType.startsWith('LIVE'))
          ? 'partial'
          : 'none') as 'all' | 'partial' | 'none',
      count: conds.filter((c) => c.conditionType.startsWith('LIVE')).length,
      checkedPrograms: new Set(
        liveList
          .filter((p) => liveAll || $('LIVE_PROGRAM', undefined, p.id))
          .map((p) => p.id),
      ),
      toggleAll: () =>
        setConds(
          liveAll
            ? except(conds, 'LIVE_ALL')
            : [...except(conds, 'LIVE_ALL', 'LIVE_PROGRAM'), mk('LIVE_ALL')],
        ),
      toggleProgram: (pid: number) => {
        if (liveAll) return;
        setConds(
          $('LIVE_PROGRAM', undefined, pid)
            ? conds.filter(
                (c) =>
                  !(
                    c.conditionType === 'LIVE_PROGRAM' &&
                    c.targetProgramId === pid
                  ),
              )
            : [...conds, mk('LIVE_PROGRAM', undefined, pid)],
        );
      },
    },

    chips: conds.map((c) => ({ label: chipLabel(c), condition: c })),
    removeChip: (chip: ChipItem) =>
      setConds(conds.filter((c) => c !== chip.condition)),
    resetAll: () => setConds([]),
  };
}
