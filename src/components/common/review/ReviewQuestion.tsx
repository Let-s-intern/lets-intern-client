import { twMerge } from '@/lib/twMerge';

interface Props {
  children: React.ReactNode;
  required?: boolean;
}

const REQUIRED_STYLE =
  'relative after:absolute after:text-requirement after:content-["*"]';

function ReviewQuestion({ children, required = false }: Props) {
  return (
    <p
      className={twMerge(
        'text-xsmall16 font-bold text-neutral-0',
        required ? REQUIRED_STYLE : '',
      )}
    >
      {children}
    </p>
  );
}

export default ReviewQuestion;
