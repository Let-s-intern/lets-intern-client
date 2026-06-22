// .timeline 진입 애니메이션은 MembershipAnimations 의 전역 IntersectionObserver 가
// 처리하므로 여기서 별도 observer 를 두지 않는다.
import { ROADMAP } from '../data/roadmap';

export default function RoadmapSection() {
  return (
    <section className="roadmap">
      <div className="wrap">
        <div className="sec-head rv">
          <span className="eyebrow">{ROADMAP.badge}</span>
          <h2>
            {ROADMAP.titleLines.map((line, i) => (
              <span key={i}>
                {line}
                {i < ROADMAP.titleLines.length - 1 && <br />}
              </span>
            ))}
          </h2>
        </div>
        <div className="timeline">
          <div className="track"></div>
          <div className="tnodes">
            {ROADMAP.nodes.map((node) => (
              <div className="tnode" key={node.dot}>
                <div className="dot">{node.dot}</div>
                <div className="mon">{node.mon}</div>
                <h3>{node.title}</h3>
                <p>{node.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
