import { CalendarDays } from 'lucide-react';
import {
  CHALLENGE_SCHEDULE,
  GANTT_ALT,
  GANTT_SIZE,
  GANTT_SRC,
} from '../data/challengeSchedule';
import dayjs from '../lib/dayjs';
import { useMembershipChallengeData } from '../lib/useMembershipChallengeData';

/**
 * 챌린지 일정 — 헤더와 안내 박스는 텍스트, 간트 패널만 이미지.
 *
 * 안내 박스는 한때 통이미지였다. 2000x193 짜리 가로로 긴 패널이라 375px 에서 335x32 로
 * 줄어 글자가 읽히지 않았다. 텍스트로 되돌려 어느 폭에서도 접히게 한다.
 * 덤으로 이용 기한이 이미지에 박히지 않고 연동 챌린지의 `endDate` 를 따라간다.
 *
 * 간트 패널은 모서리가 투명한 라운드 이미지라 뒤 배경색은 CSS 가 깐다.
 * 그래야 이미지가 로드되기 전에도 자리와 색이 잡히고, 배경색만 따로 바꿀 수 있다.
 *
 * 크기는 `styles/challenge-schedule.css` 의 --gantt-width 하나로 조절한다.
 * `domain/membership` 은 `next/image` 를 쓰지 않으므로 width/height 를 직접 넣어 CLS 를 막는다.
 */
export default function ChallengeScheduleSection() {
  const { endDate } = useMembershipChallengeData();
  // "11월 30일" / "~ 11/30" 은 연동 챌린지의 종료일에서 온다.
  const deadlineLabel = dayjs(endDate).format('M월 D일');
  const deadlineShort = dayjs(endDate).format('M/D');

  return (
    <section className="chsched" id="challenge-schedule">
      <div className="wrap">
        <div className="sec-head rv">
          <h2>
            {CHALLENGE_SCHEDULE.titleLines.map((line) => (
              <span className="brk" key={line}>
                {line}
              </span>
            ))}
          </h2>
          <p>
            {CHALLENGE_SCHEDULE.subtitleLines.map((line) => (
              <span className="brk" key={line}>
                {line}
              </span>
            ))}
          </p>
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

        <div className="chsched-notice rv">
          <div className="chsched-notice-text">
            <p className="chsched-notice-lead">
              {CHALLENGE_SCHEDULE.noticeLead}{' '}
              <strong>
                {deadlineLabel}
                {CHALLENGE_SCHEDULE.noticeHighlightSuffix}
              </strong>
            </p>
            <p className="chsched-notice-desc">
              {CHALLENGE_SCHEDULE.noticeDescription}
            </p>
          </div>

          <div className="chsched-period">
            <span className="chsched-period-ic" aria-hidden>
              <CalendarDays size={20} strokeWidth={2.2} />
            </span>
            <div className="chsched-period-body">
              <p className="chsched-period-label">
                {CHALLENGE_SCHEDULE.periodLabel}
              </p>
              <p className="chsched-period-value num">~ {deadlineShort}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
