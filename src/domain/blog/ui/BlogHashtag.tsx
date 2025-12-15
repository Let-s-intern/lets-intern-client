'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const BlogHashtag = ({ text, tagId }: { text: string; tagId: number }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const onClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();

    // 현재 경로가 /blog/hashtag라면
    if (pathname === '/blog/hashtag') {
      const params = new URLSearchParams(searchParams as any);
      params.set('tagId', tagId.toString());
      router.push(`/blog/hashtag?${params.toString()}`);
      return;
    }

    router.push(`/blog/hashtag?tagId=${tagId}`);
  };
  return (
    <div
      className="flex cursor-pointer items-center justify-center rounded-full bg-[#F3F5FA] px-2.5 py-1 text-xsmall14 text-primary-dark"
      onClick={onClick}
    >
      #{text}
    </div>
  );
};

export default BlogHashtag;
