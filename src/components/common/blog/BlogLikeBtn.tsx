'use client';

import { usePatchBlogDislike, usePatchBlogLike } from '@/api/blog';
import useAuthStore from '@/store/useAuthStore';
import { Heart } from 'lucide-react';
import { useParams, usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

const LIKE = 'like';

interface Props {
  likeCount: number;
}

function BlogLikeBtn({ likeCount }: Props) {
  const { id } = useParams<{ id: string }>();
  const likedBlogs = useRef<string[]>([]); // 이미 좋아요한 블로그 id 리스트
  const pathname = usePathname();

  const { isLoggedIn } = useAuthStore();
  const patchLikeMutation = usePatchBlogLike();
  const patchDislikeMutation = usePatchBlogDislike();

  const [alreadyLike, setAlreadyLike] = useState(false);
  // 좋아요 클릭 시 1씩 카운트하는 state
  const [countOne, setCountOne] = useState(0);

  /* 로컬 스토리지에서 좋아요 여부 확인 */
  useEffect(() => {
    const value = localStorage.getItem(LIKE);
    if (!value) return;

    likedBlogs.current = value.split(','); // 1,2,3,4 문자열
    if (likedBlogs.current.includes(id)) setAlreadyLike(true);
  }, [id]);

  return (
    <button
      type="button"
      className="blog_likes flex items-center gap-2"
      onClick={() => {
        if (alreadyLike) {
          // 좋아요 취소
          patchDislikeMutation.mutate(id);
          setCountOne((prev) => prev - 1);
          setAlreadyLike(false);

          const index = likedBlogs.current.findIndex((i) => i === id);
          likedBlogs.current = [
            ...likedBlogs.current.slice(0, index),
            ...likedBlogs.current.slice(index + 1),
          ];
        } else {
          // 좋아요
          patchLikeMutation.mutate(id);
          setCountOne((prev) => prev + 1);
          setAlreadyLike(true);
          likedBlogs.current.push(id);
        }

        localStorage.setItem(LIKE, likedBlogs.current.toString()); // 로컬 스토리지에 저장
      }}
    >
      <Heart
        width={20}
        height={20}
        color="#4D55F5"
        fill={alreadyLike ? '#4D55F5' : 'none'}
      />
      <span className="text-xsmall14 font-medium text-primary">
        좋아요 {likeCount + countOne}
      </span>
    </button>
  );
}

export default BlogLikeBtn;
