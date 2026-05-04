import { useEffect, useState } from 'react';

import { useDeleteFaq, useGetFaq, usePatchFaq, usePostFaq } from '@/api/faq';
import { Faq, ProgramTypeUpperCase } from '@/schema';

interface UseFaqListParams {
  programType: ProgramTypeUpperCase;
  faqInfo: { faqId: number }[] | undefined;
  setFaqInfo: (value: { faqId: number }[] | undefined) => void;
  isCreate?: boolean;
}

export function useFaqList({
  programType,
  faqInfo,
  setFaqInfo,
  isCreate,
}: UseFaqListParams) {
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

  return {
    faqList,
    isEmpty: data?.faqList.length === 0,
    checkFaq,
    onChange,
    deleteFaq,
    patchFaq,
    postFaq,
  };
}
