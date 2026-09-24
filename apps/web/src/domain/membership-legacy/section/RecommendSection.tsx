import { Check } from 'lucide-react';
import { RECOMMEND, type RecommendColumn } from '../data/recommend';

// 추천 컬럼 1개 — 뱃지 + 페인포인트 + 공감 항목 카드 묶음.
function RecommendCol({ badge, painLead, painRest, items }: RecommendColumn) {
  return (
    <div className="rec-col">
      <span className="rec-badge">{badge}</span>
      <div className="rec-pain">
        <span className="q">{painLead}</span>
        {painRest}
      </div>
      <div className="rec-cards">
        {items.map((text) => (
          <div className="rec-item" key={text}>
            <span className="ck" aria-hidden>
              <Check size={16} strokeWidth={3} />
            </span>
            <p>{text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function RecommendSection() {
  return (
    <section className="recommend">
      {/* 우하단 데코 워터마크 — 렛츠커리어 블롭(블루, 저투명) */}
      <svg
        className="rec-watermark"
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <g transform="translate(100 100)" fill="var(--lc-blue)">
          <path
            d="M0 -80 C 37 -29 37 27 0 56 C -37 27 -37 -29 0 -80 Z"
            transform="rotate(-26)"
          />
          <path
            d="M0 -80 C 37 -29 37 27 0 56 C -37 27 -37 -29 0 -80 Z"
            transform="rotate(26)"
            opacity=".6"
          />
          <path d="M0 -92 C 33 -37 33 29 0 64 C -33 29 -33 -37 0 -92 Z" />
        </g>
      </svg>

      <div className="wrap">
        <div className="sec-head rv">
          <span className="eyebrow">{RECOMMEND.badge}</span>
          <h2>
            {RECOMMEND.titleLines.map((line, i) => (
              <span key={i}>
                {line}
                {i < RECOMMEND.titleLines.length - 1 && <br />}
              </span>
            ))}
          </h2>
          <p>
            {RECOMMEND.sub.split('\n').map((line, i) => (
              <span key={i}>
                {line}
                {i === 0 && <br />}
              </span>
            ))}
          </p>
        </div>

        <div className="rec-row rv">
          {RECOMMEND.columns.map((col) => (
            <RecommendCol key={col.badge} {...col} />
          ))}
        </div>
      </div>
    </section>
  );
}
