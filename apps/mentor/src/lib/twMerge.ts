import { extendTailwindMerge } from 'tailwind-merge';

export const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        'text-xs',
        'text-sm',
        'text-base',
        'text-lg',
        'text-xl',
        'text-2xl',
        'text-3xl',
        'text-4xl',
        'text-5xl',
        'text-6xl',
        'text-7xl',
        'text-8xl',
        'text-9xl',
        'text-xxlarge36',
        'text-xxlarge32',
        'text-xlarge28',
        'text-large26',
        'text-medium24',
        'text-medium22',
        'text-small20',
        'text-small18',
        'text-xsmall16',
        'text-xsmall14',
        'text-xxsmall12',
      ],
    },
  },
});
