import clsx from 'clsx';

interface BadgeProps {
  color?: 'primary' | 'secondary' | 'gray';
  children: React.ReactNode;
}

const Badge = ({ color = 'primary', children }: BadgeProps) => {
  return (
    <span
      className={clsx(
        'rounded-xs text-xxs-0.75-medium lg:text-xs-0.875-medium border bg-opacity-10 px-2 py-0.5',
        {
          'border-secondary text-secondary bg-secondary bg-opacity-10':
            color === 'secondary',
          'border-primary bg-primary bg-opacity-10 text-primary':
            color === 'primary',
          'border-neutral-40 text-neutral-40 bg-neutral-40 bg-opacity-[0.12]':
            color === 'gray',
        },
      )}
    >
      {children}
    </span>
  );
};

export default Badge;
