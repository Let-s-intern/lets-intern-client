import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import cn from 'classnames';

import axios from '../../../../../../../utils/axios';
import { typeToText } from '../../../../../../../utils/converTypeToText';

import styles from './CautionContent.module.scss';
import PriceSection from '../section/PriceSection';
import { calculateProgramPrice } from '../../../../../../../utils/programPrice';
import clsx from 'clsx';

interface CautionContentProps {
  program: any;
  formData: any;
  isLoggedIn: boolean;
  setApplyPageIndex: (applyPageIndex: number) => void;
  setAnnouncementDate: (announcedmentDate: string) => void;
  couponDiscount: number;
}

const CautionContent = ({
  program,
  formData,
  isLoggedIn,
  setApplyPageIndex,
  setAnnouncementDate,
  couponDiscount,
}: CautionContentProps) => {
  const params = useParams();
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

  const { price, discountAmount, totalPrice } = calculateProgramPrice({
    feeType: program.feeType,
    feeCharge: program.feeCharge,
    feeRefund: program.feeRefund,
    programDiscount: program.discountValue,
    couponDiscount,
  });

  return (
    <div className={styles.content}>
      <h3 className="program-type">{typeToText[program.type]}</h3>
      <h2 className="program-title">{program.title}</h2>
      <h4>[필독사항]</h4>
      <p>{program.notice}</p>
      {program.feeType !== 'FREE' && price !== 0 && (
        <>
          <hr />
          <section className="mt-4 font-pretendard">
            <h3 className="font-semibold text-zinc-600">결제 방법</h3>
            <div className="mt-3 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-zinc-600">
                  입급 계좌
                </span>
                <span className="text-sm text-zinc-600">
                  토스뱅크 1000-7342-6735
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-zinc-600">
                  입금 마감기한
                </span>
                <span className="text-sm text-zinc-600">
                  2024년 3월 23일 오후 10시
                </span>
              </div>
            </div>
          </section>
          <hr className="mb-3 mt-4" />
          <PriceSection
            as="section"
            className={clsx('mt-4', {
              'mb-2': message,
              'mb-5': !message,
            })}
            price={price}
            discountAmount={discountAmount}
            couponDiscount={couponDiscount}
            totalPrice={totalPrice}
          />
        </>
      )}
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
