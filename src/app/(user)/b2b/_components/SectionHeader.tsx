'use client';

import { twMerge } from '@/lib/twMerge';
import { Break } from '@components/common/Break';
import { motion } from 'motion/react';

type Props = {
  kicker?: React.ReactNode; // blue text 16 medium
  title: React.ReactNode; // h2
  desc?: React.ReactNode; // paragraph
  align?: 'left' | 'center';
  theme?: 'light' | 'dark'; // dark -> white text
  kickerBg?: boolean; // optional pill bg for kicker
  className?: string;
};

/**
 * B2B Section Header
 * Mobile spec (<= md):
 * - Kicker (blue): 16 / medium
 * - Title (h2): 26px
 * - Description: 14px
 * Desktop keeps existing scale while unifying semantics.
 */
export default function SectionHeader({
  kicker,
  title,
  desc,
  align = 'left',
  theme = 'light',
  kickerBg = false,
  className,
}: Props) {
  const isCenter = align === 'center';
  const isDark = theme === 'dark';

  return (
    <div className={twMerge(isCenter ? 'text-center' : 'text-left', className)}>
      {kicker != null && (
        <motion.p
          className={twMerge(
            'text-xsmall16 font-medium text-primary-90',
            kickerBg && 'inline-block rounded-xs bg-primary-5 px-2 py-1',
            isCenter && 'mx-auto',
          )}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px 0px -10% 0px' }}
          transition={{ duration: 0.55 }}
        >
          {kicker}
        </motion.p>
      )}

      <motion.h2
        className={twMerge(
          'mt-4 break-keep text-[26px] font-bold leading-[1.35] md:mt-6',
          'md:text-[40px]',
          isDark ? 'text-white' : 'text-static-0',
        )}
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '0px 0px -10% 0px' }}
        transition={{ duration: 0.55 }}
      >
        {title}
      </motion.h2>

      {desc != null && (
        <motion.p
          className={twMerge(
            'mt-4 break-keep text-xsmall14 leading-[22px]',
            isDark ? 'text-white/70' : 'text-neutral-40',
            'md:text-small20',
          )}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px 0px -10% 0px' }}
          transition={{ duration: 0.55, delay: 0.05 }}
        >
          {desc}
        </motion.p>
      )}
    </div>
  );
}

// Re-export Break for convenience when composing titles/descriptions.
export { Break };
