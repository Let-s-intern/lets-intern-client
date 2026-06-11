import { CreateReportData, UpdateReportData } from '@/api/report';
import {
  CreateChallengeReq,
  CreateLiveReq,
  ProgramTypeUpperCase,
  UpdateChallengeReq,
  UpdateLiveReq,
} from '@/schema';
import { useFaqList } from './hooks/useFaqList';

interface FaqSectionProps<
  T extends
    | CreateChallengeReq
    | UpdateChallengeReq
    | CreateLiveReq
    | UpdateLiveReq
    | UpdateReportData
    | CreateReportData,
> {
  programType: ProgramTypeUpperCase;
  faqInfo: T['faqInfo'];
  setFaqInfo: (value: T['faqInfo']) => void;
  isCreate?: boolean;
}

export default function FaqSection<
  T extends
    | CreateChallengeReq
    | UpdateChallengeReq
    | CreateLiveReq
    | UpdateLiveReq,
>({ programType, faqInfo, setFaqInfo, isCreate }: FaqSectionProps<T>) {
  const { faqList, isEmpty, checkFaq, onChange, deleteFaq, patchFaq, postFaq } =
    useFaqList({ programType, faqInfo, setFaqInfo, isCreate });

  return (
    <div className="px-6 py-5 shadow-[0_0_8px_rgba(0,0,0,0.125)]">
      <h3 className="mb-4 text-xl font-medium">FAQ</h3>
      {isEmpty ? (
        <p className="text-center">등록된 FAQ가 없습니다.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {faqList.map((faq) => (
            <FaqItem
              key={faq.id}
              faq={faq}
              programType={programType}
              checked={
                (faqInfo ?? []).findIndex((info) => info.faqId === faq.id) !==
                -1
              }
              onCheck={checkFaq}
              onChange={onChange}
              onDelete={async (faqId) => await deleteFaq(faqId)}
            />
          ))}
        </div>
      )}
      <div className="mt-4 flex justify-between">
        <FaqButton
          onClick={() => {
            Promise.all(faqList.map((faq) => patchFaq(faq)))
              .then(() => alert('FAQ가 저장되었습니다.'))
              .catch((err) => alert(`FAQ 저장에 실패했습니다.\n${err}`));
          }}
        >
          저장
        </FaqButton>
        <FaqButton onClick={async () => await postFaq(programType)}>
          추가
        </FaqButton>
      </div>
    </div>
  );
}

function FaqButton({
  onClick,
  children,
}: React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>) {
  return (
    <button
      type="button"
      className="rounded-sm bg-[#e0e0e0] px-4 py-2 font-medium"
      onClick={onClick}
    >
      {children}
    </button>
  );
}

import { Faq } from '@/schema';

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

function FaqInput({
  name,
  placeholder,
  value,
  onChange,
}: React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>) {
  return (
    <input
      type="text"
      className="rounded-sm border border-[#cbd5e0] px-4 py-2 text-sm"
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
}
