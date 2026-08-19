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
 * 챌린지 일정 간트 — 헤더(텍스트) + 간트 통이미지 + 안내 박스(텍스트).
 *
 * 간트 본문만 통이미지고 나머지는 텍스트다. 이미지는 PC·모바일 공용 1장이며,
 * 좁은 폭에서는 `.gantt-scroll` 컨테이너 안에서만 가로로 스크롤된다(페이지는 스크롤되지 않는다).
 * `domain/membership` 은 `next/image` 를 쓰지 않으므로 width/height 를 직접 넣어 CLS 를 막는다.
 */
export default function ChallengeScheduleSection() {
  const { endDate } = useMembershipChallengeData();
  // "11월 30일" / "~ 11/30" 은 이미지가 아니라 연동 챌린지의 종료일에서 온다.
  const deadlineLabel = dayjs(endDate).format('M월 D일');
  const deadlineShort = dayjs(endDate).format('M/D');

  return (
    <section className="chsched">
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
              src={GANTT_SRC}
              alt={GANTT_ALT}
              width={GANTT_SIZE.width}
              height={GANTT_SIZE.height}
              loading="lazy"
              decoding="async"
              className="gantt-img"
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
