'use client';

import { useRouter } from 'next/navigation';

const BlogHomeButton = () => {
  const router = useRouter();
  return (
    <button
      className="blog_home bg-neutral-90 text-neutral-0 rounded-full px-6 py-5 font-bold"
      onClick={() => {
        router.push('/blog/list');
      }}
    >
      블로그 홈
    </button>
  );
};

export default BlogHomeButton;
