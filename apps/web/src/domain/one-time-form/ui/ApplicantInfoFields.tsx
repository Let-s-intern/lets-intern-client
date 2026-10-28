import {
  APPLICANT_FIELDS,
  type ApplicantField,
  type ApplicantInfo,
} from '../utils/applicantInfo';
import {
  fieldDomId,
  type ApplicationFieldKey,
} from '../utils/applicationFormErrors';
import QuestionFieldFrame from './questions/QuestionFieldFrame';
import { textFieldClassName } from './questions/fieldStyles';

interface ApplicantInfoFieldsProps {
  applicant: ApplicantInfo;
  errors: Partial<Record<ApplicationFieldKey, string>>;
  onChange: (field: ApplicantField, value: string) => void;
  onBlur: (field: ApplicantField) => void;
}

const FIELD_META: Record<
  ApplicantField,
  {
    title: string;
    description?: string;
    type: 'text' | 'email' | 'tel';
    autoComplete: string;
    placeholder?: string;
  }
> = {
  name: { title: '이름', type: 'text', autoComplete: 'name' },
  email: {
    title: '이메일',
    description: '신청 안내를 이 주소로 보내요.',
    type: 'email',
    autoComplete: 'email',
  },
  phoneNum: {
    title: '전화번호',
    type: 'tel',
    autoComplete: 'tel',
    placeholder: '010-0000-0000',
  },
};

/** 시안 "기본 정보". 계정 정보로 미리 채운 이름·이메일·전화번호 */
const ApplicantInfoFields = ({
  applicant,
  errors,
  onChange,
  onBlur,
}: ApplicantInfoFieldsProps) => (
  <section className="mt-7">
    <h2 className="text-xsmall16 font-bold">기본 정보</h2>
    <p className="text-xxsmall12 text-neutral-40 mt-1">
      계정 정보로 미리 채웠어요. 다르면 고쳐 주세요.
    </p>
    {APPLICANT_FIELDS.map((field) => {
      const meta = FIELD_META[field];
      const id = fieldDomId(field);
      const error = errors[field];

      return (
        <QuestionFieldFrame
          key={field}
          title={meta.title}
          isRequired
          description={meta.description}
          error={error}
          inputId={id}
        >
          <input
            id={id}
            type={meta.type}
            inputMode={field === 'phoneNum' ? 'numeric' : undefined}
            autoComplete={meta.autoComplete}
            placeholder={meta.placeholder}
            value={applicant[field]}
            aria-invalid={Boolean(error)}
            onChange={(e) => onChange(field, e.target.value)}
            onBlur={() => onBlur(field)}
            className={textFieldClassName(Boolean(error))}
          />
        </QuestionFieldFrame>
      );
    })}
  </section>
);

export default ApplicantInfoFields;
