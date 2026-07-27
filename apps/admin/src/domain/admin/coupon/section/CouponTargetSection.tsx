import { Checkbox, Chip, FormControlLabel, Typography } from '@mui/material';

import { useCouponTargetOptions } from '../hooks/useCouponTargetOptions';
import { useCouponTargetState } from '../hooks/useCouponTargetState';
import ExpandableRow from '../ui/ExpandableRow';

export type {
  ConditionType,
  TargetCondition,
} from '../hooks/useCouponTargetState';

function ProgramCheckboxList({
  items,
  checkedIds,
  disabled = false,
  onToggle,
}: {
  items: { id: number; title: string }[];
  checkedIds: Set<number>;
  disabled?: boolean;
  onToggle: (id: number) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-y-1">
      {items.map((p) => (
        <FormControlLabel
          key={p.id}
          control={
            <Checkbox
              checked={checkedIds.has(p.id)}
              disabled={disabled}
              onChange={() => onToggle(p.id)}
              size="small"
            />
          }
          label={p.title}
        />
      ))}
    </div>
  );
}

interface Props {
  value: import('../hooks/useCouponTargetState').TargetCondition[];
  onChange: (
    conditions: import('../hooks/useCouponTargetState').TargetCondition[],
  ) => void;
}

const CouponTargetSection = ({ value, onChange }: Props) => {
  const { data: options } = useCouponTargetOptions();

  const {
    allPayers,
    toggleAllPayers,
    challenge,
    live,
    chips,
    removeChip,
    resetAll,
  } = useCouponTargetState(value, onChange, {
    challengeTypeList: options?.challengeTypeList ?? [],
    liveList: options?.liveList ?? [],
  });

  return (
    <div>
      {/* 전체 결제자 */}
      <div
        role="button"
        onClick={toggleAllPayers}
        className={`rounded-xxs mb-2 cursor-pointer border px-4 py-1 transition-colors hover:bg-gray-50 ${allPayers ? 'border-blue-200 bg-blue-50' : 'border-gray-200'}`}
      >
        <FormControlLabel
          onClick={(e) => e.stopPropagation()}
          control={
            <Checkbox
              checked={allPayers}
              onChange={toggleAllPayers}
              size="small"
            />
          }
          label={
            <span className="flex items-center gap-2">
              <span className="font-medium">전체</span>
              <Typography variant="caption" color="text.secondary">
                전체 결제자 (결제 이력이 있는 모든 유저)
              </Typography>
            </span>
          }
        />
      </div>

      <div
        className={`space-y-2 ${allPayers ? 'pointer-events-none opacity-45' : ''}`}
      >
        {/* 챌린지 */}
        <div
          className={`rounded-xxs overflow-hidden border transition-colors ${challenge.mode !== 'none' ? 'border-blue-200' : 'border-gray-200'}`}
        >
          <ExpandableRow
            mode={challenge.mode}
            label="챌린지"
            count={challenge.count}
            onToggleCheck={challenge.toggleAll}
          >
            <div className="border-t border-gray-100 bg-white">
              <div className="space-y-2 p-3">
                {(options?.challengeTypeList ?? []).map((t) => {
                  const typeMode = challenge.typeMode[t.challengeType];

                  return (
                    <div
                      key={t.challengeType}
                      className={`rounded-xxs overflow-hidden border transition-colors ${typeMode !== 'none' ? 'border-blue-200' : 'border-gray-200'}`}
                    >
                      <ExpandableRow
                        mode={typeMode}
                        disabled={challenge.mode === 'all'}
                        label={t.desc}
                        code={t.code}
                        count={
                          t.challengeList.filter((p) =>
                            challenge.checkedPrograms.has(p.id),
                          ).length
                        }
                        onToggleCheck={() =>
                          challenge.toggleType(t.challengeType)
                        }
                      >
                        <div className="border-t border-gray-50 px-3 py-2 pl-6">
                          <ProgramCheckboxList
                            items={t.challengeList}
                            checkedIds={challenge.checkedPrograms}
                            disabled={typeMode === 'all'}
                            onToggle={(pid) =>
                              challenge.toggleProgram(t.challengeType, pid)
                            }
                          />
                        </div>
                      </ExpandableRow>
                    </div>
                  );
                })}
              </div>
            </div>
          </ExpandableRow>
        </div>

        {/* LIVE 클래스 */}
        <div
          className={`rounded-xxs overflow-hidden border transition-colors ${live.mode !== 'none' ? 'border-blue-200' : 'border-gray-200'}`}
        >
          <ExpandableRow
            mode={live.mode}
            label="LIVE 클래스"
            count={live.count}
            onToggleCheck={live.toggleAll}
          >
            <div className="border-t border-gray-100 bg-white px-4 py-3">
              <ProgramCheckboxList
                items={options?.liveList ?? []}
                checkedIds={live.checkedPrograms}
                disabled={live.mode === 'all'}
                onToggle={live.toggleProgram}
              />
            </div>
          </ExpandableRow>
        </div>
      </div>

      {/* 선택 요약 칩 */}
      <div className="mt-4 rounded-lg bg-gray-50 p-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-semibold text-gray-500">
            선택된 대상 <span className="text-blue-600">{chips.length}</span>
          </span>
          {!allPayers && chips.length > 0 && (
            <button
              type="button"
              onClick={resetAll}
              className="text-xs text-gray-400 hover:text-gray-600"
            >
              전체 해제
            </button>
          )}
        </div>
        {chips.length === 0 ? (
          <p className="text-xs text-gray-400">
            미설정 시 회원 전체 발급(등록형 쿠폰)으로 저장됩니다.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {chips.map((chip, i) => (
              <Chip
                key={i}
                label={chip.label}
                size="small"
                variant="outlined"
                onDelete={() => removeChip(chip)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CouponTargetSection;
