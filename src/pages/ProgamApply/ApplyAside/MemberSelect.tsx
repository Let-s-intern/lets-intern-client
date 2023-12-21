import { useState } from 'react';
import cn from 'classnames';

import styles from './MemberSelect.module.scss';

interface MemberSelectProps {
  setApplyPageIndex: (applyPageIndex: number) => void;
}

const MemberSelect = ({ setApplyPageIndex }: MemberSelectProps) => {
  const [memberChecked, setMemberChecked] = useState<'USER' | 'GUEST' | ''>('');
  const [isNextButtonDisabled, setIsNextButtonDisabled] = useState(true);

  const handleMemberSelected = (newMemberValue: 'USER' | 'GUEST') => {
    setMemberChecked(newMemberValue);
    setIsNextButtonDisabled(false);
  };

  const handleNextButtonClicked = () => {
    if (!isNextButtonDisabled) {
      setApplyPageIndex(2);
    }
  };

  return (
    <div
      className={styles.content}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <div className={styles.top}>
        <ul>
          <li onClick={() => handleMemberSelected('USER')}>
            {memberChecked === 'USER' && (
              <i>
                <img src="/icons/check.svg" alt="체크" />
              </i>
            )}
            <span>회원 신청</span>
          </li>
          <li onClick={() => handleMemberSelected('GUEST')}>
            {memberChecked === 'GUEST' && (
              <i>
                <img src="/icons/check.svg" alt="체크" />
              </i>
            )}
            <span>비회원 신청</span>
          </li>
        </ul>
      </div>
      <button
        onClick={handleNextButtonClicked}
        className={cn('next-button', {
          disabled: isNextButtonDisabled,
        })}
      >
        다음
      </button>
    </div>
  );
};

export default MemberSelect;
