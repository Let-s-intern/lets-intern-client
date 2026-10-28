import type { OneTimeFormOptionGroup } from '@/api/one-time-form/oneTimeFormSchema';
import { useCallback, useMemo, useState } from 'react';
import {
  calculateTotalPrice,
  findMissingRequiredGroupIds,
  orderSelectedOptionIds,
  selectOption,
} from '../utils/optionSelection';

interface UseOptionSelectionParams {
  basePrice: number;
  optionGroups: OneTimeFormOptionGroup[];
  /** 결제 단계에서 돌아왔을 때 보관해 둔 선택. 처음 렌더에서만 쓴다 */
  initialSelectedOptionIds?: number[];
}

/**
 * 옵션 선택 상태. 처음에는 아무것도 고르지 않은 상태다(보관한 선택이 있으면 그것).
 * selectedOptionIds 는 계약 6.2 순서(그룹 순서, 그룹 안 옵션 순서)로 정렬돼 있어 U3 요청에 그대로 쓴다.
 */
const useOptionSelection = ({
  basePrice,
  optionGroups,
  initialSelectedOptionIds,
}: UseOptionSelectionParams) => {
  const [pickedIds, setPickedIds] = useState<number[]>(
    () => initialSelectedOptionIds ?? [],
  );

  const selectedOptionIds = useMemo(
    () => orderSelectedOptionIds(optionGroups, pickedIds),
    [optionGroups, pickedIds],
  );
  const totalPrice = useMemo(
    () => calculateTotalPrice(basePrice, optionGroups, selectedOptionIds),
    [basePrice, optionGroups, selectedOptionIds],
  );
  const missingRequiredGroupIds = useMemo(
    () => findMissingRequiredGroupIds(optionGroups, selectedOptionIds),
    [optionGroups, selectedOptionIds],
  );

  const toggleOption = useCallback(
    (group: OneTimeFormOptionGroup, optionId: number) =>
      setPickedIds((prev) => selectOption(prev, group, optionId)),
    [],
  );

  return {
    selectedOptionIds,
    totalPrice,
    missingRequiredGroupIds,
    toggleOption,
  };
};

export default useOptionSelection;
