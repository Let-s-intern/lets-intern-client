import { Link } from 'react-router-dom';
import clsx from 'clsx';

interface Props {
  children: React.ReactNode;
  className?: string;
  to?: string;
  onClick?: () => void;
}

const Button = ({ children, className, to, onClick }: Props) => {
  const buttonStyle = clsx(
    'rounded border border-zinc-600 px-4 py-[2px] text-xs',
    className,
  );

  if (to) {
    return (
      <Link to={to} className={clsx(buttonStyle, 'block')} onClick={onClick}>
        {children}
      </Link>
    );
  }

  return (
    <button className={buttonStyle} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
