import { OPTION_LIMITS } from '../constants/optionLimits';
import type {
  OptionDraft,
  OptionDraftErrors,
  OptionGroupDraft,
  OptionGroupListErrors,
} from '../types/optionGroupDraft';
import { isValidPrice } from './optionGroupListReducer';

/** 계약 5.6 길이 제한과 A7 `BAD_REQUEST` 조건(필수 누락, 음수 금액)을 저장 전에 본다 */

const tooLong = (value: string, max: number) => value.trim().length > max;
const lengthMessage = (max: number) => `${max}자 이하로 입력해 주세요.`;

const validateGroup = (group: OptionGroupDraft): OptionDraftErrors => {
  const errors: OptionDraftErrors = {};
  if (!group.title.trim()) errors.title = '그룹 제목을 입력해 주세요.';
  else if (tooLong(group.title, OPTION_LIMITS.groupTitle)) {
    errors.title = lengthMessage(OPTION_LIMITS.groupTitle);
  }
  if (tooLong(group.description, OPTION_LIMITS.groupDescription)) {
    errors.description = lengthMessage(OPTION_LIMITS.groupDescription);
  }
  return errors;
};

const validateOption = (option: OptionDraft): OptionDraftErrors => {
  const errors: OptionDraftErrors = {};
  if (!option.name.trim()) errors.name = '옵션 이름을 입력해 주세요.';
  else if (tooLong(option.name, OPTION_LIMITS.name)) {
    errors.name = lengthMessage(OPTION_LIMITS.name);
  }
  if (tooLong(option.description, OPTION_LIMITS.description)) {
    errors.description = lengthMessage(OPTION_LIMITS.description);
  }
  if (tooLong(option.badge, OPTION_LIMITS.badge)) {
    errors.badge = lengthMessage(OPTION_LIMITS.badge);
  }
  if (!isValidPrice(option.additionalPrice)) {
    errors.additionalPrice = '0원 이상 정수로 입력해 주세요.';
  }
  return errors;
};

/** 오류가 있는 그룹·옵션만 키로 담는다 */
export const validateOptionGroups = (
  groups: OptionGroupDraft[],
): OptionGroupListErrors => {
  const result: OptionGroupListErrors = {};
  const collect = (key: string, errors: OptionDraftErrors) => {
    if (Object.keys(errors).length > 0) result[key] = errors;
  };
  for (const group of groups) {
    collect(group.key, validateGroup(group));
    for (const option of group.options) {
      collect(option.key, validateOption(option));
    }
  }
  return result;
};
