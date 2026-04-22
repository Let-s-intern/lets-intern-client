'use client';

import { useEffect, useRef } from 'react';
import ModalPortal from '@/common/ModalPortal';

type ModalVariant = 'info' | 'success' | 'error' | 'confirm';

interface MentorAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: ModalVariant;
}

const variantConfig: Record<
  ModalVariant,
  { icon: string; iconBg: string; iconColor: string }
> = {
  success: {
    icon: 'M5 13l4 4L19 7',
    iconBg: 'bg-green-50',
    iconColor: 'text-green-500',
  },
  error: {
    icon: 'M6 18L18 6M6 6l12 12',
    iconBg: 'bg-red-50',
    iconColor: 'text-red-500',
  },
  confirm: {
    icon: 'M12 9v4m0 4h.01',
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-500',
  },
  info: {
    icon: 'M12 9v4m0 4h.01',
    iconBg: 'bg-primary-5',
    iconColor: 'text-primary',
  },
};

const MentorAlertModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = '확인',
  cancelText = '취소',
  variant = 'info',
}: MentorAlertModalProps) => {
  const confirmRef = useRef<HTMLButtonElement>(null);
  const isConfirmMode = !!onConfirm;
  const config = variantConfig[variant];

  useEffect(() => {
    if (isOpen) confirmRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <ModalPortal>
      <div className="fixed inset-0 z-[60] flex items-center justify-center">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/40"
          onClick={onClose}
          aria-hidden
        />

        {/* Modal */}
        <div className="relative mx-4 w-full max-w-sm animate-[mentorModalIn_0.2s_ease-out] rounded-2xl bg-white p-6 shadow-xl">
          {/* Icon */}
          <div className="mb-4 flex justify-center">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-full ${config.iconBg}`}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                className={config.iconColor}
              >
                <path
                  d={config.icon}
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-center text-base font-semibold text-neutral-900">
            {title}
          </h3>

          {/* Description */}
          {description && (
            <p className="mt-2 whitespace-pre-line text-center text-sm text-neutral-500">
              {description}
            </p>
          )}

          {/* Actions */}
          <div className="mt-6 flex gap-3">
            {isConfirmMode && (
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-xl border border-neutral-200 py-2.5 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-50"
              >
                {cancelText}
              </button>
            )}
            <button
              ref={confirmRef}
              type="button"
              onClick={isConfirmMode ? onConfirm : onClose}
              className="flex-1 rounded-xl bg-primary py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>

      {/* Animation keyframe */}
      <style>{`
        @keyframes mentorModalIn {
          from { opacity: 0; transform: scale(0.95) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </ModalPortal>
  );
};

export default MentorAlertModal;
