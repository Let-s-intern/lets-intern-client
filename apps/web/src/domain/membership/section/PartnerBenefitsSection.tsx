import { useEffect, useState } from 'react';
import BenefitModal from '../ui/BenefitModal';
import { setOverlayOpen } from '../lib/headerSync';
import { PARTNER_CARDS } from '../data/partners';

export default function PartnerBenefitsSection() {
  const [openModalId, setOpenModalId] = useState<string | null>(null);

  // 모달이 열리면 부모 헤더를 숨겨 모달이 가려지지 않게 한다.
  useEffect(() => {
    setOverlayOpen(openModalId !== null);
  }, [openModalId]);

  return (
    <section className="partner-sec" id="partners">
      <div className="wrap">
        <div className="partner-head rv">
          <h2>
            🤝 멤버 전용 <span className="hl-p">제휴 서비스</span> 혜택
          </h2>
        </div>

        <div className="partner-list">
          {PARTNER_CARDS.map((card, i) => (
            <div
              className={`partner-card ${card.tone} rv`}
              key={card.id}
              style={{ ['--rvd' as string]: `${i * 0.08}s` }}
              onClick={() => setOpenModalId(card.id)}
            >
              <div className="partner-aside">
                {card.logoText ? (
                  <span className="partner-logo-text">
                    {card.logoText.pre}
                    <b>{card.logoText.accent}</b>
                  </span>
                ) : (
                  <img
                    className="partner-logo"
                    src={card.logo}
                    alt={card.logoAlt}
                    loading="lazy"
                  />
                )}
                <span className="partner-tag">{card.tag}</span>
              </div>

              <div className="partner-main">
                <h3 className="partner-title">
                  {card.title}
                  <span className="partner-new">NEW</span>
                </h3>
                <p className="partner-desc">{card.desc}</p>
                <div className="partner-chips">
                  {card.chips.map((chip) => (
                    <span className="partner-chip" key={chip}>
                      {chip}
                    </span>
                  ))}
                </div>
              </div>

              <div className="partner-cta">
                <span className="partner-cta-link">{card.cta}</span>
                <span className="partner-cta-sub">{card.ctaSub}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BenefitModal
        modalId={openModalId}
        onClose={() => setOpenModalId(null)}
      />
    </section>
  );
}
