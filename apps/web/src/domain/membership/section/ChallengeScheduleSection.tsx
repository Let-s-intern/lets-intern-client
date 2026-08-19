import {
  CHALLENGE_SCHEDULE,
  GANTT_ALT,
  GANTT_SIZE,
  GANTT_SRC,
  NOTICE_ALT,
  NOTICE_SIZE,
  NOTICE_SRC,
} from '../data/challengeSchedule';

/**
 * 챌린지 일정 — 헤더는 텍스트, 간트 패널과 안내 박스는 이미지.
 *
 * 두 이미지 모두 모서리가 투명한 라운드 패널이라 뒤 배경색은 CSS 가 깐다.
 * 그래야 이미지가 로드되기 전에도 자리와 색이 잡히고, 배경색만 따로 바꿀 수 있다.
 *
 * 크기는 `styles/challenge-schedule.css` 의 --gantt-width 하나로 조절한다.
 * `domain/membership` 은 `next/image` 를 쓰지 않으므로 width/height 를 직접 넣어 CLS 를 막는다.
 */
export default function ChallengeScheduleSection() {
  return (
    <section className="chsched" id="challenge-schedule">
      <div className="wrap">
        <div className="sec-head rv">
          <h2>{CHALLENGE_SCHEDULE.title}</h2>
          <p>{CHALLENGE_SCHEDULE.subtitle}</p>
        </div>

        {/* 스크롤 힌트(우측 페이드)는 스크롤과 함께 움직이면 안 되므로
            스크롤 컨테이너 밖의 형제로 두고 래퍼에 절대 배치한다. */}
        <div className="gantt-wrap rv">
          <div className="gantt-scroll">
            <img
              className="gantt-img"
              src={GANTT_SRC}
              alt={GANTT_ALT}
              width={GANTT_SIZE.width}
              height={GANTT_SIZE.height}
              loading="lazy"
              decoding="async"
            />
          </div>
          <span className="gantt-fade" aria-hidden />
        </div>

        <img
          className="gantt-notice rv"
          src={NOTICE_SRC}
          alt={NOTICE_ALT}
          width={NOTICE_SIZE.width}
          height={NOTICE_SIZE.height}
          loading="lazy"
          decoding="async"
        />
      </div>
    </section>
  );
}
