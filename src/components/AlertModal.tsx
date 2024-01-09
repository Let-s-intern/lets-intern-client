import { Fragment } from 'react';
import cn from 'classnames';

import './AlertModal.scss';

interface AlertModalProps {
  onConfirm: () => void;
  onCancel?: () => void;
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
  highlight = 'cancel',
  title,
  confirmText = '확인',
  cancelText = '취소',
  children,
  disabled = false,
  showCancel = true,
  className,
}: AlertModalProps) => {
  return (
    <div className="alert-modal">
      <div className={cn(className, 'alert-modal-box')}>
        <h3 className="modal-header">
          {title.split('<br />').map((titleEl, index) => (
            <Fragment key={index}>
              {titleEl}
              <br />
            </Fragment>
          ))}
        </h3>
        <div className="modal-body">{children}</div>
        <div className="modal-footer">
          <button
            type="button"
            className={cn('confirm-button', 'button', {
              highlight: highlight === 'confirm',
              disabled: disabled,
            })}
            onClick={() => !disabled && onConfirm()}
          >
            {confirmText}
          </button>
          {showCancel && (
            <button
              type="button"
              className={cn('confirm-button', 'button', {
                highlight: highlight === 'cancel',
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
