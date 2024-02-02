import { Link } from 'react-router-dom';

interface ProgramCardProps {
  to: string;
  children: React.ReactNode;
}

const ProgramCard = ({ to, children }: ProgramCardProps) => {
  return (
    <article className="program-card">
      <Link to={to}>{children}</Link>
    </article>
  );
};

export default ProgramCard;
