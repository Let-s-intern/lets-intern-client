import { Heart } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface LikeButtonProps {
  id: string;
  likeCount: number;
  storageKey?: string;
  onLike?: (id: string) => void;
  onDislike?: (id: string) => void;
  className?: string;
}

export default function LikeButton({
  id,
  likeCount,
  storageKey = 'like',
  onLike,
  onDislike,
  className,
}: LikeButtonProps) {
  const likedIds = useRef<string[]>([]);
  const [alreadyLike, setAlreadyLike] = useState(false);
  const [countOne, setCountOne] = useState(0);

  useEffect(() => {
    const value = localStorage.getItem(storageKey);
    if (value && id) {
      const list = value.split(',');
      likedIds.current = list;
      setAlreadyLike(list.includes(id));
    }
  }, [id, storageKey]);

  const handleClick = () => {
    if (alreadyLike) {
      onDislike?.(id);
      setCountOne((prev) => prev - 1);
      setAlreadyLike(false);
      likedIds.current = likedIds.current.filter((i) => i !== id);
    } else {
      onLike?.(id);
      setCountOne((prev) => prev + 1);
      setAlreadyLike(true);
      likedIds.current.push(id);
    }

    localStorage.setItem(storageKey, likedIds.current.toString());
  };

  return (
    <button
      type="button"
      className={className ?? 'flex items-center gap-2'}
      onClick={handleClick}
    >
      <Heart
        width={20}
        height={20}
        color="#4D55F5"
        fill={alreadyLike ? '#4D55F5' : 'none'}
      />
      <span className="text-xsmall14 text-primary font-medium">
        좋아요 {likeCount + countOne}
      </span>
    </button>
  );
}
