import { useEffect, useState } from 'react';
import BenefitModal from '../ui/BenefitModal';
import { setOverlayOpen } from '../lib/headerSync';
import { BENEFIT_CARDS } from '../data/benefits';

export default function BenefitsSection() {
  const [openModalId, setOpenModalId] = useState<string | null>(null);

  // 혜택 모달이 열리면 부모 헤더를 숨겨 모달이 가려지지 않게 한다.
  useEffect(() => {
    setOverlayOpen(openModalId !== null);
  }, [openModalId]);

  return (
    <section className="benefits" id="benefits">
      <div className="wrap">
        <div className="sec-head rv">
          <span className="eyebrow">멤버십 혜택</span>
          <h2>하나의 멤버십으로 받는 혜택 8가지</h2>
          <p>공채 시즌에 꼭 필요한 것만 모두 모았습니다.</p>
        </div>
        <div className="bgrid">
          {BENEFIT_CARDS.map((card, i) => (
            <div
              className="bcard rv"
              key={card.id}
              style={{ ['--rvd' as string]: `${i * 0.08}s` }}
              onClick={() => setOpenModalId(card.id)}
            >
              <div className={`ic ${card.iconClass}`}>
                <span
                  className="ic-glyph"
                  style={{ ['--icon' as string]: `url(${card.iconSvg})` }}
                />
              </div>
              <h3>
                {card.title}
                {card.pill && (
                  <>
                    {' '}
                    <span className={`pill ${card.pill.cls}`}>
                      {card.pill.text}
                    </span>
                  </>
                )}
              </h3>
              <p>{card.desc}</p>
              <div
                className="tagline"
                style={card.taglineMuted ? { color: 'var(--g500)' } : undefined}
              >
                {card.tagline}
              </div>
              <button className="bcard-more">{card.more}</button>
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
