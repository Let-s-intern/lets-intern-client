'use client';
import Countdown from '../ui/Countdown';
import { MEMBERSHIP_DEADLINE } from '../constants';
import { useMembershipApply } from '../hooks/useMembershipApply';

export default function FinalCtaSection() {
  const { handleApply } = useMembershipApply();
  return (
    <section className="final">
      <div className="wrap">
        <span className="eyebrow">선착순 마감 임박</span>
        <h2 className="rv">
          하반기 공채, 지금이
          <br />
          시작할 타이밍이에요
        </h2>
        <p className="rv">
          모집이 끝나면 다음 기회는 2027 상반기. 망설이는 사이 좌석은
          줄어듭니다.
        </p>
        <div className="cd rv">
          <Countdown deadline={MEMBERSHIP_DEADLINE} />
        </div>
        <button
          className="btn btn-primary btn-lg rv"
          onClick={() => handleApply('STANDARD')}
        >
          멤버십 신청하기 →
        </button>
        <p className="secret rv">
          💌 이미 렛츠커리어 무료 자료집을 받아본 분께는{' '}
          <b>리드 회원 전용 추가 할인</b>을 드려요.
        </p>
      </div>
    </section>
  );
}
