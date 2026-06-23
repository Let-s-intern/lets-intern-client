import { CalendarDays, TriangleAlert } from 'lucide-react';
import type { SeminarSession } from '../data/seminar';

// 커리큘럼 한 줄 — 번호 + 주제 + 소요 시간.
function AgendaRow({
  no,
  title,
  duration,
}: SeminarSession['agenda'][number]) {
  return (
    <li className="sem-ag-row">
      <span className="sem-ag-no">{no}</span>
      <span className="sem-ag-title">{title}</span>
      <span className="sem-ag-dur">{duration}</span>
    </li>
  );
}

// 멘토 카드 — 이니셜 아바타 + 이름·소속 + 한 줄 이력.
function MentorCard({ mentor }: { mentor: SeminarSession['mentor'] }) {
  const initial = mentor.name.trim().charAt(0);
  return (
    <div className="sem-mentor">
      <div className="sem-mentor-avatar" aria-hidden>
        <span className="sem-mentor-initial">{initial}</span>
      </div>
      <div className="sem-mentor-body">
        <p className="sem-mentor-name">
          {mentor.name} 멘토 · {mentor.role}
        </p>
        <p className="sem-mentor-profile">{mentor.profile}</p>
      </div>
    </div>
  );
}

export default function SeminarSessionCard({
  session,
}: {
  session: SeminarSession;
}) {
  return (
    <article className="sem-card" data-theme={session.theme}>
      <div className="sem-thumb">
        <img src={session.heroImage} alt={session.heroAlt} loading="lazy" />
      </div>

      <div className="sem-body">
        <div className="sem-meta">
          <span className="sem-session">SESSION {session.sessionNo}</span>
          <span className="sem-date">
            <CalendarDays size={15} strokeWidth={2.2} aria-hidden />
            <span className="sem-date-day">{session.date}</span>
            <span className="sem-date-time">{session.time}</span>
          </span>
        </div>

        <h3 className="sem-title">{session.title}</h3>
        <p className="sem-desc">{session.description}</p>

        <ol className="sem-agenda">
          {session.agenda.map((item) => (
            <AgendaRow key={item.no} {...item} />
          ))}
        </ol>

        {session.notice && (
          <p className="sem-notice">
            <TriangleAlert size={15} strokeWidth={2.2} aria-hidden />
            {session.notice}
          </p>
        )}

        <MentorCard mentor={session.mentor} />

        <a
          className="btn sem-cta"
          href={session.ctaHref}
          target="_blank"
          rel="noopener"
        >
          {session.ctaLabel} →
        </a>
      </div>
    </article>
  );
}
