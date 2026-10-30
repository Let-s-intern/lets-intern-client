'use client';

import { useRef, useState } from 'react';
import styles from '../bigfirm.module.css';
import { COUPON } from '../data/coupon';

export function CouponTicket() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [label, setLabel] = useState('복사하기');

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(COUPON.code);
      setLabel('복사됐어요');
      setTimeout(() => setLabel('복사하기'), 1800);
    } catch {
      // 클립보드가 막힌 환경: 코드를 선택해 두어 직접 복사하게 한다
      inputRef.current?.select();
      setLabel('길게 눌러 복사');
    }
  };

  return (
    // 노치는 마스크로 뚫으므로, 그림자는 마스크 밖 래퍼의 drop-shadow 로 준다
    <div className="min-w-0 drop-shadow-[0_18px_22px_rgba(38,42,156,.35)]">
      <div
        className={`${styles.ticketNotch} ${styles.couponFlow} relative grid min-w-0 justify-items-start gap-3 rounded-[22px] bg-[linear-gradient(135deg,#262a9c_0%,#4d55f5_20%,#7a72ee_50%,#4d55f5_80%,#2a2fa8_100%)] bg-[length:200%_200%] py-8 pl-7 pr-[60px] text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,.16),inset_0_1px_0_rgba(255,255,255,.32)] min-[421px]:pr-[100px]`}
      >
        <span
          aria-hidden
          className="absolute inset-y-0 right-[40px] border-r-[1.5px] border-dashed border-white/45 min-[421px]:right-[64px]"
        />
        <p className="text-[13px] font-bold opacity-95">
          대기업 공채 다시 한번 도전!
        </p>
        <p className="flex items-baseline gap-1.5">
          <b className="text-[clamp(44px,7vw,60px)] font-extrabold leading-none tracking-[-0.02em]">
            {COUPON.amount}
          </b>
          <span className="text-xl font-bold">할인</span>
        </p>
        <p className="text-sm leading-[1.55] opacity-90">
          대기업 현직 멘토 1:1 LIVE 멘토링
        </p>
        <p className="rounded-full bg-white/15 px-3 py-1 text-[13px] font-extrabold text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,.25)]">
          ⏰ {COUPON.until}까지 사용 가능
        </p>
        <div className="mt-1 flex w-full flex-col gap-2 min-[421px]:flex-row">
          <input
            ref={inputRef}
            readOnly
            value={COUPON.code}
            aria-label="쿠폰 코드"
            className="w-full min-w-0 flex-1 rounded-sm border-[1.5px] border-dashed border-white/70 bg-white/10 px-4 py-3 text-xl font-extrabold tracking-[.08em] text-white"
          />
          <button
            type="button"
            onClick={copy}
            className="shrink-0 rounded-sm bg-white px-5 py-3 text-[15px] font-extrabold text-[#3a46e0] hover:brightness-95"
          >
            {label}
          </button>
        </div>
      </div>
    </div>
  );
}
