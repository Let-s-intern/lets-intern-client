import HybridLink from '@/common/HybridLink';

interface EmptySectionProps {
  text: string;
  href: string;
  buttonText: string;
}

const EmptySection = ({ text, href, buttonText }: EmptySectionProps) => {
  return (
    <div className="flex w-full flex-col items-center gap-5 py-[100px] md:py-[200px]">
      <p className="text-xsmall14 text-neutral-20 font-normal">{text}</p>
      <HybridLink
        href={href}
        className="other_program rounded-xxs border-primary text-primary hover:bg-primary/5 flex w-auto items-center justify-center border bg-white px-3 py-1.5 text-sm font-medium transition-colors"
      >
        {buttonText}
      </HybridLink>
    </div>
  );
};

export default EmptySection;
