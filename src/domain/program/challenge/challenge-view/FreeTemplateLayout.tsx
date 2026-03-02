import LexicalContent from '@/domain/blog/ui/LexicalContent';
import { ChallengeContent } from '@/types/interface';
import { ReactNode } from 'react';

interface FreeTemplateLayoutProps {
  header: ReactNode;
  freeContent?: ChallengeContent['freeContent'];
}

function FreeTemplateLayout({ header, freeContent }: FreeTemplateLayoutProps) {
  return (
    <div className="flex w-full flex-col">
      <div className="flex w-full flex-col items-center">
        {header}
        <div className="flex w-full flex-col items-center overflow-x-hidden">
          <section className="mx-auto flex w-full max-w-[1000px] flex-col px-5 pb-16 pt-6 md:px-10 md:pt-10 lg:px-0">
            {freeContent?.root &&
              typeof freeContent.root === 'object' &&
              'type' in freeContent.root && (
                <LexicalContent node={freeContent.root} />
              )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default FreeTemplateLayout;
