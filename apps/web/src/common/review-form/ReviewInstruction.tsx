import { twMerge } from '@/lib/twMerge';
import { REQUIRED_STYLE } from './ReviewQuestion';

interface Props {
  children: React.ReactNode;
  className?: string;
  required?: boolean;
}

function ReviewInstruction({ children, className, required = false }: Props) {
  return (
    <p
      className={twMerge(
        'text-neutral-30',
        required ? REQUIRED_STYLE : '',
        className,
      )}
    >
      {children}
    </p>
  );
}

export default ReviewInstruction;
