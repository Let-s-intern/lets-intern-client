'use client';

import { Link } from 'lucide-react';

function BlogLinkShareBtn() {
  return (
    <button
      className="flex items-center gap-1.5 rounded-full border border-neutral-80 px-3 py-2"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(
            window.location.origin + location.pathname,
          );
          alert('클립보드에 복사되었습니다.');
        } catch (err) {
          console.error(err);
        }
      }}
    >
      <Link width={16} height={16} color="#5C5F66" />
      <span className="text-xsmall14 font-medium">공유하기</span>
    </button>
  );
}

export default BlogLinkShareBtn;
