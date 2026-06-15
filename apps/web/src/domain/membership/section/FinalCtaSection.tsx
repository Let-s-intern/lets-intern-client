'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/useAuthStore';
import Countdown from '../ui/Countdown';
import { useMembershipProgram } from '../hooks/useMembershipProgram';
import MembershipApplySheet from '../MembershipApplySheet';
import { MEMBERSHIP_CHALLENGE_ID } from '../constants';

export default function FinalCtaSection() {
  const { deadline } = useMembershipProgram();
  const [sheetOpen, setSheetOpen] = useState(false);
  const { isLoggedIn } = useAuthStore();
  const router = useRouter();

  const handleClick = () => {
    if (!MEMBERSHIP_CHALLENGE_ID) {
      alert('준비 중입니다. 잠시만 기다려주세요.');
      return;
    }
    if (!isLoggedIn) {
      router.push(`/login?redirect=${encodeURIComponent('/membership')}`);
      return;
    }
    setSheetOpen(true);
  };

  return (
    <>
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
            <Countdown deadline={deadline} />
          </div>
          <button className="btn btn-primary btn-lg rv" onClick={handleClick}>
            멤버십 신청하기 →
          </button>
          <p className="secret rv">
            💌 이미 렛츠커리어 무료 자료집을 받아본 분께는{' '}
            <b>리드 회원 전용 추가 할인</b>을 드려요.
          </p>
        </div>
      </section>
      <MembershipApplySheet
        isOpen={sheetOpen}
        onClose={() => setSheetOpen(false)}
      />
    </>
  );
}
