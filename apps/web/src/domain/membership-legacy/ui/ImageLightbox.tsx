import { createPortal } from 'react-dom';
import type { ImageReview } from '../data/reviews';

interface ImageLightboxProps {
  review: ImageReview | null;
  onClose: () => void;
}

/** 후기 카드 클릭 시 카드 전체(출처·이미지·코멘트)를 확대해 보여주는 라이트박스
 *  — 이미지만이 아니라 카드 자체가 커진다. body 포털. */
export default function ImageLightbox({ review, onClose }: ImageLightboxProps) {
  if (!review) return null;
  if (typeof document === 'undefined') return null;

  return createPortal(
    // 포털은 .membership-root 밖(body)으로 나가므로 스코프드 CSS·변수를 받도록 래핑한다.
    <div className="membership-root">
      <div
        className="modal-ov lightbox-ov open"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <button
          className="modal-close lightbox-close"
          aria-label="닫기"
          onClick={onClose}
        >
          ✕
        </button>
        <article className="rev-card lightbox-card">
          <div className="rev-meta">
            <span className="src">
              <span className="dot"></span>
              {review.source}
            </span>
            <span className="badge">{review.badge}</span>
          </div>
          <div className="rev-shot">
            <img src={review.src} alt={review.alt} />
          </div>
          <div className="rev-quote">{review.quote}</div>
        </article>
      </div>
    </div>,
    document.body,
  );
}
