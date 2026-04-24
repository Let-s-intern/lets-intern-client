import clsx from 'clsx';
import { Fragment } from 'react/jsx-runtime';

interface TenScoreProps {
  tenScore: number | null;
  setTenScore?: (tenScore: number | null) => void;
}

const TenScore = ({ tenScore, setTenScore }: TenScoreProps) => {
  const handleTenScoreClick = (th: number) => {
    if (!setTenScore) return;

    if (tenScore === th) {
      setTenScore(null);
    } else {
      setTenScore(th);
    }
  };

  return (
    <div className="flex items-center justify-center">
      {Array.from({ length: 11 }, (_, index) => index).map((th) => {
        if (th === 0) return <Fragment key={th}></Fragment>; // 0점 제외

        return (
          <div
            key={th}
            className={clsx(
              'flex h-8 w-8 cursor-pointer items-center justify-center font-medium text-neutral-0 md:h-12 md:w-12 md:text-small18',
              {
                'bg-primary text-white': th === tenScore,
                'border border-r-0 border-primary-xlight bg-white last:border-r':
                  th !== tenScore,
              },
            )}
            onClick={() => handleTenScoreClick(th)}
          >
            {th}
          </div>
        );
      })}
    </div>
  );
};

export default TenScore;
