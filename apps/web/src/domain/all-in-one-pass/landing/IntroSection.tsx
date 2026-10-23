'use client';

import LexicalContent from '@/common/lexical/LexicalContent';
import { parseLexicalRoot } from './landingContent';

interface Props {
  introLexical: string;
}

/** 소개 섹션(#intro) — 렉시컬 인트로만. */
export default function IntroSection({ introLexical }: Props) {
  const root = parseLexicalRoot(introLexical);
  if (!root) return null;

  return (
    <section id="intro" className="scroll-mt-20 bg-white">
      <div className="mx-auto w-full max-w-[1040px] break-words px-5 md:px-0">
        <LexicalContent node={root} />
      </div>
    </section>
  );
}
