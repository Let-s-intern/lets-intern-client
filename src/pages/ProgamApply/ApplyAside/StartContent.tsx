import styles from './StartContent.module.scss';
import { typeToText } from '../../../libs/converTypeToText';

interface StartContentProps {
  program: any;
  setApplyPageIndex: (applyPageIndex: number) => void;
}

const StartContent = ({ program, setApplyPageIndex }: StartContentProps) => {
  const handleNextButtonClick = () => {
    setApplyPageIndex(1);
  };

  return (
    <div className={styles.content}>
      <h3>{typeToText[program.type]}</h3>
      <h2>{program.title}</h2>
      <button onClick={handleNextButtonClick}>신청하기</button>
    </div>
  );
};

export default StartContent;
