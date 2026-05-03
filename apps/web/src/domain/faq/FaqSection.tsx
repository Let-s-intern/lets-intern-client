import { CreateReportData, UpdateReportData } from '@/api/report';
import {
  CreateChallengeReq,
  CreateLiveReq,
  ProgramTypeUpperCase,
  UpdateChallengeReq,
  UpdateLiveReq,
} from '@/schema';
import { useFaqList } from './hooks/useFaqList';
import FaqButton from './ui/FaqButton';
import FaqItem from './ui/FaqItem';

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

export default FaqSection;
