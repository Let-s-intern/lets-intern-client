// .timeline 진입 애니메이션(트랙 드로우)은 MembershipAnimations 의 전역
// IntersectionObserver 가 처리하므로 여기서 별도 observer 를 두지 않는다.
import {
  Check,
  ClipboardCheck,
  FileText,
  Flag,
  MessagesSquare,
  UserRoundCheck,
  type LucideIcon,
} from 'lucide-react';
import type { CSSProperties } from 'react';
import { ROADMAP, type RoadmapIcon, type RoadmapNode } from '../data/roadmap';

const NODE_ICONS: Record<RoadmapIcon, LucideIcon> = {
  fileText: FileText,
  clipboardCheck: ClipboardCheck,
  messagesSquare: MessagesSquare,
  userRoundCheck: UserRoundCheck,
  flag: Flag,
};

/** 지그재그 한 칸. --rmap-col 로 자기 열을 지정하고 side 로 트랙 위/아래를 고른다. */
function RoadmapTimelineNode({
  node,
  column,
}: {
  node: RoadmapNode;
  column: number;
}) {
  const Icon = NODE_ICONS[node.icon];
  return (
    <div
      className="rmap-node"
      data-side={node.side}
      style={{ '--rmap-col': column } as CSSProperties}
    >
      <span className="rmap-step">
        {node.step ?? <Check size={18} strokeWidth={3} aria-hidden="true" />}
      </span>
      <div className="rmap-card">
        <div className="rmap-card-head">
          <span className="rmap-chip">{node.dateChip}</span>
          <span className="rmap-icon">
            <Icon size={20} strokeWidth={2} aria-hidden="true" />
          </span>
        </div>
        <h3>{node.title}</h3>
        <p>{node.body}</p>
      </div>
    </div>
  );
}

export default function RoadmapSection() {
  return (
    <section className="roadmap">
      <div className="wrap">
        <div className="sec-head rv">
          <span className="eyebrow">{ROADMAP.badge}</span>
          <h2>
            {ROADMAP.titleLines.map((line, i) => (
              <span key={line}>
                {line}
                {i < ROADMAP.titleLines.length - 1 && <br />}
              </span>
            ))}
          </h2>
          <p>{ROADMAP.sub}</p>
        </div>
        <div className="timeline">
          <div className="rmap-nodes">
            <div className="track" />
            {ROADMAP.nodes.map((node, i) => (
              <RoadmapTimelineNode
                key={node.title}
                node={node}
                column={i + 1}
              />
            ))}
          </div>
        </div>
        <div className="rmap-outro rv">
          <p className="rmap-outro-lead">
            {ROADMAP.outro.lead}
            <span className="hl">{ROADMAP.outro.highlight}</span>
          </p>
          <p className="rmap-outro-sub">{ROADMAP.outro.sub}</p>
        </div>
      </div>
    </section>
  );
}
