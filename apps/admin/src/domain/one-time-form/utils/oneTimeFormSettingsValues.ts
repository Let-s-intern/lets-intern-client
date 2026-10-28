import type {
  AdminOneTimeForm,
  SaveOneTimeFormRequest,
} from '@/api/one-time-form/oneTimeFormSchema';

import type { OneTimeFormSettingsValues } from '../types/oneTimeFormSettings';

/** 새 폼의 시작 값. 무료, 비공개로 만든다 */
export const DEFAULT_ONE_TIME_FORM_SETTINGS: OneTimeFormSettingsValues = {
  title: '',
  slug: '',
  categoryText: '',
  scheduleText: '',
  thumbnailUrl: null,
  isVisible: false,
  startDate: '',
  endDate: '',
  cancelDeadline: '',
  completionMessage: '',
  isPaid: false,
  basePrice: 0,
  paymentProductName: '',
};

export const toOneTimeFormSettingsValues = (
  form: AdminOneTimeForm,
): OneTimeFormSettingsValues => ({
  title: form.title,
  slug: form.slug,
  categoryText: form.categoryText ?? '',
  scheduleText: form.scheduleText ?? '',
  thumbnailUrl: form.thumbnailUrl,
  isVisible: form.isVisible,
  startDate: form.startDate,
  endDate: form.endDate,
  cancelDeadline: form.cancelDeadline ?? '',
  completionMessage: form.completionMessage ?? '',
  isPaid: form.isPaid,
  basePrice: form.basePrice,
  paymentProductName: form.paymentProductName ?? '',
});

const emptyToNull = (value: string) => (value.trim() === '' ? null : value);

export const toSaveOneTimeFormRequest = (
  values: OneTimeFormSettingsValues,
): SaveOneTimeFormRequest => ({
  title: values.title.trim(),
  slug: values.slug,
  categoryText: emptyToNull(values.categoryText),
  scheduleText: emptyToNull(values.scheduleText),
  thumbnailUrl: values.thumbnailUrl,
  isVisible: values.isVisible,
  startDate: values.startDate,
  endDate: values.endDate,
  cancelDeadline: emptyToNull(values.cancelDeadline),
  isPaid: values.isPaid,
  basePrice: values.basePrice,
  paymentProductName: emptyToNull(values.paymentProductName),
  completionMessage: emptyToNull(values.completionMessage),
});
