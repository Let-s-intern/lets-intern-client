import { useEffect, useState } from 'react';

import ModalPortal from '@/common/ModalPortal';

interface OpenedNoticeModalProps {
  isOpen: boolean;
  /** 공개 상세 페이지 주소. 멘토가 바로 열어 확인한다. */
  publicUrl: string;
  /** 방금 만들어진 개설. "바로 내리기"가 이 개설을 종료한다. */
  onCloseOpening: () => void;
  isClosing: boolean;
  onDismiss: () => void;
}

/** 확인을 재촉하는 시간. 이 시간이 지나도 노출은 유지된다 — 안내가 사라질 뿐이다. */
const CHECK_SECONDS = 30;

/**
 * 오픈 직후 안내 모달.
 *
 * 오픈은 **즉시** 반영된다. 공개 목록 쿼리가 개설이 생기는 순간부터 그 상품을 잡아가므로
 * 프론트가 노출을 늦출 방법은 없다. 그래서 "30초 뒤에 노출된다"고 적지 않는다 —
 * 화면이 사실과 다른 말을 하면 멘토는 그 30초를 안전한 시간으로 착각한다.
 *
 * 대신 이 모달이 하는 일은 두 가지다.
 *  1. 지금 공개됐다는 사실과 확인할 주소를 준다.
 *  2. 이상하면 여기서 곧바로 내릴 수 있게 한다 — 오픈 현황 화면까지 찾아가지 않아도 된다.
 *
 * 카운트다운은 "지금 확인하라"는 재촉이지 유예 시간이 아니다. 문구도 그렇게 적는다.
 */
const OpenedNoticeModal = ({
  isOpen,
  publicUrl,
  onCloseOpening,
  isClosing,
  onDismiss,
}: OpenedNoticeModalProps) => {
  const [remain, setRemain] = useState(CHECK_SECONDS);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setRemain(CHECK_SECONDS);
    setCopied(false);
    const timer = setInterval(() => {
      setRemain((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
    } catch {
      // 클립보드 권한이 없을 수 있다. 주소는 화면에 그대로 떠 있으니 실패해도 막히지 않는다.
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
          aria-label="오픈 완료 안내"
          className="relative mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
        >
          <div className="mb-4 flex flex-col gap-1">
            <span className="text-primary flex items-center gap-1.5 text-sm font-semibold">
              <span
                className="bg-primary h-1.5 w-1.5 rounded-full"
                aria-hidden="true"
              />
              오픈됨
            </span>
            <h3 className="text-base font-semibold text-neutral-900">
              지금부터 공개 리스트에 노출됩니다
            </h3>
            <p className="text-sm text-neutral-500">
              상세 페이지가 의도대로 보이는지 확인해주세요. 이상하면 아래에서
              바로 내릴 수 있어요.
            </p>
          </div>

          <div className="mb-4 flex flex-col gap-2">
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
              상세 페이지 확인하기
            </a>
          </div>

          {/* 남은 시간은 재촉일 뿐이라 0 이 되어도 모달만 조용해진다. */}
          <p className="mb-4 text-center text-xs text-neutral-400">
            {remain > 0
              ? `${remain}초 안에 확인해보세요. 시간이 지나도 노출은 계속됩니다.`
              : '확인이 끝나면 닫아주세요. 노출은 계속됩니다.'}
          </p>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCloseOpening}
              disabled={isClosing}
              className="text-system-error flex-1 rounded-xl border border-neutral-200 py-2.5 text-sm font-medium transition-colors hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isClosing ? '내리는 중...' : '바로 내리기'}
            </button>
            <button
              type="button"
              onClick={onDismiss}
              disabled={isClosing}
              className="bg-primary hover:bg-primary-hover flex-1 rounded-xl py-2.5 text-sm font-medium text-white transition-colors disabled:opacity-50"
            >
              확인
            </button>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
};

export default OpenedNoticeModal;
