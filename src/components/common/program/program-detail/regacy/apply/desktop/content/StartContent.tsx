import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import cn from 'classnames';

import classes from './StartContent.module.scss';
import { typeToText } from '../../../../../../../../utils/converTypeToText';
import formatDateString from '../../../../../../../../utils/formatDateString';
import StartPriceContent from '../../../ui/price/StartPriceContent';

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
  const params = useParams<{ programId: string }>();
  const router = useRouter();

  const handleNextButtonClick = () => {
    if (
      !isLoggedIn &&
      (program.type === 'CHALLENGE_FULL' || program.type === 'CHALLENGE_HALF')
    ) {
      router.push(`/login?redirect=/program/detail/${params.programId}`);
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
        <ul className={classes['date-info-list']}>
          <li className={classes['date-info-item']}>
            <strong>모집 마감 일자</strong> {formatDateString(program.dueDate)}
          </li>
          <li className={classes['date-info-item']}>
            <strong>시작 일자</strong> {formatDateString(program.startDate)}
          </li>
          <li className={classes['date-info-item']}>
            <strong>종료 일자</strong> {formatDateString(program.endDate)}
          </li>
        </ul>
      )}
      <StartPriceContent
        programFee={{
          feeType: program.feeType,
          feeCharge: program.feeCharge,
          feeRefund: program.feeRefund,
          discountValue: program.discountValue,
        }}
        topLine
      />
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
