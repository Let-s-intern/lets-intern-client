import clsx from 'clsx';
import Link from 'next/link';

interface Props {
  type?: 'button' | 'submit' | 'reset' | undefined;
  children: React.ReactNode;
  className?: string;
  to?: string;
  active?: boolean;
  disableHover?: boolean;
  onClick?: () => void;
}

const Button = ({
  type = 'button',
  children,
  className,
  to,
  active,
  disableHover,
  onClick,
}: Props) => {
  const buttonStyle = clsx(
    'rounded-xxs border border-zinc-600 px-4 py-[2px] text-xs',
    className,
    {
      'bg-neutral-700 text-white': active,
      'bg-white': !active,
      'hover:bg-neutral-700 hover:text-white': !active && !disableHover,
    },
  );

  if (to) {
    return (
      <Link href={to} className={clsx(buttonStyle, 'block')} onClick={onClick}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={buttonStyle} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
