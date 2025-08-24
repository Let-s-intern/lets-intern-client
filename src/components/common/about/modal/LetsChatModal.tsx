import Link from 'next/link';
import cn from 'classnames';

import { ModalContentType } from './ProgramInfoModalGroup';

interface BootcampModalProps {
  applyAvailable: boolean;
  setShowModalContent: (showModalContent: ModalContentType) => void;
}

const LetsChatModal = ({
  applyAvailable,
  setShowModalContent,
}: BootcampModalProps) => {
  return (
    <div id="lets-chat-modal" className="modal">
      <div
        className={cn('modal-content', {
          'apply-available': applyAvailable,
        })}
      >
        <div className="modal-header">
          <div className="top-button-area">
            <button
              className="close-button"
              onClick={() => setShowModalContent('')}
            >
              &times;
            </button>
          </div>
          <h1>렛츠챗</h1>
        </div>
        <p>
          커리어 선배들과 소통하며 실용적인 인사이트를 얻을 수 있는
          프로그램입니다. <br />
          서류 및 면접 준비, 직무 등 다양한 주제로 세션을 진행하고 있습니다.
        </p>
        {applyAvailable && (
          <div className="modal-footer">
            <Link
              href="/program?category=LETS_CHAT"
              className="apply-link-button"
            >
              신청하기
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default LetsChatModal;
