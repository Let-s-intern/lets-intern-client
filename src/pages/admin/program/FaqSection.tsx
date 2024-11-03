import { useEffect, useState } from 'react';

import { useDeleteFaq, useGetFaq, usePatchFaq, usePostFaq } from '@/api/faq';
import {
  CreateChallengeReq,
  CreateLiveReq,
  Faq,
  FaqProgramType,
  UpdateChallengeReq,
  UpdateLiveReq,
} from '@/schema';

interface FaqSectionProps<
  T extends
    | CreateChallengeReq
    | UpdateChallengeReq
    | CreateLiveReq
    | UpdateLiveReq,
> {
  programType: FaqProgramType;
  faqInfo: T['faqInfo'];
  setInput: React.Dispatch<React.SetStateAction<Omit<T, 'desc'>>>;
}

function FaqSection<
  T extends
    | CreateChallengeReq
    | UpdateChallengeReq
    | CreateLiveReq
    | UpdateLiveReq,
>({ programType, faqInfo, setInput }: FaqSectionProps<T>) {
  const [faqList, setFaqList] = useState<Faq[]>([]);

  const { data } = useGetFaq(programType);
  const { mutateAsync: deleteFaq } = useDeleteFaq();
  const { mutateAsync: patchFaq } = usePatchFaq();
  const { mutateAsync: postFaq } = usePostFaq();

  const checkFaq = (e: React.ChangeEvent<HTMLInputElement>, faqId: number) => {
    console.log(e.target.checked);
    console.log(faqInfo);

    if (e.target.checked)
      setInput((prev) => ({
        ...prev,
        faqInfo: [...(faqInfo ?? []), { faqId }],
      }));
    else
      setInput((prev) => ({
        ...prev,
        faqInfo: faqInfo?.filter((info) => info.faqId !== faqId),
      }));
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>, faqId: number) => {
    const { name, value } = e.target;
    const index = faqList.findIndex((faq) => faq.id === faqId);

    setFaqList([
      ...faqList.slice(0, index),
      { ...faqList[index], [name]: value },
      ...faqList.slice(index + 1),
    ]);
  };

  useEffect(() => {
    setFaqList(data?.faqList ?? []);
  }, [data]);

  return (
    <div className="px-6 py-5 shadow-[0_0_8px_rgba(0,0,0,0.125)]">
      <h3 className="mb-4 text-xl font-medium">FAQ</h3>
      {data?.faqList.length === 0 ? (
        <p className="text-center">등록된 FAQ가 없습니다.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {faqList.map((faq) => (
            <div key={faq.id} className="flex gap-2">
              <input
                type="checkbox"
                checked={
                  (faqInfo ?? []).findIndex((info) => info.faqId === faq.id) !==
                  -1
                }
                onChange={(e) => checkFaq(e, faq.id)}
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
                onClick={async () => await deleteFaq(faq.id)}
              >
                삭제
              </button>
            </div>
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

export default FaqSection;
