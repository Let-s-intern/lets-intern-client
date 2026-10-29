'use client';

import LexicalContent from '@/common/lexical/LexicalContent';
import { parseLexicalRoot } from './landingContent';

interface Props {
  lexical: string;
}

/** 독립 흰색 렉시컬 섹션 — 회색 섹션(후기 등) 뒤에 흰 배경으로 분리해 노출. 비어 있으면 미노출. */
export default function LandingLexicalSection({ lexical }: Props) {
  const root = parseLexicalRoot(lexical);
  if (!root) return null;

  return (
    <section className="bg-white">
      <div className="mx-auto w-full max-w-[1040px] break-words px-5 py-12 md:px-0 md:py-[100px]">
        <LexicalContent node={root} />
      </div>
    </section>
  );
}
