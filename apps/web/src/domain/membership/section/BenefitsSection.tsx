'use client';
import { useState } from 'react';
import BenefitModal from '../ui/BenefitModal';

export default function BenefitsSection() {
  const [openModalId, setOpenModalId] = useState<string | null>(null);

  return (
    <section className="benefits" id="benefits">
      <div className="wrap">
        <div className="sec-head rv">
          <span className="eyebrow">멤버십 혜택</span>
          <h2>하나의 멤버십으로 받는 5가지</h2>
          <p>공채 시즌에 꼭 필요한 것만 모았어요.</p>
        </div>
        <div className="bgrid">
          <div
            className="bcard rv"
            style={{ ['--rvd' as string]: '0s' }}
            onClick={() => setOpenModalId('guidebook')}
          >
            <div className="ic ic-peach">📘</div>
            <h3>가이드북 6종 무제한</h3>
            <p>
              경험정리·이력서·자기소개서·포트폴리오·면접·인적성 가이드북을
              멤버십 기간 내내 제한 없이 열람해요.
            </p>
            <div className="tagline">시즌 내내 무제한 열람</div>
            <button className="bcard-more">자세히 보기 →</button>
          </div>

          <div
            className="bcard rv"
            style={{ ['--rvd' as string]: '0.08s' }}
            onClick={() => setOpenModalId('study')}
          >
            <div className="ic ic-lav">🏃</div>
            <h3>렛츠런 스터디 무료</h3>
            <p>
              매주 인증하며 루틴을 잡는 렛츠런 스터디에 3개월간 무료로
              참여하세요. 혼자가 아니라 함께 달립니다.
            </p>
            <div className="tagline">3개월 자유 참여</div>
            <button className="bcard-more">자세히 보기 →</button>
          </div>

          <div
            className="bcard rv"
            style={{ ['--rvd' as string]: '0.16s' }}
            onClick={() => setOpenModalId('vod')}
          >
            <div className="ic ic-ice">🎬</div>
            <h3>
              취준위키 VOD 전체 <span className="pill pill-new">NEW</span>
            </h3>
            <p>
              현직자 세미나 VOD 라이브러리를 멤버십 기간 동안 전부 무료로 시청할
              수 있어요.
            </p>
            <div className="tagline">전 강의 무료 시청</div>
            <button className="bcard-more">자세히 보기 →</button>
          </div>

          <div
            className="bcard rv"
            style={{ ['--rvd' as string]: '0.24s' }}
            onClick={() => setOpenModalId('challenge')}
          >
            <div className="ic ic-yel">🎯</div>
            <h3>챌린지 할인</h3>
            <p>
              이력서·자소서·포트폴리오 완성 챌린지를 멤버 전용가로. 대기업
              챌린지 최대 30%, 그 외 최대 20% 할인.
            </p>
            <div className="tagline">최대 30% 멤버 전용가</div>
            <button className="bcard-more">할인 챌린지 보기 →</button>
          </div>

          <div
            className="bcard rv"
            style={{ ['--rvd' as string]: '0.32s' }}
            onClick={() => setOpenModalId('mentoring')}
          >
            <div className="ic ic-blue">🤝</div>
            <h3>
              1:1 현직자 멘토링{' '}
              <span className="pill pill-coral">프리미엄</span>
            </h3>
            <p>
              지원 직무 현직자에게 서류·면접을 3개월간 월 1회, 총 3회 1:1로
              피드백 받아요.
            </p>
            <div className="tagline">총 3회 1:1 멘토링</div>
            <button className="bcard-more">자세히 보기 →</button>
          </div>

          <div
            className="bcard soon rv"
            style={{ ['--rvd' as string]: '0.4s' }}
            onClick={() => setOpenModalId('partner')}
          >
            <div className="ic ic-gray">🎁</div>
            <h3>
              외부 제휴 혜택 <span className="pill pill-soon">준비 중</span>
            </h3>
            <p>
              인프런 쿠폰, 모의·AI 면접, 현직자 커피챗, 스터디카페 제휴 등 추가
              혜택을 준비하고 있어요.
            </p>
            <div className="tagline" style={{ color: 'var(--g500)' }}>
              곧 공개됩니다
            </div>
            <button className="bcard-more">미리 보기 →</button>
          </div>
        </div>
      </div>

      <BenefitModal
        modalId={openModalId}
        onClose={() => setOpenModalId(null)}
      />
    </section>
  );
}
