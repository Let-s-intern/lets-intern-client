import { ChallengePoint } from '@/types/interface';

const ChallengePointView = ({ point }: { point: ChallengePoint }) => {
  return (
    <div>
      <h2>Challenge Point</h2>
      <p>{point.weekText}</p>
      <ul>
        {point.list?.map((item) => (
          <li key={item.id}>
            <h3>{item.title}</h3>
            <p>{item.subtitle}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChallengePointView;
