'use client';

import { useRouter } from 'next/navigation';

const BlogHomeButton = () => {
  const router = useRouter();
  return (
    <button
      className="blog_home rounded-full bg-neutral-90 px-6 py-5 font-bold text-neutral-0"
      onClick={() => {
        router.push('/blog/list');
      }}
    >
      블로그 홈
    </button>
  );
};

export default BlogHomeButton;
