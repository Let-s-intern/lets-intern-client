import SolidButton from '@/common/button/SolidButton';
import Link from 'next/link';
import { motion } from 'motion/react';

interface HeroCopy {
  eyebrow: string;
  title: string;
  body: string;
  primaryCta: string;
  secondaryCta: string;
  homeCta?: string;
}

interface CurationHeroProps {
  copy: HeroCopy;
  onStart?: () => void;
  onScrollToComparison?: () => void;
}

const CurationHero = ({ copy, onStart, onScrollToComparison }: CurationHeroProps) => {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-primary-10 via-white to-primary-5">
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-y-6 px-6 py-16 md:flex-row md:items-center md:justify-between md:py-24">
        <div className="flex max-w-xl flex-col gap-y-4">
          <p className="inline-flex w-fit items-center gap-2 rounded-full bg-primary-15 px-3 py-1 text-xs font-semibold text-primary">
            {copy.eyebrow}
          </p>
          <h1 className="text-medium24 font-bold leading-tight text-neutral-0 md:text-medium28">
            {copy.title}
          </h1>
          <p className="text-xsmall16 text-neutral-30 md:text-small18">{copy.body}</p>
          <div className="flex flex-wrap gap-3 pt-2">
            <SolidButton onClick={onStart} size="xl">
              {copy.primaryCta}
            </SolidButton>
            <SolidButton variant="secondary" size="xl" onClick={onScrollToComparison}>
              {copy.secondaryCta}
            </SolidButton>
          </div>
          {copy.homeCta && (
            <Link
              href="/"
              className="w-fit text-xsmall14 font-semibold text-neutral-40 underline underline-offset-2 transition-colors hover:text-primary"
            >
              {copy.homeCta}
            </Link>
          )}
        </div>
        <motion.div
          className="relative mt-6 grid w-full max-w-sm grid-cols-2 gap-3 rounded-2xl bg-white p-4 shadow-lg md:mt-0"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {['경험정리 2주', '이력서 1주', '자소서 2주', '포트폴리오 2주'].map((item) => (
            <div
              key={item}
              className="rounded-lg border border-primary-20 bg-primary-5 px-3 py-4 text-center text-xsmall14 font-semibold text-neutral-10"
            >
              {item}
            </div>
          ))}
          <div className="col-span-2 flex items-center justify-between rounded-lg bg-gradient-to-r from-primary to-primary-80 px-4 py-3 text-white">
            <div className="text-left text-small18 font-semibold">특화 트랙</div>
            <div className="text-right text-xsmall14">대기업 · 마케팅 · HR</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CurationHero;
