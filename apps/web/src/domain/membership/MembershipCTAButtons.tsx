'use client';
import { useEffect, useState } from 'react';
import { MEMBERSHIP_SEATS_TAKEN, MEMBERSHIP_SEATS_TOTAL } from './constants';

export default function MembershipCTAButtons() {
  const [show, setShow] = useState(false);
  const seatsLeft = MEMBERSHIP_SEATS_TOTAL - MEMBERSHIP_SEATS_TAKEN;

  useEffect(() => {
    const handler = () => setShow(window.scrollY > 700);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <div className={`stickybar${show ? 'show' : ''}`} id="stickybar">
      <div className="in">
        <div className="txt">
          하반기 멤버십 · 선착순 <b className="num pulse">{seatsLeft}</b>석 남음
        </div>
        <button
          className="btn btn-primary"
          onClick={() =>
            document
              .getElementById('plans')
              ?.scrollIntoView({ behavior: 'smooth' })
          }
          // TODO(MVP): 기획 확정 후 스탠다드 바로 결제로 전환 가능
        >
          지금 신청 →
        </button>
      </div>
    </div>
  );
}
