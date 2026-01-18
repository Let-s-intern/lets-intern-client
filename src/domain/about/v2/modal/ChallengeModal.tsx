import cn from 'classnames';
import Link from 'next/link';

import useScrollShadow from '@/hooks/useScrollShadow';
import classes from './ChallengeModal.module.scss';
import { ModalContentType } from './ProgramInfoModalGroup';

interface ChallengeModalProps {
  applyAvailable: boolean;
  challenge: any;
  setShowModalContent: (showModalContent: ModalContentType) => void;
}

const ChallengeModal = ({
  applyAvailable,
  challenge,
  setShowModalContent,
}: ChallengeModalProps) => {
  const { scrollRef, isScrollTop, isScrollEnd } = useScrollShadow();

  return (
    <div id="challenge-modal" className="modal">
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
          <h1>인턴 지원 챌린지</h1>
        </div>
        <div
          ref={scrollRef}
          className={cn('modal-body', {
            'top-shadow': !isScrollTop,
            'bottom-shadow': !isScrollEnd,
          })}
        >
          <p>
            인턴 준비 및 지원에 어려움을 느끼는 <br />
            사회초년생들을 위한 챌린지 프로그램입니다.
          </p>
          <hr />
          <h2>커리큘럼 소개</h2>
          <p>
            인턴 지원의 기초 다지기부터 실제 지원까지 이어지는 커리큘럼입니다.{' '}
            <br />
            직접 선정한 채용 공고를 바탕으로 짧고 굵게 나만의 강점과 희망 직무를
            연결할수 있어요.
          </p>
          <div className={classes.image}>
            <img src="/images/challenge-curriculum.svg" alt="챌린지 커리큘럼" />
          </div>
          <h3>
            퍼스널 브랜딩 <span className="normal-text">(7일간 진행)</span>
          </h3>
          <ul>
            <li>경험 리스트업, 속성 정리</li>
            <li>관심 직무 역량 및 구체적 업무 분석</li>
            <li>한 줄(1분) 자기소개 완성</li>
          </ul>
          <h3>
            모의 서류 작성하기 <span className="normal-text">(3일간 진행)</span>
          </h3>
          <ul>
            <li>지원 서류 마스터 파일 만들기</li>
            <li>이력서 초안 및 자유 양식 자기소개서 작성</li>
          </ul>
          <h3>
            공고 분석 <span className="normal-text">(2일간 진행)</span>
          </h3>
          <ul>
            <li>산업 및 회사 파악, 요구 사항 해석</li>
            <li>공고 맞춤 경험 소재 선정</li>
          </ul>
          <h3>
            실제 지원하기 <span className="normal-text">(2일간 진행)</span>
          </h3>
          <ul>
            <li>공고에 특화된 이력서, 자기소개서 완성</li>
            <li>지원동기 (3WHY)</li>
            <li>기업 1군데 이상 지원</li>
          </ul>
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
              href={`/program/detail/${challenge.id}`}
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

export default ChallengeModal;
