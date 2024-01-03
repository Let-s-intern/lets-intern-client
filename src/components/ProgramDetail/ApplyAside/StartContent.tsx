import cn from 'classnames';

import classes from './StartContent.module.scss';
import { typeToText } from '../../../libs/converTypeToText';

interface StartContentProps {
  program: any;
  participated: boolean;
  setApplyPageIndex: (applyPageIndex: number) => void;
}

const StartContent = ({
  program,
  participated,
  setApplyPageIndex,
}: StartContentProps) => {
  const handleNextButtonClick = () => {
    if (!participated && program.status === 'OPEN') {
      setApplyPageIndex(1);
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
