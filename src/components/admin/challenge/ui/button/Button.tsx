import { Link } from 'react-router-dom';
import clsx from 'clsx';

interface Props {
  children: React.ReactNode;
  className?: string;
  to?: string;
}

const Button = ({ children, className, to }: Props) => {
  const buttonStyle = clsx(
    'rounded border border-zinc-600 px-4 py-[2px] text-xs',
    className,
  );

  if (to) {
    return (
      <Link to={to} className={clsx(buttonStyle, 'block')}>
        {children}
      </Link>
    );
  }

  return <button className={buttonStyle}>{children}</button>;
};

export default Button;
