import clsx from 'clsx';

interface Props {
  children: React.ReactNode;
  className?: string;
}

const Heading = ({ children, className }: Props) => {
  return <h2 className={clsx('text-xl font-medium', className)}>{children}</h2>;
};

export default Heading;
