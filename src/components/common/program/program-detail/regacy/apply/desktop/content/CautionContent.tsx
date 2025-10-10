import { useQueryClient } from '@tanstack/react-query';
import cn from 'classnames';
import clsx from 'clsx';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import axios from '../../../../../../../../utils/axios';
import { typeToText } from '../../../../../../../../utils/converTypeToText';
import CautionPriceContent from '../../../ui/price/CautionPriceContent';
import styles from './CautionContent.module.scss';

interface CautionContentProps {
  program: any;
  formData: any;
  isLoggedIn: boolean;
  setApplyPageIndex: (applyPageIndex: number) => void;
  setAnnouncementDate: (announcedmentDate: string) => void;
  couponDiscount: number;
}

/** @deprecated */
const CautionContent = ({
  program,
  formData,
  isLoggedIn,
  setApplyPageIndex,
  setAnnouncementDate,
  couponDiscount,
}: CautionContentProps) => {
  const params = useParams<{ programId: string }>();
  const queryClient = useQueryClient();
  const [error, setError] = useState<unknown>();
  const [message, setMessage] = useState('');

  const handleApplySubmit = async () => {
    setMessage('신청 작업을 진행 중입니다.');
    try {
      let newUser = { ...formData, grade: Number(formData.grade) };
      if (program.way !== 'ALL') {
        delete newUser.way;
      }
      if (!isLoggedIn) {
        delete newUser.name;
        delete newUser.email;
        delete newUser.phoneNum;
        newUser = {
          ...newUser,
          guestName: formData.name,
          guestEmail: formData.email,
          guestPhoneNum: formData.phoneNum,
        };
      }
      const res = await axios.post(
        `/application/${params.programId}`,
        newUser,
        {
          headers: {
            Authorization: isLoggedIn
              ? `Bearer ${localStorage.getItem('access-token')}`
              : '',
          },
        },
      );
      setMessage('신청 작업이 완료되었습니다.');
      setAnnouncementDate(res.data.announcementDate);
      setApplyPageIndex(4);
      queryClient.invalidateQueries({
        queryKey: ['program', params.programId],
      });
    } catch (error) {
      setError(error);
      if ((error as any).response.status === 400) {
        setMessage((error as any).response.data.reason);
      } else {
        setMessage('신청 작업 도중 오류가 발생했습니다.');
      }
    }
  };

  return (
    <div className={styles.content}>
      <h3 className="program-type">{typeToText[program.type]}</h3>
      <h2 className="program-title">{program.title}</h2>
      <h4>[필독사항]</h4>
      <p>{program.notice}</p>
      <CautionPriceContent
        program={{
          feeType: program.feeType,
          feeCharge: program.feeCharge,
          feeRefund: program.feeRefund,
          discountValue: program.discountValue,
          accountType: program.accountType,
          accountNumber: program.accountNumber,
          feeDueDate: program.feeDueDate,
        }}
        couponDiscount={couponDiscount}
        priceViewClassName={clsx({
          'mb-2': message,
          'mb-5': !message,
        })}
      />
      {message && (
        <span
          className={cn(styles.message, {
            [styles.error]: error,
          })}
        >
          {message}
        </span>
      )}
      <button
        id="complete_button"
        className="caution-next-button next-button"
        onClick={handleApplySubmit}
      >
        제출하기
      </button>
    </div>
  );
};

export default CautionContent;
