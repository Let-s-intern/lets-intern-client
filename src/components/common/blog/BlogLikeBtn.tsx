'use client';

import { Heart } from 'lucide-react';
import { useState } from 'react';

const LIKE = 'like';

function BlogLikeBtn() {
  const [alreadyLike, setAlreadyLike] = useState(!!localStorage.getItem(LIKE));

  return (
    <button
      type="button"
      className="flex items-center gap-2"
      onClick={() => {
        if (alreadyLike) {
          console.log('Cancel like.');
          localStorage.removeItem(LIKE);
          setAlreadyLike(false);
        } else {
          console.log('Add like.');
          localStorage.setItem(LIKE, 'true');
          setAlreadyLike(true);
        }
      }}
    >
      <Heart
        width={20}
        height={20}
        color="#4D55F5"
        fill={alreadyLike ? '#4D55F5' : 'none'}
      />
      <span className="text-xsmall14 font-medium text-primary">좋아요 NNN</span>
    </button>
  );
}

export default BlogLikeBtn;
