import { useNavigate, useParams } from 'react-router-dom';
import cn from 'classnames';

import classes from './StartContent.module.scss';
import { typeToText } from '../../../../../../../utils/converTypeToText';
import formatDateString from '../../../../../../../utils/formatDateString';

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
  const params = useParams();
  const navigate = useNavigate();

  const handleNextButtonClick = () => {
    if (
      !isLoggedIn &&
      (program.type === 'CHALLENGE_FULL' || program.type === 'CHALLENGE_HALF')
    ) {
      navigate(`/login?redirect=/program/detail/${params.programId}`);
    } else if (!participated && program.status === 'OPEN') {
      if (isLoggedIn) {
        setApplyPageIndex(2);
      } else {
        setApplyPageIndex(1);
      }
    }
  };

  const price =
    program.feeType === 'REFUND'
      ? program.feeCharge + program.feeRefund
      : program.feeType === 'CHARGE'
      ? program.feeCharge
      : 0;
  const discountAmount = program.discountValue;

  return (
    <div className={classes.content}>
      <h3 className="program-type">{typeToText[program.type]}</h3>
      <h2 className="program-title">{program.title}</h2>
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
        <>
          <ul className={classes['date-info-list']}>
            <li className={classes['date-info-item']}>
              <strong>모집 마감 일자</strong>{' '}
              {formatDateString(program.dueDate)}
            </li>
            <li className={classes['date-info-item']}>
              <strong>시작 일자</strong> {formatDateString(program.startDate)}
            </li>
            <li className={classes['date-info-item']}>
              <strong>종료 일자</strong> {formatDateString(program.endDate)}
            </li>
          </ul>
          {program.type === 'LETS_CHAT' && (
            <>
              <hr className="my-2" />
              <div className="flex items-center justify-between font-pretendard">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-semibold">결제 금액</span>
                  {program.feeType !== 'FREE' &&
                    discountAmount > 0 &&
                    price !== 0 && (
                      <span className="text-xs font-semibold text-red-500">
                        {Math.round((discountAmount / price) * 100)}%
                      </span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                  {program.feeType !== 'FREE' &&
                    discountAmount > 0 &&
                    price !== 0 && (
                      <span className="font-semibold text-zinc-400 line-through">
                        {price.toLocaleString()}원
                      </span>
                    )}
                  <span className="text-lg font-semibold">
                    {program.feeType === 'FREE' || price === 0 ? (
                      <>무료</>
                    ) : (
                      <>{(price - discountAmount).toLocaleString()}원</>
                    )}
                  </span>
                </div>
              </div>
            </>
          )}
        </>
      )}
      <button
        id="apply_button"
        className={cn(
          'apply-button',
          'next-button',
          classes['apply-start-button'],
          {
            disabled: participated || program.status !== 'OPEN',
          },
        )}
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
