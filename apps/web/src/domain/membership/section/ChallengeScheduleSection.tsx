import { GANTT_ALT } from '../data/challengeSchedule';

/**
 * 챌린지 일정 — 시안 5.png 를 섹션 통째로 넣는다.
 *
 * 헤더·간트·안내 박스를 텍스트와 이미지로 나눠 그리다가, 시안과 나란히 비교하기 위해
 * 시안 전체를 한 장으로 넣는 방식으로 바꿨다. 이미지 안에 텍스트가 들어가므로
 * `alt` 에 내용을 문장으로 담아 검색·스크린리더 손실을 메운다.
 *
 * 이 방식은 이용 기한("11월 30일")이 이미지에 박힌다는 뜻이다 —
 * 연동 챌린지의 `endDate` 가 바뀌어도 따라오지 않는다. 일정이 확정된 뒤에만 쓸 수 있다.
 *
 * 좁은 폭에서는 `.gantt-scroll` 안에서만 가로로 스크롤된다(페이지는 스크롤되지 않는다).
 * `domain/membership` 은 `next/image` 를 쓰지 않으므로 width/height 를 직접 넣어 CLS 를 막는다.
 */
const GANTT_FULL = {
  src: '/images/membership/gantt-full.webp',
  width: 2880,
  height: 1914,
};

export default function ChallengeScheduleSection() {
  return (
    <section className="chsched" id="challenge-schedule">
      <div className="wrap">
        <div className="gantt-wrap rv">
          <div className="gantt-scroll">
            <img
              src={GANTT_FULL.src}
              alt={GANTT_ALT}
              width={GANTT_FULL.width}
              height={GANTT_FULL.height}
              loading="lazy"
              decoding="async"
              className="gantt-img"
            />
          </div>
          <span className="gantt-fade" aria-hidden />
        </div>
      </div>
    </section>
  );
}
