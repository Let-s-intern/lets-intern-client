import LexicalContent from '@/domain/blog/ui/LexicalContent';
import { ChallengeContent } from '@/types/interface';

type FreeTemplateLayoutProps = {
  freeContent?: ChallengeContent['freeContent'];
};

function FreeTemplateLayout({ freeContent }: FreeTemplateLayoutProps) {
  return (
    <div className="flex w-full flex-col items-center overflow-x-hidden">
      <section className="mx-auto flex w-full max-w-[1000px] flex-col px-5 pb-16 pt-6 md:px-10 md:pt-10 lg:px-0">
        {freeContent?.root && <LexicalContent node={freeContent.root} />}
      </section>
    </div>
  );
}

export default FreeTemplateLayout;
