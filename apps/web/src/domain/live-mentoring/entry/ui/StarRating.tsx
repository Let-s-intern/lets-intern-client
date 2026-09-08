'use client';

import { useState } from 'react';

/**
 * 별점 입력 — 1:1 멘토링 후기 모달이 쓴다.
 *
 * `domain/live-feedback`의 `StarRating`과 같은 모양이지만 임포트하지 않고 복제한다
 * (`.claude/rules/core.md` — `packages/ui` 공유 금지, 도메인별 복제).
 */
interface StarRatingProps {
  value: number;
  onChange: (v: number) => void;
}

const StarRating = ({ value, onChange }: StarRatingProps) => {
  const [hovered, setHovered] = useState(0);
  const active = hovered || value;

  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
        >
          <img
            src={
              active >= star
                ? '/icons/star-yellow.svg'
                : '/icons/star-unfill.svg'
            }
            alt={`별 ${star}개`}
            className="size-7"
          />
        </button>
      ))}
    </div>
  );
};

export default StarRating;
