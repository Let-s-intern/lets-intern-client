import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';

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

const CHALLENGE_ITEMS = [
  {
    label: '경험정리 챌린지',
    src: 'challenge-experience.jpg',
    url: 'https://www.letscareer.co.kr/challenge/experience-summary/latest',
  },
  {
    label: '이력서 1주 완성',
    src: 'challenge-resume.png',
    url: 'https://www.letscareer.co.kr/challenge/resume/latest',
  },
  {
    label: '자기소개서 완성',
    src: 'challenge-coverletter.jpg',
    url: 'https://www.letscareer.co.kr/challenge/personal-statement/latest',
  },
  {
    label: '대기업 공채 자소서',
    src: 'challenge-major-coverletter.jpg',
    url: 'https://www.letscareer.co.kr/challenge/personal-statement/latest',
  },
  {
    label: '포트폴리오 완성',
    src: 'challenge-portfolio.jpg',
    url: 'https://www.letscareer.co.kr/challenge/portfolio/latest',
  },
  {
    label: '면접 끝장 챌린지',
    src: 'challenge-interview.png',
    url: 'https://www.letscareer.co.kr/challenge/meeting-preparation/latest',
  },
  {
    label: '마케팅 올인원',
    src: 'challenge-marketing.png',
    url: 'https://www.letscareer.co.kr/challenge',
  },
  {
    label: 'HR/인사 직무',
    src: 'challenge-hr.png',
    url: 'https://www.letscareer.co.kr/challenge',
  },
  {
    label: 'PM/서비스기획',
    src: 'challenge-pm.png',
    url: 'https://www.letscareer.co.kr/challenge',
  },
];

// 가이드북 표지(제목이 이미지 안에 포함) — 인적성은 표지 이미지 미수급
// url: /program/guidebook/{id} → 정식 제목 경로로 리다이렉트됨
const GUIDEBOOK_ITEMS = [
  {
    label: '경험정리 가이드북',
    src: 'guide-experience.png',
    url: 'https://www.letscareer.co.kr/program/guidebook/7',
  },
  {
    label: '이력서 완성 가이드북',
    src: 'guide-resume.png',
    url: 'https://www.letscareer.co.kr/program/guidebook/6',
  },
  {
    label: '자기소개서 완성 가이드북',
    src: 'guide-coverletter.png',
    url: 'https://www.letscareer.co.kr/program/guidebook/5',
  },
  {
    label: '포트폴리오 완성 가이드북',
    src: 'guide-portfolio.png',
    url: 'https://www.letscareer.co.kr/program/guidebook/2',
  },
  {
    label: '면접 준비 끝장 가이드북',
    src: 'guide-interview.png',
    url: 'https://www.letscareer.co.kr/program/guidebook/9',
  },
];

function getModalContents(onClose: () => void): Record<string, ReactNode> {
  const handleGoToPlans = () => goToPlans(onClose);
  return {
    guidebook: (
      <>
        <div className="modal-head">
          <div className="ic ic-peach">
            <span
              className="ic-glyph"
              style={{
                ['--icon' as string]:
                  'url(/images/membership/ic-guidebook.svg)',
              }}
            />
          </div>
          <div>
            <h3>가이드북 6종 무제한</h3>
            <p>경험정리부터 인적성까지, 합격 서류의 모든 단계</p>
          </div>
        </div>
        <div className="modal-body">
          <div className="m-intro">
            <span className="m-intro-hl">
              합격한 선배들의 노하우를 단계별로 정리했어요
            </span>
            <p>
              경험정리부터 인적성까지, <b>6종의 가이드북</b>을 멤버십 기간 내내
              무제한으로 열람할 수 있어요.
            </p>
          </div>
          <h4>멤버십에 포함된 가이드북</h4>
          <div className="m-books">
            {GUIDEBOOK_ITEMS.map(({ label, src, url }) => (
              <a
                key={label}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="m-gallery-link"
              >
                <figure>
                  <img
                    src={`/images/membership/${src}`}
                    alt={label}
                    loading="lazy"
                  />
                </figure>
              </a>
            ))}
          </div>
          <p className="m-note">
            경험정리·이력서·자기소개서·포트폴리오·면접에 <b>인적성까지 6종</b>.
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
          <div className="ic ic-lav">
            <span
              className="ic-glyph"
              style={{
                ['--icon' as string]: 'url(/images/membership/ic-study.svg)',
              }}
            />
          </div>
          <div>
            <h3>렛츠런 스터디 무료</h3>
            <p>혼자가 아니라 함께 달리는 3개월</p>
          </div>
        </div>
        <div className="modal-body">
          <div className="m-intro">
            <span className="m-intro-hl">
              혼자가 아니라 함께 달리는 3개월 스터디
            </span>
            <p>
              매주 목표를 인증하고 서로 응원하며 취준 루틴을 잡아요. 스터디는{' '}
              <b>A·B 두 가지 유형</b>으로 구성돼, 원하는 유형을 골라 신청하면
              됩니다.
            </p>
          </div>

          <div className="stype-group">
            <div className="stype">
              <div className="stype-head">
                <span className="stype-num">1</span>
                <span className="stype-title">
                  꾸준한 습관 만들기가 목표인 <b>A유형</b>
                </span>
              </div>
              <ul className="stype-list">
                <li>매일매일 가볍게 꾸준한 습관 만드는 게 목표예요</li>
                <li>나 혼자서는 집중하기도 어렵고, 루틴도 자꾸 무너져요</li>
                <li className="hl">
                  매일 가볍게 인증하고, ‘꾸준히’에 초점을 맞추는 유형
                </li>
              </ul>
            </div>

            <div className="stype">
              <div className="stype-head">
                <span className="stype-num">2</span>
                <span className="stype-title">
                  상반기 서류 제출·합격이 목표인 <b>B유형</b>
                </span>
              </div>
              <ul className="stype-list">
                <li>이번 상반기에는 반드시 합격하는 게 목표예요</li>
                <li>
                  얼렁뚱땅 그만하고, 취준 제대로 준비하면서 진짜 서류 제출하고
                  싶어요
                </li>
                <li className="hl">
                  상반기 공채·수시 목표가 확실하고, 마감 기한을 향해 달리고 싶은
                  유형
                </li>
              </ul>
            </div>
          </div>

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
          <div className="ic ic-ice">
            <span
              className="ic-glyph"
              style={{
                ['--icon' as string]: 'url(/images/membership/ic-vod.svg)',
              }}
            />
          </div>
          <div>
            <h3>세미나 VOD 20종</h3>
            <p>현직자 세미나 다시보기 무제한</p>
          </div>
        </div>
        <div className="modal-body">
          <div className="m-intro">
            <span className="m-intro-hl">
              현직자가 직접 전하는 직무·취업 전략 세미나
            </span>
            <p>
              출퇴근길에도, 자기 전에도 <b>20종 이상의 강의</b>를 골라
              무제한으로 볼 수 있어요.
            </p>
          </div>
          <figure className="m-shot">
            <img
              src="/images/membership/seminar-list.png"
              alt="렛츠커리어 LIVE 세미나 목록"
              loading="lazy"
            />
          </figure>
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
          <div className="ic ic-yel">
            <span
              className="ic-glyph"
              style={{
                ['--icon' as string]:
                  'url(/images/membership/ic-challenge.svg)',
              }}
            />
          </div>
          <div>
            <h3>챌린지 종류별 1회 무료 참여</h3>
            <p>멤버십에 포함된 렛츠커리어 챌린지</p>
          </div>
        </div>
        <div className="modal-body">
          <div className="m-intro">
            <span className="m-intro-hl">
              멤버십 가입자는 챌린지를 추가 비용 없이
            </span>
            <p>
              경험정리·이력서·면접 등 <b>렛츠커리어 챌린지</b>를{' '}
              <b>종류별 1회씩</b> 베이직 플랜으로 무료 참여할 수 있어요.
            </p>
          </div>
          <h4>무료로 참여할 수 있는 챌린지</h4>
          <div className="m-gallery">
            {CHALLENGE_ITEMS.map(({ label, src, url }) => (
              <a
                key={label}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="m-gallery-link"
              >
                <figure>
                  <img
                    src={`/images/membership/${src}`}
                    alt={label}
                    loading="lazy"
                  />
                  <figcaption>{label}</figcaption>
                </figure>
              </a>
            ))}
          </div>
          <p className="m-note">
            각 챌린지의 <b>베이직 플랜</b>을 <b>종류별 1회씩</b> 무료로 참여할
            수 있어요. 원하는 챌린지부터 바로 시작하세요.
          </p>
        </div>
        <div className="modal-foot">
          <button className="btn btn-primary" onClick={handleGoToPlans}>
            플랜 보고 멤버십 신청 →
          </button>
        </div>
      </>
    ),
    santatoeic: (
      <>
        <div className="modal-head">
          <img
            className="modal-logo"
            src="/images/membership/partner-santa.png"
            alt="산타토익"
          />
          <div>
            <h3>산타토익 이용권 할인 쿠폰</h3>
            <p>AI 토익 학습을 멤버 전용가로</p>
          </div>
        </div>
        <div className="modal-body">
          <div className="m-intro">
            <span className="m-intro-hl">
              AI가 진단해 최소 학습으로 목표 점수까지 이끌어 드려요
            </span>
            <p>
              멤버십 가입자에게 <b>이용권 할인 또는 무료 체험권</b>을 제공해,
              공채에 필요한 어학 점수를 시즌 안에 끝낼 수 있어요.
            </p>
          </div>
          <figure className="m-shot">
            <img
              src="/images/membership/modal-santa.png"
              alt="산타토익 서비스 화면"
              loading="lazy"
            />
          </figure>
          <div className="st-stats">
            <div className="st-stat">
              <span className="st-num">10명 중 8.8명</span>
              <span className="st-label">이용 후 점수 상승</span>
            </div>
            <div className="st-stat">
              <span className="st-num">AI 맞춤</span>
              <span className="st-label">개인화 학습 커리큘럼</span>
            </div>
          </div>
          <h4>멤버십 가입자 전용 혜택</h4>
          <div className="st-offers">
            <div className="st-offer">
              <span className="st-offer-tag">혜택 A</span>
              <strong>이용권 할인 쿠폰</strong>
              <p>
                멤버십 등급별 산타토익 이용권을 특별 할인가로 구매할 수 있어요.
              </p>
            </div>
            <div className="st-offer">
              <span className="st-offer-tag">혜택 B</span>
              <strong>무료 체험권 제공</strong>
              <p>처음 시작하는 분들께 무료로 체험할 수 있는 이용권을 드려요.</p>
            </div>
          </div>
          <p className="m-note">
            정확한 쿠폰 금액·사용 조건은 추후 안내드릴게요.
          </p>
        </div>
        <div className="modal-foot modal-foot-stack">
          <button className="btn btn-primary" onClick={handleGoToPlans}>
            플랜 보고 멤버십 신청 →
          </button>
          <a
            href="https://www.aitoeic.kr/"
            target="_blank"
            rel="noopener noreferrer"
            className="modal-extbtn"
          >
            산타토익 바로가기 →
          </a>
        </div>
      </>
    ),
    viewinter: (
      <>
        <div className="modal-head">
          <img
            className="modal-logo"
            src="/images/membership/partner-viewinter.png"
            alt="뷰인터 AI"
          />
          <div>
            <h3>뷰인터 AI 면접 이용권</h3>
            <p>대기업 면접 툴 뷰인터로, 실전처럼 미리 연습</p>
          </div>
        </div>
        <div className="modal-body">
          <div className="m-intro">
            <span className="m-intro-hl">
              현대·LG·YG 등 대기업이 실제 채용에 쓰는 AI 면접 툴
            </span>
            <p>
              멤버십 구매자 전원에게 <b>뷰인터 면접 이용권</b>을 제공해요.
              실전과 같은 환경에서 미리 경험하고 약점을 다듬으세요.
            </p>
          </div>
          <h4>두 가지 연습 모드</h4>
          <div className="vi-modes">
            <div className="vi-mode">
              <span className="tag">내 역량이 궁금할 때</span>
              <h5>대화형 면접 연습</h5>
              <ul className="pts">
                <li>
                  <span>POINT 1</span>실제 기업에서 진행되는 구조화된 면접을
                  체계적으로 연습
                </li>
                <li>
                  <span>POINT 2</span>답변 맞춤형 질문으로 실제 면접처럼 연습
                </li>
                <li>
                  <span>POINT 3</span>AI 면접관의 피드백으로 보완점과 개선점
                  확인
                </li>
              </ul>
            </div>
            <div className="vi-mode">
              <span className="tag">모의 면접 연습이 필요할 때</span>
              <h5>일반형 면접 연습</h5>
              <ul className="pts">
                <li>
                  <span>POINT 1</span>기업 기출 문제로 탄탄하게 연습
                </li>
                <li>
                  <span>POINT 2</span>모의 면접·면접 연습 무제한 사용
                </li>
                <li>
                  <span>POINT 3</span>면접 태도를 파악하는 AI 분석 리포트 제공
                </li>
              </ul>
            </div>
          </div>
          <div className="vi-clients">
            <img
              src="/images/membership/viewinter-modes.png"
              alt="뷰인터 대화형·일반형 면접 연습 화면"
              loading="lazy"
            />
          </div>

          <h4 style={{ marginTop: '24px' }}>플랜별 제공 이용권</h4>
          <div className="vi-alloc">
            <div className="row">
              <span className="pl">베이직 · 스탠다드</span>
              <span className="amt">
                대화형 1일권 <b>×3</b> · 일반형 1일권 <b>×3</b>
              </span>
            </div>
            <div className="row">
              <span className="pl feat">프리미엄</span>
              <span className="amt">
                대화형 1일권 <b>×5</b> · 일반형 1일권 <b>×5</b>
              </span>
            </div>
          </div>
          <p className="m-note">
            대화형 1일권은 <b>1일 최대 5회</b> 연습할 수 있어요. 멤버십 구매자
            전원에게 자동 지급됩니다. (이용권 정가 1일권 9,900원 기준)
          </p>
        </div>
        <div className="modal-foot">
          <button className="btn btn-primary" onClick={handleGoToPlans}>
            플랜 보고 멤버십 신청 →
          </button>
        </div>
      </>
    ),
    superintern: (
      <>
        <div className="modal-head">
          <img
            className="modal-logo"
            src="/images/membership/partner-superintern.png"
            alt="슈퍼인턴"
          />
          <div>
            <h3>슈퍼인턴 채용 연계 혜택</h3>
            <p>AI 채용 매칭 · 인재 우선 검토 · AI 진단 리포트 크레딧</p>
          </div>
        </div>
        <div className="modal-body">
          <div className="m-intro">
            <span className="m-intro-hl">
              IT 스타트업 취업을 위한 AI 채용 매칭 플랫폼
            </span>
            <p>
              멤버십 가입자에게 <b>채용 연계·역량 진단 혜택</b>을 제공해, 준비한
              만큼 더 빠르게 기회로 이어집니다.
            </p>
          </div>
          <figure className="m-shot">
            <img
              src="/images/membership/modal-superintern.png"
              alt="슈퍼인턴 서비스 화면"
              loading="lazy"
            />
          </figure>
          <h4>멤버십 전용 혜택 2가지</h4>
          <div className="si-cards">
            <div className="si-card">
              <span className="si-badge">혜택 A</span>
              <strong>인재 우선 검토</strong>
              <p>
                이력서 등록 시 기업 채용 담당자에게 우선 추천돼 더 빠르게 기회를
                잡을 수 있어요.
              </p>
            </div>
            <div className="si-card">
              <span className="si-badge">혜택 B</span>
              <strong>AI 진단 리포트 크레딧</strong>
              <p>
                내 역량을 AI가 분석한 진단 리포트를 크레딧으로 제공해 드려요.
              </p>
            </div>
          </div>
          <p className="m-note">
            크레딧 수량 등 세부 조건은 추후 안내드릴게요.
          </p>
        </div>
        <div className="modal-foot modal-foot-stack">
          <button className="btn btn-primary" onClick={handleGoToPlans}>
            플랜 보고 멤버십 신청 →
          </button>
          <a
            href="https://www.superintern.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="modal-extbtn"
          >
            슈퍼인턴 바로가기 →
          </a>
        </div>
      </>
    ),
  };
}

export default function BenefitModal({ modalId, onClose }: BenefitModalProps) {
  if (!modalId) return null;

  const content = getModalContents(onClose)[modalId];
  if (!content) return null;

  if (typeof document === 'undefined') return null;

  // 오버레이는 document.body 로 포털한다(섹션 안에 두면 임베드 시 absolute 기준점이
  // 섹션이 되어 보이는 영역 밖으로 밀려나 화면에 안 보인다).
  return createPortal(
    // 포털은 .membership-root 밖(body)으로 나가므로 스코프드 CSS·변수를 받도록 래핑한다.
    <div className="membership-root">
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
    </div>,
    document.body,
  );
}
