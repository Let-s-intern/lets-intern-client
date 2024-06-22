import { Link } from 'react-router-dom';

interface ProgramCardRegacyProps {
  to: string;
  children: React.ReactNode;
}

const ProgramCardRegacy = ({ to, children }: ProgramCardRegacyProps) => {
  return (
    <article className="program-card">
      <Link to={to}>{children}</Link>
    </article>
  );
};

export default ProgramCardRegacy;
