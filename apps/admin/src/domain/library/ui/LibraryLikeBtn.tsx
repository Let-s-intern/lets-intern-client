import { useMagnetLikeMutation } from '@/api/magnet/magnet';
import LikeButton from '@/common/button/LikeButton';
import { useParams } from 'react-router-dom';

interface Props {
  likeCount: number;
}

function LibraryLikeBtn({ likeCount }: Props) {
  const { id } = useParams<{ id: string }>();
  const likeMutation = useMagnetLikeMutation();

  return (
    <LikeButton
      id={id}
      likeCount={likeCount}
      storageKey="library_like"
      onLike={() => likeMutation.mutate(id)}
    />
  );
}

export default LibraryLikeBtn;
