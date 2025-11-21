import { JOB_CONDITIONS } from '@/utils/constants';
import { Check } from 'lucide-react';

interface CareerPlanFormProps {
  user: {
    university: string;
    grade: string;
    major: string;
    wishTargetCompany: string;
    jobConditions: string[];
  };
  getFieldDisplayText: () => string;
  getPositionDisplayText: () => string;
  getIndustryDisplayText: () => string;
  handleEdit: () => void;
}

interface FormFieldProps {
  label: string;
  value: string;
}

interface FormChecklistProps {
  label: string;
  items: string[];
}

const FormField = ({ label, value }: FormFieldProps) => (
  <div className="flex flex-col gap-2 border-b border-neutral-85 pb-4">
    <label className="text-xsmall14 text-neutral-35">{label}</label>
    <div className="">{value}</div>
  </div>
);

const FormChecklist = ({ label, items }: FormChecklistProps) => (
  <div className="flex flex-col gap-2.5">
    <label className="text-xsmall14 text-neutral-35">{label}</label>
    {items.map((item, index) => (
      <div key={index} className="flex items-center gap-2">
        <Check size={16} className="text-primary-80" />
        <span>{item}</span>
      </div>
    ))}
  </div>
);

const CareerPlanForm = ({
  user,
  getFieldDisplayText,
  getPositionDisplayText,
  getIndustryDisplayText,
}: CareerPlanFormProps) => {
  const getJobConditionsDisplayText = () => {
    return user.jobConditions
      .map((condition) => {
        const jobConditions = JOB_CONDITIONS.find(
          (item) => item.value === condition,
        );
        return jobConditions ? jobConditions.label : '';
      })
      .filter((label) => label);
  };

  return (
    <section>
      <h1 className="mb-6 text-small18">기본 정보</h1>
      <div className="mb-10 flex flex-col gap-4">
        <FormField label="학교" value={user.university} />
        <FormField label="학년" value={user.grade} />
        <FormField label="전공" value={user.major} />
        <FormField label="희망 직군" value={getFieldDisplayText()} />
        <FormField
          label="희망 직무 (최대 3개)"
          value={getPositionDisplayText()}
        />
        <FormField label="희망 산업" value={getIndustryDisplayText()} />
        <FormField label="희망 기업" value={user.wishTargetCompany} />
        <FormChecklist
          label="희망 구직 조건"
          items={getJobConditionsDisplayText()}
        />
      </div>
    </section>
  );
};

export default CareerPlanForm;
