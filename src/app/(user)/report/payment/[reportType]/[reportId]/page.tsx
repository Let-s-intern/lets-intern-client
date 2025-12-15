'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { useGetParticipationInfo } from '@/api/application';
import { convertReportPriceType, useGetReportPriceDetail } from '@/api/report';
import { usePatchUser } from '@/api/user';
import Heading2 from '@/common/report/Heading2';
import Label from '@/common/report/Label';
import ProgramCard from '@/common/report/ProgramCard';
import BackHeader from '@/common/ui/BackHeader';
import BottomSheet from '@/common/ui/BottomSheeet';
import BaseButton from '@/common/ui/button/BaseButton';
import Input from '@/common/ui/input/Input';
import useReportPayment from '@/hooks/useReportPayment';
import useReportProgramInfo from '@/hooks/useReportProgramInfo';
import { generateOrderId } from '@/lib/order';
import { twMerge } from '@/lib/twMerge';
import useReportApplicationStore from '@/store/useReportApplicationStore';

const ReportPaymentPage = () => {
  const router = useRouter();
  const params = useParams<{ reportType: string; reportId: string }>();
  const { reportType, reportId } = params;

  const { data: reportApplication } = useReportApplicationStore();
  const { payment } = useReportPayment();
  const patchUserMutation = usePatchUser();

  return (
    <div className="mx-auto max-w-[55rem] px-5 md:pt-5 lg:px-0">
      <BackHeader to={`/report/apply/${reportType}/${reportId}`}>
        결제하기
      </BackHeader>
      <main className="mb-8 flex flex-col gap-10">
        <ProgramInfoSection />
        <UsereInfoSection />
        <ReportPaymentSection />

        {/* 데스크탑 결제 버튼 */}
        <BaseButton
          className="complete_button_click hidden w-full text-small18 md:block"
          onClick={() => {
            if (reportApplication.contactEmail === '') {
              alert('정보 수신용 이메일을 입력해주세요.');
              return;
            }

            patchUserMutation.mutateAsync({
              contactEmail: reportApplication.contactEmail,
            });

            if (payment.amount === 0) {
              router.push(`/report/order/result?orderId=${generateOrderId()}`);
              return;
            }
            router.push(`/report/toss/payment`);
          }}
        >
          결제하기
        </BaseButton>
      </main>

      {/* 모바일 바텀시트 */}
      <BottomSheet className="mx-auto md:hidden">
        <BaseButton
          className="complete_button_click w-full text-small18"
          onClick={() => {
            if (reportApplication.contactEmail === '') {
              alert('정보 수신용 이메일을 입력해주세요.');
              return;
            }

            patchUserMutation.mutateAsync({
              contactEmail: reportApplication.contactEmail,
            });

            if (payment.amount === 0) {
              router.push(`/report/order/result?orderId=${generateOrderId()}`);
              return;
            }
            router.push(`/report/toss/payment`);
          }}
        >
          결제하기
        </BaseButton>
      </BottomSheet>
    </div>
  );
};

export default ReportPaymentPage;

const ProgramInfoSection = () => {
  const { title, product, option } = useReportProgramInfo();

  return (
    <section className="flex flex-col gap-6">
      <Heading2>프로그램 정보</Heading2>
      <ProgramCard
        imgSrc="/images/report-thumbnail.png"
        imgAlt="서류 진단서 프로그램 썸네일"
        title={title!}
        content={[
          {
            label: '상품',
            text: product,
          },
          {
            label: '옵션',
            text: option,
          },
        ]}
      />
    </section>
  );
};

const UsereInfoSection = () => {
  const [checked, setChecked] = useState(true);

  const { data: participationInfo } = useGetParticipationInfo();
  const { data: reportApplication, setReportApplication } =
    useReportApplicationStore();

  useEffect(() => {
    // 가입한 이메일을 정보 수신용 이메일로 설정
    setReportApplication({
      contactEmail: participationInfo?.contactEmail || '',
    });
  }, [participationInfo?.contactEmail, setReportApplication]);

  useEffect(() => {
    // 정보 수신용 이메일과 가입한 이메일이 다르면 체크 해제
    if (reportApplication.contactEmail !== participationInfo?.email)
      setChecked(false);
    else setChecked(true);
  }, [reportApplication.contactEmail, participationInfo?.email]);

  return (
    <section>
      <Heading2>참여자 정보</Heading2>
      <div className="mt-6 flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <Label>이름</Label>
          <Input
            disabled
            readOnly
            className="text-sm"
            value={participationInfo?.name || ''}
            name="name"
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label>휴대폰 번호</Label>
          <Input
            disabled
            readOnly
            className="text-sm"
            value={participationInfo?.phoneNumber || ''}
            name="phoneNumber"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="ml-3 text-xsmall14 font-semibold">
            가입한 이메일
          </label>
          <Input
            disabled
            readOnly
            className="text-sm"
            value={participationInfo?.email || ''}
            name="email"
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor="contactEmail">렛츠커리어 정보 수신용 이메일</Label>
          <p className="text-[0.5625rem] font-light text-neutral-0 text-opacity-[52%]">
            * 결제정보 및 프로그램 신청 관련 알림 수신을 위해,
            <br />
            &nbsp;&nbsp; 자주 사용하는 이메일 주소를 입력해주세요!
          </p>
          <label
            onClick={() => {
              setChecked(!checked);
              if (checked) {
                setReportApplication({
                  contactEmail: '',
                });
              } else {
                setReportApplication({
                  contactEmail: participationInfo?.email || '',
                });
              }
            }}
            className="flex cursor-pointer items-center gap-1 text-xxsmall12 font-medium"
          >
            <img
              className="h-auto w-5"
              src={`/icons/${checked ? 'checkbox-fill.svg' : 'checkbox-unchecked.svg'}`}
            />
            가입한 이메일과 동일
          </label>
          <Input
            name="contactEmail"
            placeholder="example@example.com"
            value={reportApplication.contactEmail}
            onChange={(e) =>
              setReportApplication({ contactEmail: e.target.value })
            }
          />
        </div>
      </div>
    </section>
  );
};

const ReportPaymentSection = () => {
  const [message, setMessage] = useState('');

  const { data: reportApplication, setReportApplication } =
    useReportApplicationStore();
  const { payment, applyCoupon, cancelCoupon } = useReportPayment();
  const { data: reportPriceDetail } = useGetReportPriceDetail(
    reportApplication.reportId!,
  );

  // 기존에 입력한 쿠폰 코드 초기화
  useEffect(() => {
    setReportApplication({ couponId: null, couponCode: '' });
    setMessage('');
  }, [setReportApplication]);

  const showFeedback = reportApplication.isFeedbackApplied;
  const reportAndOptionsDiscount =
    payment.reportDiscount + payment.optionDiscount; // 진단서와 옵션 할인 금액
  const reportAndOptionsAmount =
    payment.report + payment.option - reportAndOptionsDiscount; // 진단서와 옵션 결제 금액
  const feedbackAmount = payment.feedback - payment.feedbackDiscount; // 1:1 온라인 상담 결제 금액

  // 사용자가 선택한 옵션
  const selectedOptions = useMemo(() => {
    const result = [];

    for (const optionId of reportApplication.optionIds) {
      const reportOptionInfo = reportPriceDetail?.reportOptionInfos?.find(
        (info) => info.reportOptionId === optionId,
      );

      if (reportOptionInfo === undefined) continue;

      result.push(reportOptionInfo);
    }
    return result;
  }, [reportPriceDetail?.reportOptionInfos, reportApplication.optionIds]);
  // 선택한 옵션 제목
  const optionTitle = useMemo(
    () =>
      // 문항 추가는 한 번만 표시
      [
        ...new Set(
          selectedOptions.map((option) =>
            option.optionTitle?.startsWith('+')
              ? '문항 추가'
              : option.optionTitle,
          ),
        ),
      ].join(', '),
    [selectedOptions],
  );

  return (
    <section className="flex flex-col">
      <Heading2>결제 정보</Heading2>
      <div className="mt-6">
        <div className="flex gap-2.5">
          <Input
            className="w-full"
            value={reportApplication.couponCode ?? ''}
            type="text"
            placeholder="쿠폰 번호를 입력해주세요."
            disabled={reportApplication.couponId === null ? false : true}
            onChange={(e) =>
              setReportApplication({ couponCode: e.target.value })
            }
          />
          <button
            className={twMerge(
              reportApplication.couponId === null
                ? 'bg-primary text-neutral-100'
                : 'border-2 border-primary bg-neutral-100 text-primary',
              'shrink-0 rounded-sm px-4 py-1.5 text-xsmall14 font-medium',
            )}
            onClick={async () => {
              if (reportApplication.couponCode === '') return;
              // 쿠폰이 등록된 상태면 쿠폰 취소
              if (
                reportApplication.couponId !== null &&
                reportApplication.couponCode !== ''
              ) {
                cancelCoupon();
                setMessage('');
                setReportApplication({ couponCode: '' });
                return;
              }

              const data = await applyCoupon(reportApplication.couponCode);

              if (data.status === 404 || data.status === 400)
                setMessage(data.message);
              else setMessage('쿠폰이 등록되었습니다.');
            }}
          >
            {reportApplication.couponId === null ? '쿠폰 등록' : '쿠폰 취소'}
          </button>
        </div>
        <span
          className={twMerge(
            reportApplication.couponId === null
              ? 'text-system-error'
              : 'text-system-positive-blue',
            'h-3 text-xsmall14',
          )}
        >
          {message}
        </span>
      </div>
      <hr className="my-5" />
      <div className="flex flex-col">
        <PaymentRowMain>
          <span>서류 진단서 결제금액</span>
          <span>{reportAndOptionsAmount.toLocaleString()}원</span>
        </PaymentRowMain>
        <PaymentRowSub>
          <span>
            └ {convertReportPriceType(reportApplication.reportPriceType)}
          </span>
          <span>{`${payment.report.toLocaleString()}원`}</span>
        </PaymentRowSub>
        {selectedOptions.length > 0 && (
          <PaymentRowSub>
            <span>└ {optionTitle}</span>
            <span className="shrink-0">{`${payment.option.toLocaleString()}원`}</span>
          </PaymentRowSub>
        )}
        <PaymentRowSub>
          <span>
            └{' '}
            {Math.ceil(
              (payment.report + payment.option !== 0
                ? reportAndOptionsDiscount / (payment.report + payment.option)
                : 0) * 100,
            )}
            % 할인
          </span>
          <span>
            {reportAndOptionsDiscount === 0
              ? '0원'
              : `-${reportAndOptionsDiscount.toLocaleString()}원`}
          </span>
        </PaymentRowSub>
        {showFeedback && (
          <>
            <PaymentRowMain>
              <span>1:1 온라인 상담 결제금액</span>
              <span>{feedbackAmount.toLocaleString()}원</span>
            </PaymentRowMain>
            <PaymentRowSub>
              <span>└ 정가</span>
              <span>{`${payment.feedback.toLocaleString()}원`}</span>
            </PaymentRowSub>
            <PaymentRowSub>
              <span>
                └{' '}
                {Math.ceil(
                  (payment.feedback !== 0
                    ? payment.feedbackDiscount / payment.feedback
                    : 0) * 100,
                )}
                % 할인
              </span>
              <span>
                {payment.feedbackDiscount === 0
                  ? '0원'
                  : `-${payment.feedbackDiscount.toLocaleString()}원`}
              </span>
            </PaymentRowSub>
          </>
        )}

        <PaymentRowMain className="text-primary">
          <span>쿠폰할인</span>
          <span className="font-bold">
            {payment.coupon === 0
              ? '0원'
              : `-${payment.coupon.toLocaleString()}원`}
          </span>
        </PaymentRowMain>
        <hr className="my-5" />
        <PaymentRowMain className="font-semibold">
          <span>결제금액</span>
          <span>{payment.amount.toLocaleString()}원</span>
        </PaymentRowMain>
      </div>
    </section>
  );
};

const PaymentRowMain = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={twMerge(
        'flex h-10 items-center justify-between px-3 text-neutral-0',
        className,
      )}
    >
      {children}
    </div>
  );
};

const PaymentRowSub = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={twMerge(
        'flex h-10 items-center justify-between gap-1 pl-6 pr-3 text-xsmall14 text-neutral-50',
        className,
      )}
    >
      {children}
    </div>
  );
};
