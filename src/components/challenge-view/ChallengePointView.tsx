import { ChallengePoint } from '@/types/interface';
import Balancer from 'react-wrap-balancer';

const ChallengePointView = ({
  point,
  className,
}: {
  point: ChallengePoint;
  className?: string;
}) => {
  return (
    <div className={className}>
      <h2 className="sr-only">챌린지 포인트</h2>
      <p className="mb-10 break-keep text-small20 font-bold text-neutral-0 sm:mb-20">
        이력서 & 자기소개서 챌린지를 통해{' '}
        <span className="text-[rgba(255,156,52,1)]">하루 30분</span>, 단{' '}
        {point.weekText} 안에 이런걸 얻어갈 수 있어요
      </p>
      <ul className="space-y-4">
        {point.list?.map((item, index) => (
          <li
            key={item.id}
            className="flex flex-col items-center gap-4 self-stretch rounded-md bg-[#EEFAFF] px-8 pb-10 pt-8"
          >
            <div className="break-keep text-center">
              <span className="rounded-md bg-[#14BCFF] px-3.5 py-1.5 text-small18 font-semibold text-white">
                Point {index + 1}
              </span>
            </div>
            <div>
              <h3 className="mb-2 break-keep text-center text-small20 font-bold text-neutral-0">
                <Balancer>{item.title}</Balancer>
              </h3>
              <p className="break-keep text-center text-xsmall16 font-medium text-neutral-40">
                <Balancer>{item.subtitle}</Balancer>
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChallengePointView;
