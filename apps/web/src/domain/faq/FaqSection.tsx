import { useEffect, useState } from 'react';

import { useDeleteFaq, useGetFaq, usePatchFaq, usePostFaq } from '@/api/faq';
import { CreateReportData, UpdateReportData } from '@/api/report';
import {
  CreateChallengeReq,
  CreateLiveReq,
  Faq,
  ProgramTypeUpperCase,
  UpdateChallengeReq,
  UpdateLiveReq,
} from '@/schema';

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

function FaqSection<
  T extends
    | CreateChallengeReq
    | UpdateChallengeReq
    | CreateLiveReq
    | UpdateLiveReq,
>({ programType, faqInfo, setFaqInfo, isCreate }: FaqSectionProps<T>) {
  const [faqList, setFaqList] = useState<Faq[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  const { data } = useGetFaq(programType);
  const { mutateAsync: deleteFaq } = useDeleteFaq();
  const { mutateAsync: patchFaq } = usePatchFaq();
  const { mutateAsync: postFaq } = usePostFaq();

  const checkFaq = (e: React.ChangeEvent<HTMLInputElement>, faqId: number) => {
    if (e.target.checked) setFaqInfo([...(faqInfo ?? []), { faqId }]);
    else setFaqInfo(faqInfo?.filter((info) => info.faqId !== faqId));
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
    if (!data) return;

    const newFaqList = data.faqList;

    // 초기화 시에는 모든 faq 추가
    if (isCreate && !isInitialized) {
      setFaqList(newFaqList);
      setFaqInfo(newFaqList.map((faq) => ({ faqId: faq.id })));
      setIsInitialized(true);
      return;
    }

    if (!isInitialized) {
      setFaqList(newFaqList);
      setIsInitialized(true);
      return;
    }

    const type =
      newFaqList.length > faqList.length
        ? 'ADD'
        : newFaqList.length < faqList.length
          ? 'DELETE'
          : 'EDIT';
    setFaqList(newFaqList);

    if (type === 'ADD') {
      const lastFaq = newFaqList[newFaqList.length - 1];

      // 이미 추가된 faq인 경우 추가하지 않음
      if (faqInfo?.findIndex((info) => info.faqId === lastFaq.id) !== -1)
        return;

      setFaqInfo([...(faqInfo ?? []), { faqId: lastFaq.id }]);
    } else if (type === 'DELETE') {
      const existFaqIds = newFaqList.map((faq) => faq.id);
      setFaqInfo(
        (faqInfo ?? [])?.filter((info) => existFaqIds.includes(info.faqId)),
      );
    } else {
      return;
    }
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
