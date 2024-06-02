import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';

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
  const getGuideList = async () => {
    try {
      const res = await axios.get(`/challenge-guide/admin/${params.programId}`);
      if (res.status !== 200) {
        throw new Error(res.data.message);
      }
      setGuideList(res.data.challengeGuideAdminList);
    } catch (error) {
      console.error(error);
    }
  };

  const params = useParams();
  const [guideList, setGuideList] = useState<IGuide[]>([]);
  const [isModalShown, setIsModalShown] = useState(false);
  const [values, setValues] = useState<IGuide>(initialValue);

  const { isLoading } = useQuery({
    queryKey: ['challenge-guide', 'admin', params.programId],
    queryFn: getGuideList,
  });

  const postMutation = useMutation({
    mutationFn: async (guide: IGuide) => {
      const res = await axios.post(
        `/challenge-guide/${params.programId}`,
        guide,
      );
      if (res.status !== 200) throw new Error(res.data.message);
    },
    onError(error) {
      console.error(error);
    },
  });
  const patchMutation = useMutation({
    mutationFn: async (guide: IGuide) => {
      const res = await axios.patch(
        `/challenge-guide/${params.programId}`,
        guide,
      );
      if (res.status !== 200) throw new Error(res.data.message);
    },
    onError(error) {
      console.error(error);
    },
  });

  const createGuide = () => {
    setGuideList((prev) => [values, ...prev]);
    postMutation.mutate(values);
  };
  const editGuide = (index: number) => {
    setGuideList((prev) => [
      ...prev.slice(0, index),
      values,
      ...prev.slice(index + 1),
    ]);
    patchMutation.mutate(values);
  };
  const handleSubmit = (e: React.FormEvent<Element>) => {
    e.preventDefault();
    const i = guideList.findIndex((guide) => guide.id === values.id);
    if (i === -1) createGuide();
    else editGuide(i);

    setValues(initialValue);
    setIsModalShown(false);
  };

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
