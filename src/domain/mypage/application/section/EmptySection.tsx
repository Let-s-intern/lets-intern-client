import HybridLink from '@/common/HybridLink';

interface EmptySectionProps {
  text: string;
  href: string;
  buttonText: string;
}

const EmptySection = ({ text, href, buttonText }: EmptySectionProps) => {
  return (
    <div className="flex w-full flex-col items-center gap-5 py-[100px] md:py-[200px]">
      <p className="text-xsmall14 font-normal text-neutral-20">{text}</p>
      <HybridLink
        href={href}
        className="other_program flex w-auto items-center justify-center rounded-xxs border border-primary bg-white px-3 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-primary/5"
      >
        {buttonText}
      </HybridLink>
    </div>
  );
};

export default EmptySection;
