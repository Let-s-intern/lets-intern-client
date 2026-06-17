import { usePatchBlogDislike, usePatchBlogLike } from '@/api/blog/blog';
import LikeButton from '@/common/button/LikeButton';
import { useParams } from 'react-router-dom';

interface Props {
  likeCount: number;
}

function BlogLikeBtn({ likeCount }: Props) {
  const { id } = useParams<{ id: string }>();
  const patchLikeMutation = usePatchBlogLike();
  const patchDislikeMutation = usePatchBlogDislike();

  return (
    <LikeButton
      id={id}
      likeCount={likeCount}
      storageKey="like"
      className="blog_likes flex items-center gap-2"
      onLike={(id) => patchLikeMutation.mutate(id)}
      onDislike={(id) => patchDislikeMutation.mutate(id)}
    />
  );
}

export default BlogLikeBtn;
