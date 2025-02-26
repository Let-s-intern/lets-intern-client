'use client';

import { usePostBlogLike } from '@/api/blog';
import useAuthStore from '@/store/useAuthStore';
import { Heart } from 'lucide-react';
import { redirect, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const LIKE = 'like';

interface Props {
  likeCount: number;
  blogId: number | string;
}

function BlogLikeBtn({ likeCount, blogId }: Props) {
  //const likedBlogs = useRef<string[]>([]); // 이미 좋아요한 블로그 id 리스트

  // const [alreadyLike, setAlreadyLike] = useState(false);
  // 좋아요 클릭 시 1을 카운트하는 state (블로그 내용 전체를 invalidate하지 않기 위함)
  const [countOne, setCountOne] = useState(0);

  const { isLoggedIn } = useAuthStore();

  const pathname = usePathname();
  const postLikeMutation = usePostBlogLike();

  /* 로컬 스토리지에서 좋아요 여부 확인 */
  useEffect(() => {
    const value = localStorage.getItem(LIKE);
    if (!value) return;

    //likedBlogs.current = value.split(','); // 1,2,3,4 문자열
    //if (likedBlogs.current.includes(String(blogId))) setAlreadyLike(true);
  }, [blogId]);

  return (
    <button
      type="button"
      className="flex items-center gap-2"
      onClick={async () => {
        if (!isLoggedIn) {
          // 비회원 리다이렉트
          const params = new URLSearchParams();
          params.set('redirect', pathname);
          redirect(`/login?redirect=${encodeURIComponent(pathname)}`);
        }

        try {
          // if (alreadyLike) return; // 좋아요 취소 못 함
          await postLikeMutation.mutateAsync(blogId);
          setCountOne(1);
          //likedBlogs.current.push(String(blogId));
          // localStorage.setItem(LIKE, likedBlogs.current.toString());
          // setAlreadyLike(true);
        } catch (err) {}
      }}
    >
      <Heart
        width={20}
        height={20}
        color="#4D55F5"
        fill="#4D55F5"
        // fill={alreadyLike ? '#4D55F5' : 'none'}
      />
      <span className="text-xsmall14 font-medium text-primary">
        좋아요 {likeCount + countOne}
      </span>
    </button>
  );
}

export default BlogLikeBtn;
