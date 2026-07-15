import { useCallback, useState } from 'react';

type ModalVariant = 'info' | 'success' | 'error' | 'confirm';

interface AlertState {
  isOpen: boolean;
  title: string;
  description?: string;
  variant: ModalVariant;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onClose?: () => void;
}

const INITIAL_STATE: AlertState = {
  isOpen: false,
  title: '',
  variant: 'info',
};

/**
 * alert() / window.confirm() 대체 훅.
 *
 * ```tsx
 * const { alertProps, showAlert, showConfirm } = useMentorAlert();
 *
 * showAlert({ title: '저장되었습니다.', variant: 'success' });
 * showConfirm({ title: '제출하시겠습니까?', onConfirm: handleSubmit });
 *
 * return <MentorAlertModal {...alertProps} />;
 * ```
 */
export function useMentorAlert() {
  const [state, setState] = useState<AlertState>(INITIAL_STATE);

  const close = useCallback(() => {
    setState((prev) => {
      prev.onClose?.();
      return INITIAL_STATE;
    });
  }, []);

  const showAlert = useCallback(
    (opts: {
      title: string;
      description?: string;
      variant?: ModalVariant;
      confirmText?: string;
      onClose?: () => void;
    }) => {
      setState({
        isOpen: true,
        title: opts.title,
        description: opts.description,
        variant: opts.variant ?? 'info',
        confirmText: opts.confirmText,
        onClose: opts.onClose,
      });
    },
    [],
  );

  const showConfirm = useCallback(
    (opts: {
      title: string;
      description?: string;
      variant?: ModalVariant;
      confirmText?: string;
      cancelText?: string;
      onConfirm: () => void;
      onClose?: () => void;
    }) => {
      setState({
        isOpen: true,
        title: opts.title,
        description: opts.description,
        variant: opts.variant ?? 'confirm',
        confirmText: opts.confirmText,
        cancelText: opts.cancelText,
        onConfirm: opts.onConfirm,
        onClose: opts.onClose,
      });
    },
    [],
  );

  return {
    alertProps: {
      isOpen: state.isOpen,
      onClose: close,
      onConfirm: state.onConfirm,
      title: state.title,
      description: state.description,
      variant: state.variant,
      confirmText: state.confirmText,
      cancelText: state.cancelText,
    },
    showAlert,
    showConfirm,
  };
}
