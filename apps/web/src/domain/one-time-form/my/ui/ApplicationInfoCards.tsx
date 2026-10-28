import type { MyOneTimeFormApplication } from '@/api/one-time-form/oneTimeFormSchema';
import { ReactNode } from 'react';
import { formatWon } from '../../payment/utils/paymentAmount';
import {
  calculateBasePrice,
  formatAnswerValue,
  formatDotDateTime,
} from '../utils/myApplication';

type Application = NonNullable<MyOneTimeFormApplication>;

const InfoCard = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <section className="border-neutral-85 mt-3 rounded-md border p-4">
    <h3 className="text-xsmall14 mb-2 font-bold">{title}</h3>
    <dl className="flex flex-col gap-2">{children}</dl>
  </section>
);

const InfoRow = ({ label, value }: { label: ReactNode; value: ReactNode }) => (
  <div className="text-xsmall14 flex justify-between gap-4">
    <dt className="text-neutral-40 max-w-[50%] flex-none break-keep">
      {label}
    </dt>
    <dd className="text-neutral-0 min-w-0 break-all text-right">{value}</dd>
  </div>
);

export const ApplicantInfoCard = ({
  application,
}: {
  application: Application;
}) => (
  <InfoCard title="신청자 정보">
    <InfoRow label="이름" value={application.name} />
    <InfoRow label="이메일" value={application.email} />
    <InfoRow label="전화번호" value={application.phoneNum} />
    <InfoRow label="신청일" value={formatDotDateTime(application.createDate)} />
  </InfoCard>
);

/** 무료 폼은 payment 가 null 이라 그리지 않는다. 결제 수단이 null(0원, 조회 실패)이면 줄을 숨긴다(계약 U2) */
export const PaymentInfoCard = ({
  application,
}: {
  application: Application;
}) => {
  const { payment, selectedOptions, isCanceled } = application;
  if (!payment) return null;

  return (
    <InfoCard title="결제 정보">
      <InfoRow
        label="기본 금액"
        value={formatWon(
          calculateBasePrice(payment.paidAmount, selectedOptions),
        )}
      />
      {selectedOptions.map((option) => (
        <InfoRow
          key={option.optionId}
          label={option.optionName}
          value={`+${formatWon(option.additionalPrice)}`}
        />
      ))}
      <InfoRow label="결제 금액" value={formatWon(payment.paidAmount)} />
      {payment.paymentMethod ? (
        <InfoRow label="결제 수단" value={payment.paymentMethod} />
      ) : null}
      {isCanceled ? (
        <InfoRow label="환불 금액" value={formatWon(payment.refundAmount)} />
      ) : null}
    </InfoCard>
  );
};

/** 답이 있는 질문만 질문 순서대로 온다. 삭제된 질문은 표시를 붙여 남긴다 */
export const AnswerInfoCard = ({
  application,
}: {
  application: Application;
}) => {
  if (application.answerItems.length === 0) return null;

  return (
    <InfoCard title="신청 내용">
      {application.answerItems.map((item) => (
        <InfoRow
          key={item.questionId}
          label={
            <>
              {item.title}
              {item.isDeleted ? (
                <span className="text-xxsmall12 text-neutral-45 ml-1">
                  (삭제된 질문)
                </span>
              ) : null}
            </>
          }
          value={formatAnswerValue(item.value)}
        />
      ))}
    </InfoCard>
  );
};
