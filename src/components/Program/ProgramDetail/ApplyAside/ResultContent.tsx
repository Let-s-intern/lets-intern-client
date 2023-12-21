import cn from 'classnames';

import styles from './ResultContent.module.scss';
import formatDateString from '../../../../libs/formatDateString';

interface MemberSelectProps {
  announcementDate: string;
  setApplyPageIndex: (applyPageIndex: number) => void;
}

const ResultContent = ({
  announcementDate,
  setApplyPageIndex,
}: MemberSelectProps) => {
  const handleCloseButtonClicked = () => {
    setApplyPageIndex(0);
  };

  return (
    <div
      className={styles.content}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <div className={styles.top}>
        <h3>제출이 완료되었습니다.</h3>
        <p>{formatDateString(announcementDate)}</p>
      </div>
      <button
        className={cn('complete-button', 'next-button')}
        onClick={handleCloseButtonClicked}
      >
        닫기
      </button>
    </div>
  );
};

export default ResultContent;
