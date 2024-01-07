import { useNavigate } from 'react-router-dom';
import cn from 'classnames';

import classes from './StartContent.module.scss';
import { typeToText } from '../../../utils/converTypeToText';
import formatDateString from '../../../utils/formatDateString';

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

      {program.type === 'CHALLENGE_FULL' ||
      program.type === 'CHALLENGE_HALF' ? (
        <ul className={classes['date-info-list']}>
          <li className={classes['date-info-item']}>
            <strong>모집 마감 일자</strong> {formatDateString(program.dueDate)}
          </li>
          <li className={classes['date-info-item']}>
            <strong>합격자 발표 일자</strong>{' '}
            {formatDateString(program.announcementDate)}
          </li>
          <li className={classes['date-info-item']}>
            <strong>챌린지 OT 일시</strong>{' '}
            {formatDateString(program.startDate)}
          </li>
          <li className={cn(classes['date-info-item'], classes['timespan'])}>
            <strong>챌린지 진행 기간</strong>
            {formatDateString(program.startDate, {
              date: true,
              weekday: true,
              time: false,
            })}{' '}
            ~{' '}
            {formatDateString(program.endDate, {
              date: true,
              weekday: true,
              time: false,
            })}
          </li>
        </ul>
      ) : (
        <ul className={classes['date-info-list']}>
          <li className={classes['date-info-item']}>
            <strong>모집 마감 일자</strong> {formatDateString(program.dueDate)}
          </li>
          <li className={classes['date-info-item']}>
            <strong>합격자 발표 일자</strong>{' '}
            {formatDateString(program.announcementDate)}
          </li>
          <li className={classes['date-info-item']}>
            <strong>시작 일자</strong> {formatDateString(program.startDate)}
          </li>
          <li className={classes['date-info-item']}>
            <strong>종료 일자</strong> {formatDateString(program.endDate)}
          </li>
        </ul>
      )}

      <button
        id="apply_button"
        className={cn('apply-button', classes['apply-start-button'], {
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
