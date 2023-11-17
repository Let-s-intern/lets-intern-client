import { Outlet, useNavigate, useParams } from 'react-router-dom';
import Markdown from 'react-markdown';
import styled from 'styled-components';

import Button from '../components/Button';

import '../styles/github-markdown-light.css';

import programs from '../data/programs.json';
import { useEffect, useState } from 'react';

const FloatingActionButton = styled(Button)`
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.25);
`;

const ProgramDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [program, setProgram] = useState<any>(null);

  useEffect(() => {
    if (!program || !id) return;
    const newProgram: any = programs.find(
      (program: { id: number }) => program.id === parseInt(id),
    );
    setProgram(newProgram);
  }, [id]);

  return (
    <div className="container mx-auto p-5">
      {/* 이전으로 돌아가기 버튼 */}
      <div>
        <button className="h-7 w-7" onClick={() => navigate(-1)}>
          <i>
            <img
              src="/icons/back-icon.svg"
              alt="이전 버튼"
              className="w-full"
            />
          </i>
        </button>
      </div>
      {/* 본문 */}
      <div className="mt-5">
        <div className="markdown-body">
          <h1>{program?.title}</h1>
          <Markdown>{program?.detail}</Markdown>
        </div>
      </div>
      {/* 하단 섹션 */}
      <div className="fixed left-0 top-0 z-30">
        {/* 신청하기 플로팅 액션 버튼 */}
        <div className="fixed bottom-5 flex w-full justify-start px-5 sm:justify-center">
          <FloatingActionButton
            to={`/program/${program?.id}/apply`}
            className="w-full px-10 sm:w-auto"
          >
            신청하기
          </FloatingActionButton>
        </div>
        {/* 신청폼 모달 */}
        <Outlet />
      </div>
    </div>
  );
};

export default ProgramDetail;
