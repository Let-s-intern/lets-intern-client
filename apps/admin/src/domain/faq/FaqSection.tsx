import { CategoryTabs } from '@letscareer/ui';
import { Button } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';

import { useDeleteFaq, useGetFaq } from '@/api/faq';
import { CreateReportData, UpdateReportData } from '@/api/report';
import {
  CreateChallengeReq,
  CreateLiveReq,
  Faq,
  ProgramTypeUpperCase,
  UpdateChallengeReq,
  UpdateLiveReq,
} from '@/schema';
import FaqAddModal from './modal/FaqAddModal';
import FaqEditModal from './modal/FaqEditModal';

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

const FIXED_CATEGORIES = ['진행 방식', '신청/환불', '페이백', '기타'];

function FaqSection<
  T extends
    | CreateChallengeReq
    | UpdateChallengeReq
    | CreateLiveReq
    | UpdateLiveReq,
>({ programType, faqInfo, setFaqInfo, isCreate }: FaqSectionProps<T>) {
  const [faqList, setFaqList] = useState<Faq[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('진행 방식');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<Faq | null>(null);

  const { data } = useGetFaq(programType);
  const { mutateAsync: deleteFaq } = useDeleteFaq();

  const customCategories = useMemo(
    () => [
      ...new Set(
        faqList
          .map((faq) => faq.category ?? '')
          .filter((cat) => cat && !FIXED_CATEGORIES.includes(cat)),
      ),
    ],
    [faqList],
  );

  const tabs = useMemo(
    () =>
      ['전체', ...FIXED_CATEGORIES, ...customCategories].map((cat) => ({
        value: cat,
        label: cat,
      })),
    [customCategories],
  );

  const filteredFaqList =
    selectedCategory === '전체'
      ? faqList
      : faqList.filter((faq) => faq.category === selectedCategory);

  const checkFaq = (e: React.ChangeEvent<HTMLInputElement>, faqId: number) => {
    if (e.target.checked) setFaqInfo([...(faqInfo ?? []), { faqId }]);
    else setFaqInfo(faqInfo?.filter((info) => info.faqId !== faqId));
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
    <>
      <FaqAddModal
        isOpen={isAddModalOpen}
        programType={programType}
        customCategories={customCategories}
        onClose={() => setIsAddModalOpen(false)}
      />
      <FaqEditModal
        isOpen={editingFaq !== null}
        faq={editingFaq}
        customCategories={customCategories}
        onClose={() => setEditingFaq(null)}
      />
      <div className="px-6 py-5 shadow-[0_0_8px_rgba(0,0,0,0.125)]">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-medium">FAQ</h3>
          <Button variant="contained" onClick={() => setIsAddModalOpen(true)}>
            문항 추가
          </Button>
        </div>

        <CategoryTabs
          className="mb-4"
          options={tabs}
          selected={selectedCategory}
          onChange={setSelectedCategory}
        />

        {filteredFaqList.length === 0 ? (
          <div className="py-10 text-center">
            <span className="text-sm text-gray-400">
              해당 카테고리의 FAQ가 없습니다.
            </span>
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-[#e2e8f0]">
            {filteredFaqList.map((faq) => (
              <div key={faq.id} className="flex items-start gap-3 py-4">
                <input
                  type="checkbox"
                  className="shrink-0"
                  checked={
                    (faqInfo ?? []).findIndex(
                      (info) => info.faqId === faq.id,
                    ) !== -1
                  }
                  onChange={(e) => checkFaq(e, faq.id)}
                />
                <div className="flex flex-1 flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <div className="rounded-xxs flex-1 rounded border border-[#E7E7E7] px-3 py-1.5">
                      <span className="text-xsmall16 text-[#ACAFB6]">
                        {faq.question}
                      </span>
                    </div>
                    <Button
                      variant="outlined"
                      size="medium"
                      onClick={() => setEditingFaq(faq)}
                    >
                      수정
                    </Button>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="rounded-xxs flex-1 rounded border border-[#E7E7E7] px-3 py-1.5">
                      <span className="text-xsmall16 whitespace-pre-wrap text-[#ACAFB6]">
                        {faq.answer}
                      </span>
                    </div>
                    <Button
                      variant="outlined"
                      size="medium"
                      color="error"
                      onClick={async () => await deleteFaq(faq.id)}
                    >
                      삭제
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default FaqSection;
