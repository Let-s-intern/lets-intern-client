import cn from 'classnames';
import Link from 'next/link';

import useScrollShadow from '../../../hooks/useScrollShadow';
import { ModalContentType } from './ProgramInfoModalGroup';

interface BootcampModalProps {
  applyAvailable: boolean;
  setShowModalContent: (showModalContent: ModalContentType) => void;
}

const BootcampModal = ({
  applyAvailable,
  setShowModalContent,
}: BootcampModalProps) => {
  const { scrollRef, isScrollTop, isScrollEnd } = useScrollShadow();

  return (
    <div id="bootcamp-modal" className="modal">
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
          <h1>부트캠프</h1>
        </div>
        <div
          ref={scrollRef}
          className={cn('modal-body', {
            'top-shadow': !isScrollTop,
            'bottom-shadow': !isScrollEnd,
          })}
        >
          <p>
            일주일 동안 무조건 인턴/신입에 3곳 이상 지원하는 프로그램입니다.{' '}
            <br />
            지원을 미루고 계신 분들께 추천드리며, 참여 시 다양한 자료와 멘토링이
            제공됩니다.
          </p>
          <hr />
          <h2>커리큘럼 소개</h2>
          <p>
            7일간 열심히 참여하여, 무조건 3개 이상의 서류 지원을 하실 분들을
            위한 프로그램입니다.
          </p>
          <h2>참여 혜택</h2>
          <ul>
            <li>이력서/포트폴리오 예시 공유</li>
            <li>지원 서류 첨삭 멘토링</li>
            <li>모의 면접 멘토링</li>
            <li>데일리 밀착 케어</li>
          </ul>
        </div>
        {applyAvailable && (
          <div className="modal-footer">
            <Link
              href="/program?category=BOOTCAMP"
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

export default BootcampModal;
