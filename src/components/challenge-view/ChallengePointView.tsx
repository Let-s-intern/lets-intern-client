import { ChallengePoint } from '@/types/interface';
import Heading2 from '@components/common/program/program-detail/Heading2';
// import Balancer from 'react-wrap-balancer';
import { clientOnly } from 'vike-react/clientOnly';

const Balancer = clientOnly(() => import('react-wrap-balancer'));

const ChallengePointView = ({
  point,
  className,
}: {
  point: ChallengePoint;
  className?: string;
}) => {
  if (point === undefined) return <></>;

  return (
    <section className={className}>
      <h2 className="sr-only">챌린지 포인트</h2>
      <Heading2 className="mb-10 break-keep">
        이력서 & 자기소개서 챌린지를 통해
        <br />
        <span className="text-[rgba(255,156,52,1)]">하루 30분</span>, 단{' '}
        {point.weekText} 안에 이런걸
        <br className="lg:hidden" />
        얻어갈 수 있어요
      </Heading2>

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
                <Balancer fallback={<span>{item.title}</span>}>
                  {item.title}
                </Balancer>
              </h3>
              <p className="break-keep text-center text-xsmall16 font-medium text-neutral-40">
                <Balancer fallback={<span>{item.subtitle}</span>}>
                  {item.subtitle}
                </Balancer>
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default ChallengePointView;
