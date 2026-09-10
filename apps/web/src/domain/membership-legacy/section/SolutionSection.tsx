import {
  BookOpen,
  Flag,
  MessagesSquare,
  MonitorPlay,
  Route,
  Users,
  type LucideIcon,
} from 'lucide-react';
import {
  SOLUTION,
  type SolutionSatellite,
  type SolutionSatelliteIcon,
} from '../data/solution';

const SATELLITE_ICONS: Record<SolutionSatelliteIcon, LucideIcon> = {
  flag: Flag,
  bookOpen: BookOpen,
  users: Users,
  monitorPlay: MonitorPlay,
  mentoring: MessagesSquare,
  route: Route,
};

/** 헤드라인 한 줄에서 강조 어절만 파란색(.hl)으로 감싼다. */
function HeadlineLine({
  line,
  highlight,
}: {
  line: string;
  highlight: string;
}) {
  const at = line.indexOf(highlight);
  if (at < 0) return <>{line}</>;
  return (
    <>
      {line.slice(0, at)}
      <span className="hl">{highlight}</span>
      {line.slice(at + highlight.length)}
    </>
  );
}

function SolutionSatelliteNode({ label, hint, icon }: SolutionSatellite) {
  const Icon = SATELLITE_ICONS[icon];
  return (
    <div className="hub-sat">
      <span className="hub-sat-ic" aria-hidden>
        <Icon size={20} strokeWidth={2.2} />
      </span>
      <span className="hub-sat-text">
        <span className="hub-sat-label">{label}</span>
        <span className="hub-sat-hint">{hint}</span>
      </span>
    </div>
  );
}

export default function SolutionSection() {
  return (
    <section className="solution" id="solution">
      <div className="wrap">
        <div className="sec-head rv in">
          <span className="eyebrow">{SOLUTION.badge}</span>
          {/* 마지막 줄(두 번째 문장)은 어느 폭에서도 새 줄이다 — .brk-line.
              앞의 두 줄은 601px 이상에서 붙어 시안 2.png 의 2줄이 된다 — .brk. */}
          <h2>
            {SOLUTION.titleLines.map((line, i) => (
              <span
                className={
                  i === SOLUTION.titleLines.length - 1 ? 'brk-line' : 'brk'
                }
                key={line}
              >
                <HeadlineLine line={line} highlight={SOLUTION.titleHighlight} />
              </span>
            ))}
          </h2>
        </div>

        {/* 허브 앤 스포크 — 위성 6종이 중앙 올인원 패스로 수렴 */}
        <div className="hub rv">
          {SOLUTION.satellites.map((sat) => (
            <SolutionSatelliteNode key={sat.label} {...sat} />
          ))}
          <div className="hub-core">
            <div className="hub-core-title">
              {SOLUTION.hubTitleLines.map((line, i) => (
                <span key={i}>
                  {line}
                  {i < SOLUTION.hubTitleLines.length - 1 && <br />}
                </span>
              ))}
            </div>
            <div className="hub-core-sub">{SOLUTION.hubSub}</div>
          </div>
        </div>

        <p className="hub-note rv">
          {SOLUTION.subLines.map((line, i) => (
            <span key={i}>
              {line}
              {i < SOLUTION.subLines.length - 1 && <br />}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
