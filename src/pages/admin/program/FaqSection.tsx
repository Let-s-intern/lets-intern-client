import { useDeleteFaq, useGetFaq, usePatchFaq, usePostFaq } from '@/api/faq';
import {
  CreateChallengeReq,
  CreateLiveReq,
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
  const { data } = useGetFaq(programType);
  const { mutateAsync: deleteFaq } = useDeleteFaq();
  const { mutateAsync: patchFaq } = usePatchFaq();
  const { mutateAsync: postFaq } = usePostFaq();

  const checkFaq = (e: React.ChangeEvent<HTMLInputElement>, faqId: number) => {
    if (e.target.checked)
      setInput((prev) => ({
        ...prev,
        faqInfo: [...(prev.faqInfo ?? []), { faqId }],
      }));
    else
      setInput((prev) => ({
        ...prev,
        faqInfo: prev.faqInfo?.filter((info) => info.faqId !== faqId),
      }));
  };

  return (
    <div className="px-6 py-5 shadow-[0_0_8px_rgba(0,0,0,0.125)]">
      <h3 className="mb-4 text-xl font-medium">FAQ</h3>
      {data?.faqList.length === 0 ? (
        <p className="text-center">등록된 FAQ가 없습니다.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {data?.faqList.map((faq) => (
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
                <input
                  type="text"
                  className="w-full rounded-sm border border-[#cbd5e0] px-4 py-2 text-sm"
                  name="question"
                  placeholder="질문을 입력하세요."
                  value={faq.question ?? ''}
                  onChange={(e) => checkFaq(e, faq.id)}
                  autoComplete="off"
                />
                <input
                  type="text"
                  className="w-full rounded-sm border border-[#cbd5e0] px-4 py-2 text-sm"
                  name="answer"
                  placeholder="답변을 입력하세요."
                  value={faq.answer ?? ''}
                  onChange={(e) => checkFaq(e, faq.id)}
                  autoComplete="off"
                />
              </div>
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
        <button
          type="button"
          className="rounded-sm bg-[#e0e0e0] px-4 py-2 font-medium"
          onClick={() => {
            if (!data?.faqList) return;

            Promise.all(data.faqList.map((faq) => patchFaq(faq)))
              .then(() => alert('FAQ가 저장되었습니다.'))
              .catch((err) => alert(`FAQ 저장에 실패했습니다.\n${err}`));
          }}
        >
          저장
        </button>
        <button
          type="button"
          className="rounded-sm bg-[#e0e0e0] px-4 py-2 font-medium"
          onClick={async () => await postFaq(programType)}
        >
          추가
        </button>
      </div>
    </div>
  );
}

export default FaqSection;
