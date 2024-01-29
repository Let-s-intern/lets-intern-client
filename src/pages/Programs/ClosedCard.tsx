import { Link } from 'react-router-dom';

import { typeToText } from '../../utils/converTypeToText';

import './ClosedCard.scss';

interface ClosedCardProps {
  program: any;
}

const ClosedCard = ({ program }: ClosedCardProps) => {
  return (
    <Link to={`/program/detail/${program.id}`} className="closed-card">
      <span className="category">{typeToText[program.type]}</span>
      <h3>
        {program.title}
        <br />
        모집 마감
      </h3>
    </Link>
  );
};

export default ClosedCard;
