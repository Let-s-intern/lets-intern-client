import clsx from 'clsx';

interface BadgeProps {
  color?: 'primary' | 'secondary' | 'gray';
  children: React.ReactNode;
  responsive?: boolean;
}

const Badge = ({
  color = 'primary',
  children,
  responsive = false,
}: BadgeProps) => {
  return (
    <span
      className={clsx(
        'text-0.75-medium rounded-xs border bg-opacity-10 px-2.5 py-0.5',
        {
          'lg:text-0.875-medium': responsive,
          'border-secondary bg-secondary bg-opacity-10 text-secondary':
            color === 'secondary',
          'border-primary bg-primary bg-opacity-10 text-primary':
            color === 'primary',
          'border-neutral-40 bg-neutral-40 bg-opacity-[0.12] text-neutral-40':
            color === 'gray',
        },
      )}
    >
      {children}
    </span>
  );
};

export default Badge;
