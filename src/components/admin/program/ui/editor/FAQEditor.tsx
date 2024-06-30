import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import axios from '../../../../../utils/axios';

interface FaqType {
  id: number;
  question: string;
  answer: string;
  faqProgramType: string;
}

interface FAQEditorProps {
  programType: string;
  value: any;
  setValue: (value: any) => void;
}

const FAQEditor = ({ programType, value, setValue }: FAQEditorProps) => {
  const queryClient = useQueryClient();

  const [faqList, setFaqList] = useState<FaqType[]>([]);
  const [faqSaveError, setFaqSaveError] = useState<Error>();

  useQuery({
    queryKey: ['faq', { type: programType }],
    queryFn: async ({ queryKey }) => {
      const res = await axios.get('/faq', { params: queryKey[1] });
      setFaqList(res.data.data.faqList);
      return res.data;
    },
    refetchOnWindowFocus: false,
  });

  const addFaq = useMutation({
    mutationFn: async () => {
      const res = await axios.post('/faq', {
        question: '',
        answer: '',
        type: programType,
      });
      return res.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['faq'] });
    },
  });

  const editFaq = useMutation({
    mutationFn: async (faq: FaqType) => {
      const res = await axios.patch(`/faq/${faq.id}`, {
        question: faq.question,
        answer: faq.answer,
        type: faq.faqProgramType,
      });
      return res.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['faq'] });
    },
    onError: (error) => {
      setFaqSaveError(error);
    },
  });

  const deleteFaq = useMutation({
    mutationFn: async (faqId: number) => {
      const res = await axios.delete(`/faq/${faqId}`);
      return res.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['faq'] });
    },
  });

  const handleFaqChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    faqId: number,
  ) => {
    const { name, value } = e.target;
    setFaqList((prev) =>
      prev.map((faq) => (faq.id === faqId ? { ...faq, [name]: value } : faq)),
    );
  };

  const handleFaqAdd = async () => {
    addFaq.mutate();
  };

  const handleFaqSave = async () => {
    for (const faq of faqList) {
      editFaq.mutate(faq);
    }
    if (faqSaveError) {
      alert('FAQ 저장에 실패했습니다.');
    } else {
      alert('FAQ가 저장되었습니다.');
    }
    setFaqSaveError(undefined);
  };

  const handleFaqDelete = async (faqId: number) => {
    deleteFaq.mutate(faqId);
  };

  const handleFaqCheckChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    faqId: number,
  ) => {
    if (e.target.checked) {
      setValue({ ...value, faqList: [...value.faqList, faqId] });
    } else {
      setValue({
        ...value,
        faqList: value.faqList.filter((id: number) => id !== faqId),
      });
    }
  };

  return (
    <div className="px-6 py-5 shadow-[0_0_8px_rgba(0,0,0,0.125)]">
      <h3 className="mb-4 text-xl font-medium">FAQ</h3>
      {faqList.length === 0 || !faqList ? (
        <p className="text-center">등록된 FAQ가 없습니다.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {faqList.map((faq: FaqType) => (
            <div key={faq.id} className="flex gap-2">
              <input
                type="checkbox"
                checked={value.faqList.includes(faq.id)}
                onChange={(e) => handleFaqCheckChange(e, faq.id)}
              />
              <div className="flex w-full flex-col gap-2">
                <input
                  type="text"
                  className="w-full rounded-sm border border-[#cbd5e0] px-4 py-2 text-sm"
                  name="question"
                  placeholder="질문을 입력하세요."
                  value={faq.question}
                  onChange={(e) => handleFaqChange(e, faq.id)}
                  autoComplete="off"
                />
                <input
                  type="text"
                  className="w-full rounded-sm border border-[#cbd5e0] px-4 py-2 text-sm"
                  name="answer"
                  placeholder="답변을 입력하세요."
                  value={faq.answer}
                  onChange={(e) => handleFaqChange(e, faq.id)}
                  autoComplete="off"
                />
              </div>
              <button
                type="button"
                className="w-[5rem] rounded-sm bg-[#e0e0e0] px-4 py-2 font-medium"
                onClick={() => handleFaqDelete(faq.id)}
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
          onClick={handleFaqSave}
        >
          저장
        </button>
        <button
          type="button"
          className="rounded-sm bg-[#e0e0e0] px-4 py-2 font-medium"
          onClick={handleFaqAdd}
        >
          추가
        </button>
      </div>
    </div>
  );
};

export default FAQEditor;
