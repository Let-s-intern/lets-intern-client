import { SEMINAR_HEADER, SEMINAR_SESSIONS } from '../data/seminar';
import SeminarSessionCard from '../ui/SeminarSessionCard';

export default function SeminarSection() {
  return (
    <section className="seminar" id="seminar">
      <div className="wrap">
        <div className="sec-head rv">
          <span className="eyebrow">{SEMINAR_HEADER.badge}</span>
          <h2>{SEMINAR_HEADER.title}</h2>
          <p>{SEMINAR_HEADER.sub}</p>
        </div>

        <div className="sem-grid rv">
          {SEMINAR_SESSIONS.map((session) => (
            <SeminarSessionCard key={session.sessionNo} session={session} />
          ))}
        </div>
      </div>
    </section>
  );
}
