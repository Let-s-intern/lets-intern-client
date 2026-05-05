import { Faq, ProgramTypeUpperCase } from '@/schema';
import FaqInput from './FaqInput';

interface FaqItemProps {
  faq: Faq;
  programType: ProgramTypeUpperCase;
  checked: boolean;
  onCheck: (e: React.ChangeEvent<HTMLInputElement>, faqId: number) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>, faqId: number) => void;
  onDelete: (faqId: number) => Promise<void>;
}

function FaqItem({
  faq,
  programType,
  checked,
  onCheck,
  onChange,
  onDelete,
}: FaqItemProps) {
  return (
    <div className="flex gap-2">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onCheck(e, faq.id)}
      />
      <div className="flex w-full flex-col gap-2">
        <FaqInput
          name="question"
          placeholder="질문을 입력하세요."
          value={faq.question ?? ''}
          onChange={(e) => onChange(e, faq.id)}
        />
        <FaqInput
          name="answer"
          placeholder="답변을 입력하세요."
          value={faq.answer ?? ''}
          onChange={(e) => onChange(e, faq.id)}
        />
      </div>
      {programType === 'CHALLENGE' && (
        <FaqInput
          name="category"
          placeholder="유형을 입력하세요."
          value={faq.category ?? ''}
          onChange={(e) => onChange(e, faq.id)}
        />
      )}
      <button
        type="button"
        className="w-[5rem] rounded-sm bg-[#e0e0e0] px-4 py-2 font-medium"
        onClick={async () => await onDelete(faq.id)}
      >
        삭제
      </button>
    </div>
  );
}

export default FaqItem;
