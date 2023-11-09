import { useNavigate, useParams } from 'react-router-dom';
import Markdown from 'react-markdown';

import programs from '../data/programs.json';

import '../styles/github-markdown-light.css';

const ProgramDetail = () => {
  const navigate = useNavigate();
  const { id = '' } = useParams<{ id: string }>();

  const program = programs.find(
    (program: { id: number }) => program.id === parseInt(id),
  );

  return (
    <div className="markdown-body container mx-auto p-5">
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
      <h1>{program?.title}</h1>
      <Markdown>{program?.detail}</Markdown>
    </div>
  );
};

export default ProgramDetail;
