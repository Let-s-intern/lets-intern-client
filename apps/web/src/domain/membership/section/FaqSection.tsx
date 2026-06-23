import { useState } from 'react';
import { FAQ_HEAD } from '../data/faq';
import { useMembershipChallengeData } from '../lib/useMembershipChallengeData';

export default function FaqSection() {
  const [openId, setOpenId] = useState<number | null>(null);
  const { faqItems } = useMembershipChallengeData();

  return (
    <section className="faq">
      <div className="wrap">
        <div className="sec-head">
          <span className="eyebrow">{FAQ_HEAD.badge}</span>
          <h2>{FAQ_HEAD.title}</h2>
        </div>
        <div className="faqlist">
          {faqItems.map((item) => (
            <div
              key={item.id}
              className={`fitem ${openId === item.id ? 'open' : ''}`}
            >
              <div
                className="q"
                onClick={() =>
                  setOpenId((cur) => (cur === item.id ? null : item.id))
                }
              >
                <span className="mk">Q</span>
                {item.question}
                <span className="ind">＋</span>
              </div>
              <div className="a">{item.answer}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
