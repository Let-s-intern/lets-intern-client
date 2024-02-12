import clsx from 'clsx';

interface Props {
  children?: React.ReactNode;
  className?: string;
  as?: string;
}

const RoundedBox = ({ children, className, as }: Props) => {
  const boxStyle = clsx(
    'overflow-hidden rounded-2xl border border-neutral-200',
    className,
  );

  if (as === 'section') {
    return <section className={boxStyle}>{children}</section>;
  }

  return <div className={boxStyle}>{children}</div>;
};

export default RoundedBox;
