import { Fragment } from 'react';
import cn from 'classnames';

import styles from './AlertModal.module.scss';

interface AlertModalProps {
  onConfirm: () => void;
  onCancel?: (e?: any) => void;
  highlight?: 'confirm' | 'cancel';
  title: string;
  confirmText?: string;
  cancelText?: string;
  children: React.ReactNode;
  disabled?: boolean;
  showCancel?: boolean;
  className?: string;
}

const AlertModal = ({
  onConfirm,
  onCancel,
  highlight = 'confirm',
  title,
  confirmText = '확인',
  cancelText = '취소',
  children,
  disabled = false,
  showCancel = true,
  className,
}: AlertModalProps) => {
  return (
    <div className={styles.modal}>
      <div className={cn(styles.content, className)}>
        <h3 className={styles.header}>
          {title.split('<br />').map((titleEl, index) => (
            <Fragment key={index}>
              {titleEl}
              <br />
            </Fragment>
          ))}
        </h3>
        <div className={cn(styles.body)}>{children}</div>
        <div className={styles.footer}>
          <button
            type="button"
            className={cn(styles.confirm, styles.button, {
              [styles.highlight]: highlight === 'confirm',
            })}
            onClick={() => !disabled && onConfirm()}
          >
            {confirmText}
          </button>
          {showCancel && (
            <button
              type="button"
              className={cn(styles.confirm, styles.button, {
                [styles.highlight]: highlight === 'cancel',
                [styles.disabled]: disabled,
              })}
              onClick={onCancel}
            >
              {cancelText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlertModal;
