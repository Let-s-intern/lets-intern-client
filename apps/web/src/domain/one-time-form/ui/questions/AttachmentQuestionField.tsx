import type { OneTimeFormAttachmentAnswer } from '@/api/one-time-form/oneTimeFormSchema';
import { twMerge } from '@/lib/twMerge';

export interface AttachmentQuestionFieldProps {
  id: string;
  kind: 'IMAGE' | 'FILE';
  value: OneTimeFormAttachmentAnswer | undefined;
  hasError: boolean;
  onChange: (value: OneTimeFormAttachmentAnswer | undefined) => void;
  onBlur: () => void;
}

/**
 * 이미지·파일 질문 자리. 7.5 가 업로드(URL 발급, 진행 막대, 칩·삭제, 썸네일, 사전 검사)로 속을 바꾼다.
 * 지금은 붙은 파일 이름이나 빈 상태만 보여 준다. props 는 7.5 에서도 유지한다.
 */
const AttachmentQuestionField = ({
  id,
  kind,
  value,
  hasError,
  onBlur,
}: AttachmentQuestionFieldProps) => (
  <div
    id={id}
    tabIndex={-1}
    aria-invalid={hasError}
    onBlur={onBlur}
    className={twMerge(
      'border-neutral-70 text-xsmall14 text-neutral-40 rounded-sm border border-dashed px-3.5 py-4 text-center outline-none',
      hasError && 'border-requirement',
    )}
  >
    {value ? (
      <span className="text-neutral-0 font-semibold">{value.name}</span>
    ) : (
      `${kind === 'IMAGE' ? '이미지를' : '파일을'} 첨부해 주세요`
    )}
  </div>
);

export default AttachmentQuestionField;
