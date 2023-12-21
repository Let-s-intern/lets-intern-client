import cn from 'classnames';

import styles from './StartContent.module.scss';
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
    <div className={styles.content}>
      <h3>{typeToText[program.type]}</h3>
      <h2>{program.title}</h2>
      <button
        onClick={handleNextButtonClick}
        className={cn({
          disabled: participated || program.status !== 'OPEN',
        })}
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
