import {
  TBA_PLACEHOLDER,
  type SeminarMentor,
  type SeminarSession,
} from '../data/seminar';

// 미정 필드 placeholder 한 줄 — "추후 공개"를 빈 값이 아닌 1급 상태로 표시.
function PlaceholderRow({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="sem-row is-tba">
      <span className="sem-row-icon" aria-hidden>
        {icon}
      </span>
      <span className="sem-row-text">{text}</span>
      <span className="sem-soon-pill">추후 공개</span>
    </div>
  );
}

// 확정 정보 한 줄 (날짜·시간·주제).
function InfoRow({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="sem-row">
      <span className="sem-row-icon" aria-hidden>
        {icon}
      </span>
      <span className="sem-row-text">{text}</span>
    </div>
  );
}

// 멘토 신뢰 카드 — 사진(없으면 이니셜) + 이름 + 한 줄 이력.
function MentorCard({ mentor }: { mentor: SeminarMentor }) {
  const initial = mentor.name.trim().charAt(0);
  return (
    <div className="sem-mentor">
      <div className="sem-mentor-avatar" aria-hidden>
        {mentor.image ? (
          <img src={mentor.image} alt="" />
        ) : (
          <span className="sem-mentor-initial">{initial}</span>
        )}
      </div>
      <div className="sem-mentor-body">
        <p className="sem-mentor-name">
          {mentor.name}
          <span className="sem-mentor-tag">현직자 멘토</span>
        </p>
        <p className="sem-mentor-profile">{mentor.profile}</p>
      </div>
    </div>
  );
}

// 멘토 미정 placeholder — 확정 카드의 멘토 영역과 동일한 자리를 채워 위계 유지.
function MentorPlaceholder() {
  return (
    <div className="sem-mentor is-tba">
      <div className="sem-mentor-avatar" aria-hidden>
        <span className="sem-mentor-initial">?</span>
      </div>
      <div className="sem-mentor-body">
        <p className="sem-mentor-name">{TBA_PLACEHOLDER.mentor}</p>
        <p className="sem-mentor-profile">
          현직자 멘토를 섭외 중이에요. 곧 공개됩니다.
        </p>
      </div>
    </div>
  );
}

// CTA — 링크 있으면 신규 탭 버튼, 없으면 "준비 중" 비활성 버튼.
function SeminarCta({
  label,
  href,
  status,
}: {
  label: string;
  href?: string;
  status: SeminarSession['status'];
}) {
  const variant = status === 'confirmed' ? 'btn-primary' : 'btn-blue';

  if (!href) {
    return (
      <button className="btn sem-cta" type="button" disabled>
        {label} <span className="sem-cta-note">(오픈 예정)</span>
      </button>
    );
  }

  return (
    <a
      className={`btn ${variant} sem-cta`}
      href={href}
      target="_blank"
      rel="noopener"
    >
      {label}
    </a>
  );
}

function ConfirmedBody({ session }: { session: SeminarSession }) {
  return (
    <>
      <div className="sem-rows">
        {session.date && <InfoRow icon="📅" text={session.date} />}
        {session.time && <InfoRow icon="⏰" text={session.time} />}
        {session.topic && <InfoRow icon="🎯" text={session.topic} />}
      </div>
      {session.mentor && <MentorCard mentor={session.mentor} />}
    </>
  );
}

function TbaBody({ session }: { session: SeminarSession }) {
  return (
    <>
      <div className="sem-rows">
        <InfoRow icon="📅" text={session.date ?? TBA_PLACEHOLDER.time} />
        <PlaceholderRow icon="⏰" text={TBA_PLACEHOLDER.time} />
        <PlaceholderRow icon="🎯" text={TBA_PLACEHOLDER.topic} />
      </div>
      <MentorPlaceholder />
    </>
  );
}

export default function SeminarSessionCard({
  session,
}: {
  session: SeminarSession;
}) {
  const isConfirmed = session.status === 'confirmed';

  return (
    <article className="sem-card" data-status={session.status}>
      <header className="sem-card-head">
        <span className="sem-live">
          <span className="sem-live-dot" aria-hidden />
          LIVE {session.sessionNo}
        </span>
        <span className={`sem-status ${isConfirmed ? 'is-open' : 'is-soon'}`}>
          {isConfirmed ? '신청 가능' : '오픈 예정'}
        </span>
      </header>

      {isConfirmed ? (
        <ConfirmedBody session={session} />
      ) : (
        <TbaBody session={session} />
      )}

      <SeminarCta
        label={session.ctaLabel}
        href={session.ctaHref}
        status={session.status}
      />
    </article>
  );
}
