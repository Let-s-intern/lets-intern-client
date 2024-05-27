import clsx from 'clsx';
import { useState } from 'react';
import { FaStar } from 'react-icons/fa';

const StarScore = () => {
  const [starScore, setStarScore] = useState(0);

  const handleStarClick = (th: number) => {
    if (starScore === th) {
      setStarScore(th - 1);
    } else {
      setStarScore(th);
    }
  };

  return (
    <div className="flex items-center justify-center gap-3">
      {Array.from({ length: 5 }, (_, index) => index + 1).map((th) => (
        <span
          key={th}
          className={clsx('cursor-pointer text-[2rem]', {
            'text-primary': th <= starScore,
            'text-neutral-75': th > starScore,
          })}
          onClick={() => handleStarClick(th)}
        >
          <FaStar />
        </span>
      ))}
    </div>
  );
};

export default StarScore;
