import { useState } from 'react';

interface ConfirmTextModalProps {
  title: string;
  description?: string;
  expectedText: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * 위험한 작업(URL 변경·삭제 등) 전 사용자에게 정확한 확인 문구를
 * 직접 타이핑하게 해서 실수로 인한 변경을 막는 모달.
 *
 * GitHub의 repo 삭제 패턴과 동일.
 */
const ConfirmTextModal = ({
  title,
  description,
  expectedText,
  confirmLabel = '확인',
  onConfirm,
  onCancel,
}: ConfirmTextModalProps) => {
  const [input, setInput] = useState('');
  const isValid = input.trim() === expectedText;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-[420px] rounded-md bg-white p-6 shadow-lg">
        <h2 className="mb-2 text-lg font-semibold">{title}</h2>
        {description && (
          <p className="mb-3 whitespace-pre-line text-sm text-neutral-600">
            {description}
          </p>
        )}
        <p className="mb-2 text-sm text-neutral-700">
          진행하려면 아래에{' '}
          <b className="font-semibold text-red-600">{expectedText}</b> 를(을)
          정확히 입력하세요.
        </p>
        <input
          autoFocus
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && isValid) onConfirm();
            if (e.key === 'Escape') onCancel();
          }}
          className="mb-4 w-full rounded-md border border-neutral-400 p-2 focus:border-neutral-600 focus:outline-none"
          placeholder={expectedText}
        />
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md bg-neutral-500 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-neutral-600"
          >
            취소
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={!isValid}
            className="rounded-md bg-red-600 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-neutral-300"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmTextModal;
