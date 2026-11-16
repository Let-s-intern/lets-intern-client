'use client';

import { QuestionItem } from '@/domain/challenge/api/challengeQuestion';

interface CancelInquiryDialogProps {
  item: QuestionItem;
  isPending?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/** 패널 안에 뜨는 문의 취소 확인. 홈·상세 어디서 눌러도 같은 화면을 쓴다 */
const CancelInquiryDialog = ({
  item,
  isPending,
  onConfirm,
  onCancel,
}: CancelInquiryDialogProps) => (
  <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 px-6">
    <div className="w-full max-w-[300px] rounded-lg bg-static-100 p-5 shadow-05">
      <p className="text-center text-xsmall16 font-bold text-neutral-0">
        문의를 취소할까요?
      </p>
      <p className="mt-2 text-center text-xsmall14 leading-relaxed text-neutral-40">
        취소하면 되돌릴 수 없어요.
      </p>

      <p className="mt-4 truncate rounded-xxs bg-neutral-95 px-3 py-2 text-center text-xsmall14 text-neutral-30">
        {item.title}
      </p>

      <div className="mt-5 flex gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-full border border-neutral-85 py-2.5 text-xsmall14 font-medium text-neutral-30"
        >
          돌아가기
        </button>
        <button
          type="button"
          disabled={isPending}
          onClick={onConfirm}
          className="flex-1 rounded-full bg-system-error py-2.5 text-xsmall14 font-medium text-static-100 disabled:opacity-50"
        >
          {isPending ? '취소 중...' : '문의 취소'}
        </button>
      </div>
    </div>
  </div>
);

export default CancelInquiryDialog;
