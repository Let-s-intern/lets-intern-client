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
}

/**
 * 옵션 선택 상태. 처음에는 아무것도 고르지 않은 상태다.
 * selectedOptionIds 는 계약 6.2 순서(그룹 순서, 그룹 안 옵션 순서)로 정렬돼 있어 U3 요청에 그대로 쓴다.
 */
const useOptionSelection = ({
  basePrice,
  optionGroups,
}: UseOptionSelectionParams) => {
  const [pickedIds, setPickedIds] = useState<number[]>([]);

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
