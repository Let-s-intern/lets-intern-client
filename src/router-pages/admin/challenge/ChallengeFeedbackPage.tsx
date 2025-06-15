import EditorApp from '@components/admin/lexical/EditorApp';
import Heading2 from '@components/admin/ui/heading/Heading2';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ChallengeFeedbackPage() {
  const {
    missionTitle,
    missionRound,
    major,
    wishCompany,
    wishJob,
    link,
    name,
  } = JSON.parse(localStorage.getItem('attendance')!);
  const { challengeOptionCode } = JSON.parse(localStorage.getItem('mission')!);

  const list = [
    `${missionTitle} / ${missionRound}회차`,
    `피드백 유형: ${challengeOptionCode}`,
    `참여자 정보: ${major} / ${wishCompany} / ${wishJob}`,
    <Link
      key={link}
      to={link}
      className="text-primary underline"
      target="_blank"
      rel="noopener noreferrer"
    >
      미션 제출 링크
    </Link>,
  ];

  const [content, setContent] = useState('');

  const onChangeEditor = (jsonString: string) => {
    setContent(jsonString);
  };

  return (
    <div className="mt-5 px-5">
      <Heading2 className="mb-2">{name} 피드백</Heading2>
      <ul className="list-inside list-disc">
        {list.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
      <EditorApp onChange={onChangeEditor} />
    </div>
  );
}
