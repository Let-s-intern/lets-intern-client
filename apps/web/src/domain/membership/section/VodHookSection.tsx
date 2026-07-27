import { VOD_HOOK } from '../data/vodHook';

// 4각 반짝임(sparkle) 별 — 이모지 대신 브랜드 컬러로 자연스럽게 녹여낸다.
function Sparkle({ className }: { className?: string }) {
  return (
    <svg
      className={`vod-sparkle ${className ?? ''}`}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M12 0c.95 6.6 4.45 10.1 11 11-6.55.9-10.05 4.4-11 11-.95-6.6-4.45-10.1-11-11C7.55 10.1 11.05 6.6 12 0Z" />
    </svg>
  );
}

// 멤버십 신청 시 현직자 공채 준비 VOD 무료 제공 훅 섹션 (다크, 디자인 시스템 정렬).
export default function VodHookSection() {
  return (
    <>
      <section className="vod-hook">
        <div className="wrap">
          <div className="vod-head rv">
            <span className="eyebrow">{VOD_HOOK.eyebrow}</span>
            <h2>
              {VOD_HOOK.titleTop}
              <br />
              {VOD_HOOK.titleBottomLead}
              {/* 모바일에서만 줄바꿈: "…VOD를" 다음에서 끊어 "무료로 드려요"를 한 줄로 */}
              <br className="vod-br-m" />
              <span className="vod-free">
                <Sparkle className="vod-sparkle--sm" />
                <span className="vod-free-text">
                  {VOD_HOOK.titleBottomHighlight}
                </span>
                <Sparkle />
              </span>
              {VOD_HOOK.titleBottomTail}
            </h2>
          </div>

          <div className="vod-cards rv">
            {VOD_HOOK.cards.map((card) => (
              <article className="vod-card" key={card.title}>
                <img
                  className="vod-thumb-img"
                  src={card.thumbnailImage}
                  alt={card.thumbnailAlt}
                />

                <div className="vod-info">
                  <span className="vodhook-badge">{card.badge}</span>
                  <h3 className="vod-card-title">{card.title}</h3>
                  <ul className="vod-meta">
                    {card.meta.map((m) => (
                      <li key={m}>{m}</li>
                    ))}
                  </ul>
                  <ul className="vod-bullets">
                    {card.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                  <div className="vod-cardfoot">
                    <div className="vodhook-price">
                      <span className="vodhook-price-old">
                        {card.priceOriginal}
                      </span>
                      <span className="vodhook-price-free">
                        {card.priceFree}
                      </span>
                    </div>
                    <a
                      className="btn btn-blue vod-cta"
                      href={card.detailUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {card.cta}
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <p className="vod-foot rv">
            {VOD_HOOK.footnoteLead}
            <b>{VOD_HOOK.footnoteStrong}</b>
            {VOD_HOOK.footnoteTail}
            <br />
            <span className="vod-foot-sub">{VOD_HOOK.footnoteSub}</span>
          </p>
        </div>
      </section>

      <div className="vod-promo">{VOD_HOOK.promoStrip}</div>
    </>
  );
}
