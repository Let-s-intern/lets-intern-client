import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import RoundedBox from '../box/RoundedBox';
import SectionHeading from '../heading/SectionHeading';
import Button from '../../ui/button/Button';
import GuideEditorModal from '../../ui/modal/GuideEditorModal';
import GuideItem from '../item/GuideItem';
import { IGuide } from '../../../../../interfaces/interface';
import axios from '../../../../../utils/axios';

const initialValue = {
  title: '',
  link: '',
};

/* 추후 가이드 개수가 3개보다 많아질 수 있음 */
const GuideSection = () => {
  const params = useParams();
  const queryClient = useQueryClient();

  const [guideList, setGuideList] = useState<IGuide[]>([]);
  const [isModalShown, setIsModalShown] = useState(false);
  const [values, setValues] = useState<IGuide>(initialValue);

  const { isLoading } = useQuery({
    queryKey: ['challenge-guide', 'admin', params.programId],
    queryFn: async ({ queryKey }) => {
      const res = await axios.get(
        `/api/v1/challenge-guide/admin/${queryKey[2]}`,
      );
      if (res.status !== 200) {
        throw new Error(`${res.status} ${res.statusText}`);
      }
      const data = res.data;
      setGuideList(data.challengeGuideAdminList);
      return data;
    },
  });

  const handleSubmit = (e: React.FormEvent<Element>) => {
    e.preventDefault();
    setGuideList((prev) => {
      const i = prev.findIndex((guide) => guide.id === values.id);
      // 가이드 생성
      if (i === -1) {
        addGuide.mutate(values);
        return [values, ...prev];
      }
      // 가이드 수정
      editGuide.mutate(values);
      return [...prev.slice(0, i), values, ...prev.slice(i + 1)];
    });
    setValues(initialValue);
    setIsModalShown(false);
  };

  const addGuide = useMutation({
    mutationFn: async (guide: IGuide) => {
      const res = await axios.post(
        `/api/v1/challenge-guide/${params.programId}`,
        guide,
      );
      const data = res.data;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['challenge-guide', 'admin', params.programId],
      });
    },
  });

  const editGuide = useMutation({
    mutationFn: async (guide: IGuide) => {
      const res = await axios.patch(
        `/api/v1/challenge-guide/${params.programId}`,
        guide,
      );
      const data = res.data;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['challenge-guide', 'admin', params.programId],
      });
    },
  });

  if (isLoading) return <></>;

  return (
    <>
      <RoundedBox
        as="section"
        className="flex w-[50%] flex-col justify-between px-8 py-6"
      >
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <SectionHeading>챌린지 가이드</SectionHeading>
            <Button onClick={() => setIsModalShown(true)}>등록</Button>
          </div>
          <ul className="flex flex-col gap-2">
            {guideList.map((guide: IGuide) => (
              <GuideItem
                key={guide.id}
                guide={guide}
                setValues={setValues}
                setIsModalShown={setIsModalShown}
              />
            ))}
          </ul>
        </div>
      </RoundedBox>

      {isModalShown && (
        <GuideEditorModal
          initValue={initialValue}
          values={values}
          setIsModalShown={setIsModalShown}
          onSubmit={handleSubmit}
          setValues={setValues}
        />
      )}
    </>
  );
};

export default GuideSection;
