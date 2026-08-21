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
    <div className="bg-static-100 shadow-05 w-full max-w-[300px] rounded-lg p-5">
      <p className="text-xsmall16 text-neutral-0 text-center font-bold">
        문의를 취소할까요?
      </p>
      <p className="text-xsmall14 text-neutral-40 mt-2 text-center leading-relaxed">
        취소하면 되돌릴 수 없어요.
      </p>

      <p className="rounded-xxs bg-neutral-95 text-xsmall14 text-neutral-30 mt-4 truncate px-3 py-2 text-center">
        {item.title}
      </p>

      <div className="mt-5 flex gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="text-xsmall14 text-neutral-30 border-neutral-85 flex-1 rounded-full border py-2.5 font-medium"
        >
          돌아가기
        </button>
        <button
          type="button"
          disabled={isPending}
          onClick={onConfirm}
          className="text-xsmall14 bg-system-error text-static-100 flex-1 rounded-full py-2.5 font-medium disabled:opacity-50"
        >
          {isPending ? '취소 중...' : '문의 취소'}
        </button>
      </div>
    </div>
  </div>
);

export default CancelInquiryDialog;
