import { useEffect, useState } from 'react';

import ModalPortal from '@/common/ModalPortal';

interface PreOpenCheckModalProps {
  isOpen: boolean;
  /** 공개 상세 페이지 주소. 승인 여부와 무관하게 열리므로 오픈 전에도 확인할 수 있다. */
  publicUrl: string;
  /** 진행 버튼 라벨. 검토 제출과 재개설이 같은 확인 절차를 쓴다. */
  confirmLabel: string;
  /** 확인을 마쳤을 때 실제로 일어나는 일 — 검토 제출인지 즉시 오픈인지 알린다. */
  resultDescription: string;
  isPending: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * 오픈 전 상세 페이지 확인 모달.
 *
 * 상세 페이지는 승인·개설과 무관하게 URL 로 열린다(서버 공개 상세 조회는 상품 상태를
 * 검사하지 않는다). 그래서 오픈을 실행하기 **전에** 실제 화면을 확인시킬 수 있다.
 *
 * 확인 체크 없이는 진행 버튼을 열지 않는다. 오픈은 되돌리는 비용이 큰 행동이고,
 * 잘못 나간 상세 페이지는 멘티에게 그대로 보이기 때문이다. 체크박스는 형식적인 동의가
 * 아니라 "직접 열어봤다"는 확인이라 링크를 먼저 두고 그 아래에 놓는다.
 */
const PreOpenCheckModal = ({
  isOpen,
  publicUrl,
  confirmLabel,
  resultDescription,
  isPending,
  onConfirm,
  onCancel,
}: PreOpenCheckModalProps) => {
  const [checked, setChecked] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setChecked(false);
    setCopied(false);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
    } catch {
      // 클립보드 권한이 없어도 주소는 화면에 떠 있으니 막히지 않는다.
      setCopied(false);
    }
  };

  return (
    <ModalPortal>
      <div className="fixed inset-0 z-[60] flex items-center justify-center">
        <div className="absolute inset-0 bg-black/40" aria-hidden />

        <div
          role="dialog"
          aria-modal="true"
          aria-label="오픈 전 상세 페이지 확인"
          className="relative mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
        >
          <h3 className="text-base font-semibold text-neutral-900">
            오픈 전에 상세 페이지를 확인해주세요
          </h3>
          <p className="mt-1 text-sm text-neutral-500">
            멘티에게 보이는 화면 그대로입니다. 이미지·문구·영상이 의도대로
            나오는지 직접 열어 확인해주세요.
          </p>

          <div className="mt-4 flex flex-col gap-2">
            <div className="flex items-center gap-2 rounded-lg bg-neutral-100 px-3 py-2">
              <span className="min-w-0 flex-1 truncate text-xs text-neutral-600">
                {publicUrl}
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="shrink-0 rounded border border-neutral-300 bg-white px-2 py-1 text-xs text-neutral-600"
              >
                {copied ? '복사됨' : '복사'}
              </button>
            </div>
            <a
              href={publicUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="border-primary text-primary hover:bg-primary rounded-lg border py-2.5 text-center text-sm font-medium transition-colors hover:text-white"
            >
              상세 페이지 열어보기
            </a>
          </div>

          <label className="mt-4 flex cursor-pointer items-start gap-2">
            <input
              type="checkbox"
              checked={checked}
              onChange={(e) => setChecked(e.target.checked)}
              className="accent-primary mt-0.5 h-4 w-4"
            />
            <span className="text-sm text-neutral-700">
              상세 페이지를 직접 확인했고, 이대로 공개해도 괜찮습니다.
            </span>
          </label>

          <p className="mt-3 rounded-lg bg-neutral-50 px-3 py-2 text-xs text-neutral-500">
            {resultDescription}
          </p>

          <div className="mt-5 flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={isPending}
              className="flex-1 rounded-xl border border-neutral-200 py-2.5 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-50 disabled:opacity-50"
            >
              취소
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={!checked || isPending}
              className="bg-primary hover:bg-primary-hover flex-1 rounded-xl py-2.5 text-sm font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isPending ? '처리 중...' : confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
};

export default PreOpenCheckModal;
