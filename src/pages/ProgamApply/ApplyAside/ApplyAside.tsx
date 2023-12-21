import { useState } from 'react';
import cn from 'classnames';

import './index.scss';

import styles from './ApplyAside.module.scss';
import StartContent from './StartContent';
import MemberSelect from './MemberSelect';
import InputContent from './InputContent';
import CautionContent from './CautionContent';
import ResultContent from './ResultContent';

interface ApplyAsdieProps {
  program: any;
}

const ApplyAside = ({ program }: ApplyAsdieProps) => {
  const [applyPageIndex, setApplyPageIndex] = useState(0);
  const [formData, setFormData] = useState<any>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [announcementDate, setAnnouncementDate] = useState<string>('');

  const handleModalClose = () => {
    if (applyPageIndex === 3) {
      setApplyPageIndex(0);
    } else {
      setApplyPageIndex(applyPageIndex - 1);
    }
  };

  let content;
  let modalContent;

  if (applyPageIndex === 0) {
    content = (
      <StartContent program={program} setApplyPageIndex={setApplyPageIndex} />
    );
    modalContent = null;
  } else if (applyPageIndex === 1) {
    content = (
      <StartContent program={program} setApplyPageIndex={setApplyPageIndex} />
    );
    modalContent = <MemberSelect setApplyPageIndex={setApplyPageIndex} />;
  } else if (applyPageIndex === 2) {
    content = (
      <InputContent
        program={program}
        formData={formData}
        isLoggedIn={isLoggedIn}
        setFormData={setFormData}
        setApplyPageIndex={setApplyPageIndex}
        setIsLoggedIn={setIsLoggedIn}
      />
    );
    modalContent = null;
  } else if (applyPageIndex === 3) {
    content = (
      <CautionContent
        program={program}
        formData={formData}
        isLoggedIn={isLoggedIn}
        setApplyPageIndex={setApplyPageIndex}
        setAnnouncementDate={setAnnouncementDate}
      />
    );
    modalContent = null;
  } else if (applyPageIndex === 4) {
    content = (
      <CautionContent
        program={program}
        formData={formData}
        isLoggedIn={isLoggedIn}
        setApplyPageIndex={setApplyPageIndex}
        setAnnouncementDate={setAnnouncementDate}
      />
    );
    modalContent = (
      <ResultContent
        announcementDate={announcementDate}
        setApplyPageIndex={setApplyPageIndex}
      />
    );
  }

  return (
    <>
      {modalContent && (
        <div className={styles['black-background']} onClick={handleModalClose}>
          <div className="modal">{modalContent}</div>
        </div>
      )}
      <aside className={styles['apply-aside']}>
        <div className={cn('apply-aside-content', styles.content)}>
          {content}
        </div>
      </aside>
    </>
  );
};

export default ApplyAside;
