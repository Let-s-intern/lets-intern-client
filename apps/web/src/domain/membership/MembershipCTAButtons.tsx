'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/useAuthStore';
import MembershipApplySheet from './MembershipApplySheet';
import {
  MEMBERSHIP_CHALLENGE_ID,
  MEMBERSHIP_SEATS_TAKEN,
  MEMBERSHIP_SEATS_TOTAL,
} from './constants';

export default function MembershipCTAButtons() {
  const [show, setShow] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const { isLoggedIn } = useAuthStore();
  const router = useRouter();
  const seatsLeft = MEMBERSHIP_SEATS_TOTAL - MEMBERSHIP_SEATS_TAKEN;

  useEffect(() => {
    const handler = () => setShow(window.scrollY > 700);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const handleApplyClick = () => {
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
      <div className={`stickybar ${show ? 'show' : ''}`} id="stickybar">
        <div className="in">
          <div className="txt">
            하반기 멤버십 · 선착순 <b className="num pulse">{seatsLeft}</b>석
            남음
          </div>
          <button className="btn btn-primary" onClick={handleApplyClick}>
            지금 신청 →
          </button>
        </div>
      </div>
      <MembershipApplySheet
        isOpen={sheetOpen}
        onClose={() => setSheetOpen(false)}
      />
    </>
  );
}
