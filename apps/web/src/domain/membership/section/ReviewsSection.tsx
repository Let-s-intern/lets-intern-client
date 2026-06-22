import { useEffect, useState } from 'react';
import { IMAGE_REVIEWS, MISSION_REVIEWS } from '../data/reviews';
import type { ImageReview, MissionReview } from '../data/reviews';
import ImageLightbox from '../ui/ImageLightbox';
import { setOverlayOpen } from '../lib/headerSync';

const HALF = Math.ceil(MISSION_REVIEWS.length / 2);
const ROW_A = MISSION_REVIEWS.slice(0, HALF);
const ROW_B = MISSION_REVIEWS.slice(HALF);

/** 모바일(≤600px) 여부 — 데스크톱은 기존 그리드, 모바일은 마퀴로 렌더한다. */
function useIsMobile() {
  const query = '(max-width: 600px)';
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false,
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    setIsMobile(mq.matches);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return isMobile;
}

/** 이미지 후기 그리드 — 데스크톱 기존 디자인(3단 메이슨리). 카드를 클릭하면
 *  카드 전체가 확대되는 라이트박스를 연다. */
function ImageGrid({ onCardClick }: { onCardClick: (r: ImageReview) => void }) {
  return (
    <div className="review-grid">
      {IMAGE_REVIEWS.map((r, i) => (
        <div
          className="rev-card rv"
          key={r.src}
          style={{ ['--rvd' as string]: `${i * 0.08}s` }}
          onClick={() => onCardClick(r)}
        >
          <div className="rev-meta">
            <span className="src">
              <span className="dot"></span>
              {r.source}
            </span>
            <span className="badge">{r.badge}</span>
          </div>
          <div className="rev-shot">
            <img src={r.src} alt={r.alt} loading="lazy" />
          </div>
          <div className="rev-quote">{r.quote}</div>
        </div>
      ))}
    </div>
  );
}

/** 이미지 후기 마퀴 — 캡처 후기를 좌→우로 자동으로 흐르게 한다(CSS 애니메이션).
 *  드래그/스크롤은 없고, 카드를 탭하면 카드 전체가 확대되는 라이트박스를 연다.
 *  카드 배열을 두 번 이어 붙여 끊김 없이 순환한다. */
function ImageMarquee({
  onCardClick,
}: {
  onCardClick: (r: ImageReview) => void;
}) {
  return (
    <div className="rev-row">
      <div className="rev-track reverse">
        {[...IMAGE_REVIEWS, ...IMAGE_REVIEWS].map((r, i) => (
          <article
            className="rev-card rev-icard"
            key={i}
            onClick={() => onCardClick(r)}
          >
            <div className="rev-meta">
              <span className="src">
                <span className="dot"></span>
                {r.source}
              </span>
              <span className="badge">{r.badge}</span>
            </div>
            <div className="rev-shot">
              <img src={r.src} alt={r.alt} loading="eager" />
            </div>
            <div className="rev-quote">{r.quote}</div>
          </article>
        ))}
      </div>
    </div>
  );
}

/** 마퀴 한 줄 — 카드 배열을 두 번 이어 붙여 끊김 없는 무한 루프를 만든다.
 *  카드 마크업은 기존 qcard 디자인(기업 칩·날짜·프로그램·내용·이름)을 그대로 유지한다. */
function MarqueeRow({
  cards,
  reverse,
}: {
  cards: MissionReview[];
  reverse?: boolean;
}) {
  return (
    <div className="rev-row">
      <div className={`rev-track${reverse ? 'reverse' : ''}`}>
        {[...cards, ...cards].map((r, i) => (
          <article className="qcard rev-mcard" key={i}>
            <div className="qtop">
              <span className={`co ${r.chipColor}`}>{r.chip}</span>
              <span className="date">{r.date}</span>
            </div>
            <span className="prog">{r.program}</span>
            <p className="qbody">{r.body}</p>
            <div className="qby">{r.name}</div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default function ReviewsSection() {
  const [zoomReview, setZoomReview] = useState<ImageReview | null>(null);
  const isMobile = useIsMobile();

  // 라이트박스가 열리면 부모 헤더를 숨겨 카드가 가려지지 않게 한다.
  useEffect(() => {
    setOverlayOpen(zoomReview !== null);
  }, [zoomReview]);

  return (
    <section className="reviews" id="reviews">
      <div className="wrap">
        <div className="sec-head rv">
          <span className="eyebrow">실제 후기</span>
          <h2>
            렛츠커리어와 함께
            <br />
            취뽀한 분들의 진짜 이야기
          </h2>
          <p>
            인스타그램, 오픈채팅, 챌린지 커뮤니티에 직접 남겨주신 후기를 그대로
            가져왔어요.
          </p>
        </div>
        {isMobile ? (
          <div className="rev-marquee">
            <ImageMarquee onCardClick={(r) => setZoomReview(r)} />
          </div>
        ) : (
          <ImageGrid onCardClick={(r) => setZoomReview(r)} />
        )}

        <div className="rev-sub">
          <h3>렛츠커리어에서 공채 준비한 후기</h3>
          <p>
            챌린지부터 현직자 멘토링까지, 실제 렛츠커리어에서 공채를 준비하신
            분들이 남겨주신 회고를 모았어요.
          </p>
        </div>
        <div className="rev-marquee">
          <MarqueeRow cards={ROW_A} />
          <MarqueeRow cards={ROW_B} reverse />
        </div>

        <p className="rev-note">
          ※ 실제 수강생이 인스타그램·오픈채팅·챌린지 커뮤니티에 남긴 후기를
          캡처한 것으로, 게시 동의를 받은 내용이에요. 개인정보는 가려서
          사용해요.
        </p>
      </div>

      <ImageLightbox review={zoomReview} onClose={() => setZoomReview(null)} />
    </section>
  );
}
