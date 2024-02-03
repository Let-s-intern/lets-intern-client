import clsx from 'clsx';

interface Props {
  children: React.ReactNode;
  active?: boolean;
}

const TabItem = ({ children, active }: Props) => {
  return (
    <li
      className={clsx('w-16 cursor-pointer py-2 text-center', {
        'border-b-2 border-zinc-600 font-semibold': active,
      })}
    >
      {children}
    </li>
  );
};

export default TabItem;
