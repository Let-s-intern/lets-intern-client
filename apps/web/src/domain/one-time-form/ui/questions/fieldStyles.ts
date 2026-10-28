import { twMerge } from '@/lib/twMerge';

/** 시안 .input/.select/.textarea. 오류면 테두리를 requirement 로 */
export const textFieldClassName = (hasError: boolean, className?: string) =>
  twMerge(
    'border-neutral-80 bg-static-100 text-xsmall14 placeholder:text-neutral-45 hover:border-neutral-70 focus:border-primary focus:ring-primary-10 h-12 w-full rounded-sm border px-3.5 outline-none transition-colors focus:ring-[3px]',
    hasError && 'border-requirement hover:border-requirement',
    className,
  );
