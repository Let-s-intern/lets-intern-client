import { useNavigate } from 'react-router-dom';
import cn from 'classnames';

import classes from './StartContent.module.scss';
import { typeToText } from '../../../utils/converTypeToText';

interface StartContentProps {
  program: any;
  participated: boolean;
  isLoggedIn: boolean;
  setApplyPageIndex: (applyPageIndex: number) => void;
}

const StartContent = ({
  program,
  participated,
  isLoggedIn,
  setApplyPageIndex,
}: StartContentProps) => {
  const navigate = useNavigate();

  const handleNextButtonClick = () => {
    if (
      !isLoggedIn &&
      (program.type === 'CHALLENGE_FULL' || program.type === 'CHALLENGE_HALF')
    ) {
      navigate('/login');
    } else if (!participated && program.status === 'OPEN') {
      if (isLoggedIn) {
        setApplyPageIndex(2);
      } else {
        setApplyPageIndex(1);
      }
    }
  };

  return (
    <div className={classes.content}>
      <h3>{typeToText[program.type]}</h3>
      <h2>{program.title}</h2>
      <button
        id="apply_button"
        className={cn('apply-button', {
          disabled: participated || program.status !== 'OPEN',
        })}
        onClick={handleNextButtonClick}
      >
        {program.status !== 'OPEN'
          ? '신청 마감'
          : participated
          ? '신청 완료'
          : '신청하기'}
      </button>
    </div>
  );
};

export default StartContent;
