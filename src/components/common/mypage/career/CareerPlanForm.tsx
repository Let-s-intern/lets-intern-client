import { JOB_CONDITIONS } from '@/utils/constants';
import { Check, Pencil } from 'lucide-react';

interface CareerPlanFormProps {
  user: {
    university: string | null;
    grade: string | null;
    major: string | null;
    wishField: string | null;
    wishJob: string | null;
    wishIndustry: string | null;
    wishCompany: string | null;
    wishEmploymentType: string | null;
  };
  setStatus: (status: 'EMPTY' | 'EDIT' | 'COMPLETE') => void;
  getFieldDisplayText: () => string;
  getPositionDisplayText: () => string;
  getIndustryDisplayText: () => string;
  handleEdit: () => void;
}

interface FormFieldProps {
  label: string;
  value: string | null;
}

interface FormChecklistProps {
  label: string;
  items: string[];
}

const FormField = ({ label, value }: FormFieldProps) => (
  <div className="flex flex-col gap-2 border-b border-neutral-85 pb-4">
    <label className="text-xsmall14 text-neutral-35">{label}</label>
    <div>{value || '-'}</div>
  </div>
);

const FormChecklist = ({ label, items }: FormChecklistProps) => (
  <div className="flex flex-col gap-2.5">
    <label className="text-xsmall14 text-neutral-35">{label}</label>
    {items.length === 0 ? (
      <span className="text-xsmall14 text-neutral-35">-</span>
    ) : (
      items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <Check size={16} className="text-primary-80" />
          <span>{item}</span>
        </div>
      ))
    )}
  </div>
);

const CareerPlanForm = ({ user, setStatus }: CareerPlanFormProps) => {
  const employmentList = user.wishEmploymentType
    ? user.wishEmploymentType.split(', ').filter(Boolean)
    : [];

  const employmentLabels = employmentList
    .map((code) => {
      const found = JOB_CONDITIONS.find((item) => item.value === code);
      return found ? found.label : null;
    })
    .filter(Boolean) as string[];

  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-small18">기본 정보</h1>
        <button
          onClick={() => setStatus('EDIT')}
          className="flex items-center gap-1 text-neutral-35"
        >
          <Pencil size={16} />
          <span className="text-xsmall14">수정</span>
        </button>
      </div>
      <div className="mb-10 flex flex-col gap-4">
        <FormField label="학교" value={user.university} />
        <FormField label="학년" value={user.grade} />
        <FormField label="전공" value={user.major} />
        <FormField label="희망 직군" value={user.wishField} />
        <FormField label="희망 직무 (최대 3개)" value={user.wishJob} />
        <FormField label="희망 산업" value={user.wishIndustry} />
        <FormField label="희망 기업" value={user.wishCompany} />
        <FormChecklist label="희망 구직 조건" items={employmentLabels} />
      </div>
    </section>
  );
};

export default CareerPlanForm;
