import { Link } from 'react-router-dom';

import { typeToText } from '../../../../../utils/converTypeToText';

import classes from './ClosedCard.module.scss';

interface ClosedCardProps {
  program: any;
}

const ClosedCard = ({ program }: ClosedCardProps) => {
  return (
    <Link to={`/program/detail/${program.id}`} className={classes.card}>
      <span>{typeToText[program.type]}</span>
      <h3 className={classes.title}>
        {program.title}
        <br />
        모집 마감
      </h3>
    </Link>
  );
};

export default ClosedCard;
