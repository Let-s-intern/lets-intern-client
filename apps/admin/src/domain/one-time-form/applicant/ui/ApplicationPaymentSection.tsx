import type { AdminOneTimeFormApplication } from '@/api/one-time-form/oneTimeFormSchema';

import {
  formatWon,
  getApplicationStatusLabel,
  getPaymentAmountText,
  groupSelectedOptions,
} from '../utils/applicationDisplay';
import ApplicationRefundButton from './ApplicationRefundButton';
import DetailSection from './DetailSection';
import InfoList, { type InfoItem } from './InfoList';

interface ApplicationPaymentSectionProps {
  formId: number;
  application: AdminOneTimeFormApplication;
}

/** 신청 시점 옵션 스냅샷(그룹별)과 결제·환불 금액 */
const ApplicationPaymentSection = ({
  formId,
  application,
}: ApplicationPaymentSectionProps) => {
  const { payment } = application;
  const groups = groupSelectedOptions(application.selectedOptions);

  const optionItems: InfoItem[] =
    groups.length === 0
      ? [{ label: '고른 옵션', value: '없음' }]
      : groups.map((group) => ({
          label: group.groupTitle,
          value: (
            <ul className="flex flex-col gap-1">
              {group.options.map((option) => (
                <li key={option.optionId}>
                  {option.optionName}
                  <span className="text-neutral-40 ml-2">
                    +{formatWon(option.additionalPrice)}
                  </span>
                </li>
              ))}
            </ul>
          ),
        }));

  return (
    <DetailSection title="옵션·결제">
      <InfoList
        items={[
          ...optionItems,
          { label: '결제 금액', value: getPaymentAmountText(payment) },
          {
            label: '환불 금액',
            value: payment === null ? null : formatWon(payment.refundAmount),
          },
          {
            label: '결제 상태',
            value:
              payment === null ? (
                getApplicationStatusLabel(application)
              ) : (
                <div className="flex flex-wrap items-center gap-3">
                  <span>{getApplicationStatusLabel(application)}</span>
                  <ApplicationRefundButton
                    formId={formId}
                    applicationId={application.applicationId}
                    applicantName={application.name}
                    paidAmount={payment.paidAmount}
                    isCanceled={application.isCanceled}
                  />
                </div>
              ),
          },
        ]}
      />
    </DetailSection>
  );
};

export default ApplicationPaymentSection;
