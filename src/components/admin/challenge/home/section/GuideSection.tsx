import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import RoundedBox from '../box/RoundedBox';
import SectionHeading from '../heading/SectionHeading';
import Button from '../../ui/button/Button';
import GuideEditorModal from '../../ui/modal/GuideEditorModal';
import GuideItem from '../item/GuideItem';
import { IGuide } from '../../../../../interfaces/interface';

/* 추후 가이드 개수가 3개보다 많아질 수 있음 */
const GuideSection = () => {
  const [guideList, setGuideList] = useState<IGuide[]>([
    {
      id: '1',
      title: '[미션수행법]',
      link: 'https://naver.com',
      createdAt: '2021-09-01',
    },
    {
      id: '2',
      title: '[환급정책]',
      link: 'https://naver.com',
      createdAt: '2021-09-01',
    },
    {
      id: '3',
      title: '[대시보드 사용설명서]',
      link: 'https://naver.com',
      createdAt: '2021-09-01',
    },
  ]);

  const initValue = {
    id: String(guideList.length + 1),
    title: '',
    link: '',
    createdAt: '2024-05-11',
  };
  const [isModalShown, setIsModalShown] = useState(false);
  const [values, setValues] = useState(initValue);

  const handleSubmit = (e: React.FormEvent<Element>) => {
    // 생성과 수정 구분해야 함
    e.preventDefault();
    setGuideList((prev) => {
      const i = prev.findIndex((guide) => guide.id === values.id);
      if (i === -1) return [values, ...prev];

      prev[i] = values;
      return prev;
    });
    setValues(initValue);
    setIsModalShown(false);
  };

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
          initValue={initValue}
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
