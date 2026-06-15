'use client';
import { useEffect, useState } from 'react';
import Countdown from '../ui/Countdown';
import { MEMBERSHIP_SEATS_TAKEN, MEMBERSHIP_SEATS_TOTAL } from '../constants';
import { useMembershipProgram } from '../hooks/useMembershipProgram';

export default function HeroSection() {
  const { deadline } = useMembershipProgram();
  const [seats, setSeats] = useState(MEMBERSHIP_SEATS_TAKEN);

  useEffect(() => {
    const timer = setInterval(() => {
      if (Math.random() < 0.4) setSeats((s) => Math.max(12, s - 1));
    }, 9000);
    return () => clearInterval(timer);
  }, []);

  const seatsLeft = MEMBERSHIP_SEATS_TOTAL - seats;

  return (
    <section className="hero">
      <div className="wrap hero-in">
        <div>
          <div className="hero-chips he he1">
            <span className="eyebrow">2026 하반기 공채 시즌 한정</span>
          </div>
          <h1 className="he he2">
            자소서·인적성·면접
            <br />
            흩어진 취준을
            <br />
            <span className="hl">3개월 패스 하나로</span>
          </h1>
          <p className="lead he he3">
            7~9월, 공채가 몰리는 단 한 번의 시즌.
            <br />
            <b>가이드북·챌린지·렛츠런 스터디·VOD·1:1 멘토링</b>을
            <br />
            하나의 멤버십으로 묶어 합격까지 함께 달립니다.
          </p>
          <div className="hero-cta he he4">
            <button
              className="btn btn-primary btn-lg"
              onClick={() =>
                document
                  .getElementById('plans')
                  ?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              플랜 보기 →
            </button>
            <button
              className="btn btn-ghost btn-lg"
              onClick={() =>
                document
                  .getElementById('benefits')
                  ?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              혜택 먼저 보기
            </button>
          </div>
          <div className="hero-meta he he5">
            <span>
              📍 모집기간 <b className="num">2026.06.10 – 06.30</b> · 7~9월
              3개월 이용
            </span>
          </div>
        </div>

        <aside className="offer">
          <div className="tag">🔥 선착순 100명 한정 모집</div>
          <h3>마감까지 남은 시간</h3>
          <div className="cd" id="hero-cd">
            <Countdown deadline={deadline} />
          </div>
          <div className="seats-row">
            <span className="lbl">잔여 좌석</span>
            <span className="val pulse">
              <span className="num">{seatsLeft}</span> / 100석
            </span>
          </div>
          <div className="bar">
            <i
              style={{
                width: `${(seats / MEMBERSHIP_SEATS_TOTAL) * 100}%`,
              }}
            />
          </div>
          <p className="fine">마감 후 다음 모집은 2027 상반기 예정이에요.</p>
        </aside>
      </div>
    </section>
  );
}
