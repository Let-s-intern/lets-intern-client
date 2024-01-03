import { typeToText } from '../../libs/converTypeToText';

import './ClosedCard.scss';

interface ClosedCardProps {
  program: any;
}

const ClosedCard = ({ program }: ClosedCardProps) => {
  return (
    <div className="closed-card">
      <span className="category">{typeToText[program.type]}</span>
      <h3>
        {program.title}
        <br />
        모집 마감
      </h3>
    </div>
  );
};

export default ClosedCard;
