'use client';
import { useEffect, useRef } from 'react';

export default function RoadmapSection() {
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = timelineRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('in');
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="roadmap">
      <div className="wrap">
        <div className="sec-head rv">
          <span className="eyebrow">3개월 합격 로드맵</span>
          <h2>
            7월부터 9월까지,
            <br />
            공채 흐름에 맞춰 달려요
          </h2>
        </div>
        <div className="timeline" ref={timelineRef}>
          <div className="track"></div>
          <div className="tnodes">
            <div className="tnode">
              <div className="dot">7</div>
              <div className="mon">JULY</div>
              <h3>서류 완성</h3>
              <p>
                경험정리부터 이력서·자소서까지. 가이드북 + 챌린지로 합격 서류의
                뼈대를 만들어요.
              </p>
            </div>
            <div className="tnode">
              <div className="dot">8</div>
              <div className="mon">AUGUST</div>
              <h3>인적성·직무 준비</h3>
              <p>
                VOD와 렛츠런 스터디로 인적성·직무 역량을 다지고 지원 전략을
                세워요.
              </p>
            </div>
            <div className="tnode">
              <div className="dot">9</div>
              <div className="mon">SEPTEMBER</div>
              <h3>면접 마무리</h3>
              <p>
                1:1 현직자 멘토링과 면접 가이드로 마지막 관문까지 완주합니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
