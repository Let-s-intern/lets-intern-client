import { Link } from 'react-router-dom';

interface ProgramArticleProps {
  title: string;
  description: string;
  children?: React.ReactNode;
}

const ProgramArticle = ({
  title,
  description,
  children,
}: ProgramArticleProps) => {
  return (
    <article>
      <div className="flex items-center justify-between">
        <div className="mb-6">
          <h1 className="text-1.125-bold">{title}</h1>
          <span className="text-0.875 text-neutral-20">{description}</span>
        </div>
        <Link className="text-0.75 text-neutral-40" to={`/program/challenge`}>
          전체보기
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-5">{children}</div>
    </article>
  );
};

export default ProgramArticle;
