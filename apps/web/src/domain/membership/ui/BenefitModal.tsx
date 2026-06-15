'use client';

interface BenefitModalProps {
  modalId: string | null;
  onClose: () => void;
}

function goToPlans(onClose: () => void) {
  onClose();
  setTimeout(
    () =>
      document.getElementById('plans')?.scrollIntoView({ behavior: 'smooth' }),
    150,
  );
}

function getModalContents(
  onClose: () => void,
): Record<string, React.ReactNode> {
  const handleGoToPlans = () => goToPlans(onClose);
  return {
    guidebook: (
      <>
        <div className="modal-head">
          <div className="ic ic-peach">📘</div>
          <div>
            <h3>가이드북 6종 무제한</h3>
            <p>경험정리부터 인적성까지, 합격 서류의 모든 단계</p>
          </div>
        </div>
        <div className="modal-body">
          <h4>멤버십에 포함된 가이드북</h4>
          <ul className="m-list">
            <li>경험정리 가이드북</li>
            <li>이력서 가이드북</li>
            <li>자기소개서 가이드북</li>
            <li>포트폴리오 가이드북</li>
            <li>면접 가이드북</li>
            <li>인적성 가이드북</li>
          </ul>
          <p className="m-note">
            베이직은 <b>경험정리·이력서·포트폴리오 3종</b>, 스탠다드·프리미엄은{' '}
            <b>6종 전체</b>를 기간 내내 무제한으로 열람할 수 있어요.
          </p>
        </div>
        <div className="modal-foot">
          <button className="btn btn-primary" onClick={handleGoToPlans}>
            플랜 보고 멤버십 신청 →
          </button>
        </div>
      </>
    ),
    study: (
      <>
        <div className="modal-head">
          <div className="ic ic-lav">🏃</div>
          <div>
            <h3>렛츠런 스터디 무료</h3>
            <p>혼자가 아니라 함께 달리는 3개월</p>
          </div>
        </div>
        <div className="modal-body">
          <p className="m-para">
            매주 목표를 인증하고 서로 응원하며 취준 루틴을 잡는 스터디예요. 공채
            시즌 내내 페이스를 잃지 않도록, 같은 목표를 가진 동료들과 함께
            달립니다.
          </p>
          <ul className="m-list one">
            <li>주간 인증으로 만드는 꾸준한 취준 루틴</li>
            <li>같은 시즌을 준비하는 동료들의 응원과 자극</li>
            <li>멤버십 기간 3개월 자유 참여</li>
          </ul>
          <p className="m-note">
            멤버십 혜택으로 <b>무료 참여</b>가 제공되며, 별도 페이백은 없어요.
          </p>
        </div>
        <div className="modal-foot">
          <button className="btn btn-primary" onClick={handleGoToPlans}>
            플랜 보고 멤버십 신청 →
          </button>
        </div>
      </>
    ),
    vod: (
      <>
        <div className="modal-head">
          <div className="ic ic-ice">🎬</div>
          <div>
            <h3>취준위키 VOD 전체</h3>
            <p>현직자 세미나 다시보기 무제한</p>
          </div>
        </div>
        <div className="modal-body">
          <p className="m-para">
            현직자들이 직접 들려주는 직무·산업·취업 전략 세미나를 영상으로
            모았어요. 출퇴근길에도, 자기 전에도 필요한 강의를 골라 무제한으로 볼
            수 있습니다.
          </p>
          <ul className="m-list one">
            <li>직무·산업 이해부터 면접 전략까지 전 강의 시청</li>
            <li>멤버십 기간 동안 추가되는 신규 VOD도 무료</li>
          </ul>
          <p className="m-note">
            VOD는 <b>스탠다드·프리미엄</b> 플랜에서 전체 열람할 수 있어요.
          </p>
        </div>
        <div className="modal-foot">
          <button className="btn btn-primary" onClick={handleGoToPlans}>
            플랜 보고 멤버십 신청 →
          </button>
        </div>
      </>
    ),
    challenge: (
      <>
        <div className="modal-head">
          <div className="ic ic-yel">🎯</div>
          <div>
            <h3>챌린지 할인</h3>
            <p>멤버 전용가로 만나는 렛츠커리어 챌린지</p>
          </div>
        </div>
        <div className="modal-body">
          <h4>멤버 할인이 적용되는 챌린지</h4>
          <div className="m-gallery">
            {[
              { label: '경험정리 챌린지', src: 'challenge-experience.jpg' },
              { label: '이력서 1주 완성', src: 'challenge-resume.png' },
              { label: '자기소개서 완성', src: 'challenge-coverletter.jpg' },
              {
                label: '대기업 공채 자소서',
                src: 'challenge-major-coverletter.jpg',
              },
              { label: '포트폴리오 완성', src: 'challenge-portfolio.jpg' },
              { label: '면접 끝장 챌린지', src: 'challenge-interview.png' },
              { label: '마케팅 올인원', src: 'challenge-marketing.png' },
              { label: 'HR/인사 직무', src: 'challenge-hr.png' },
              { label: 'PM/서비스기획', src: 'challenge-pm.png' },
            ].map(({ label, src }) => (
              <figure key={label}>
                <img
                  src={`/images/membership/${src}`}
                  alt={label}
                  loading="lazy"
                />
                <figcaption>{label}</figcaption>
              </figure>
            ))}
          </div>
          <h4 style={{ marginTop: '24px' }}>할인 예시</h4>
          <div className="m-example">
            <div className="row">
              <span>대기업 공채 챌린지</span>
              <span>
                <span className="strike">정가</span>
                <span className="o">최대 30% 할인</span>
              </span>
            </div>
            <div className="row">
              <span>직무·자소서·포폴·면접 챌린지</span>
              <span>
                <span className="strike">정가</span>
                <span className="o">최대 20% 할인</span>
              </span>
            </div>
            <div className="row">
              <span>예) 대기업 공채 자소서 3주 완성</span>
              <span>
                <span className="strike">99,000원</span>
                <b>69,300원</b>
              </span>
            </div>
          </div>
          <p className="m-note">
            할인율은 플랜 등급에 따라 달라져요. (베이직 기타 10% · 스탠다드
            대기업 25%/기타 15% · 프리미엄 대기업 30%/기타 20%)
          </p>
        </div>
        <div className="modal-foot">
          <button className="btn btn-primary" onClick={handleGoToPlans}>
            플랜 보고 멤버십 신청 →
          </button>
        </div>
      </>
    ),
    mentoring: (
      <>
        <div className="modal-head">
          <div className="ic ic-blue">🤝</div>
          <div>
            <h3>1:1 현직자 멘토링</h3>
            <p>프리미엄 전용 · 총 3회</p>
          </div>
        </div>
        <div className="modal-body">
          <p className="m-para">
            지원하려는 직무의 현직자와 1:1로 매칭돼 서류와 면접을 점검받아요. 내
            강점을 어떻게 보여줄지, 면접관이 무엇을 보는지 직접 들으며 마지막
            관문을 준비합니다.
          </p>
          <ul className="m-list one">
            <li>지원 직무 현직자와 1:1 매칭</li>
            <li>서류·면접 피드백 월 1회 × 3개월 = 총 3회</li>
            <li>마이페이지에서 희망 직무·일정 선택 후 진행</li>
          </ul>
          <p className="m-note">
            <b>프리미엄 플랜</b> 전용 혜택이에요.
          </p>
        </div>
        <div className="modal-foot">
          <button className="btn btn-primary" onClick={handleGoToPlans}>
            프리미엄 플랜 보기 →
          </button>
        </div>
      </>
    ),
    partner: (
      <>
        <div className="modal-head">
          <div className="ic ic-gray">🎁</div>
          <div>
            <h3>외부 제휴 혜택</h3>
            <p>곧 공개될 추가 혜택을 준비하고 있어요</p>
          </div>
        </div>
        <div className="modal-body">
          <ul className="m-list">
            <li>슈퍼인턴 제휴 혜택</li>
            <li>뷰인터 AI 모의면접</li>
            <li>현직자 커피챗</li>
            <li>스터디카페·AI 툴 제휴</li>
          </ul>
          <p className="m-note">
            제휴 혜택은 순차적으로 오픈될 예정이에요. 멤버십 가입자에게 가장
            먼저 안내드릴게요.
          </p>
        </div>
        <div className="modal-foot">
          <button className="btn btn-primary" onClick={handleGoToPlans}>
            플랜 보고 멤버십 신청 →
          </button>
        </div>
      </>
    ),
  };
}

export default function BenefitModal({ modalId, onClose }: BenefitModalProps) {
  if (!modalId) return null;

  const content = getModalContents(onClose)[modalId];
  if (!content) return null;

  return (
    <div
      className={`modal-ov ${modalId ? 'open' : ''}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal">
        <button
          className="modal-close"
          aria-label="닫기"
          onClick={onClose}
          style={{ position: 'absolute', top: 20, right: 20 }}
        >
          ✕
        </button>
        {content}
      </div>
    </div>
  );
}
