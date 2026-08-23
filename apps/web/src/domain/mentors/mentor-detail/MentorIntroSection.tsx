import type { SerializedLexicalNode } from 'lexical';

import type { MentorDetailData } from '@/api/mentor/mentorSchema';
import EmptyContainer from '@/common/container/EmptyContainer';
import LexicalContent from '@/common/lexical/LexicalContent';

interface MentorIntroSectionProps {
  mentor: MentorDetailData;
}

const parseLexicalRoot = (
  json: string | null | undefined,
): SerializedLexicalNode | null => {
  if (!json) return null;
  try {
    const parsed = JSON.parse(json);
    if (
      parsed?.root &&
      typeof parsed.root === 'object' &&
      'type' in parsed.root
    ) {
      return parsed.root;
    }
    return null;
  } catch {
    return null;
  }
};

const MentorIntroSection = ({ mentor }: MentorIntroSectionProps) => {
  const { introduction, description } = mentor.mentorInfo;
  const descriptionRoot = parseLexicalRoot(description);

  const hasIntroduction = !!introduction;
  const hasDescription = !!descriptionRoot;

  return (
    <section className="w-full">
      <div className="flex flex-col gap-6">
        <h2 className="text-medium22 text-neutral-0 font-bold">멘토 소개</h2>
        <div className="flex flex-col gap-6">
          {!hasIntroduction && !hasDescription ? (
            <EmptyContainer text="아직 등록된 소개가 없습니다." />
          ) : (
            <>
              {hasIntroduction && (
                <div className="flex flex-col gap-2">
                  <p className="text-xsmall16 flex items-center gap-1 font-semibold">
                    <img src="/icons/message-dots.svg" alt="" />
                    <span>멘토님의 한마디</span>
                  </p>
                  <p className="text-xsmall16 whitespace-pre-line leading-relaxed">
                    {introduction}
                  </p>
                </div>
              )}

              {hasDescription && descriptionRoot && (
                <LexicalContent node={descriptionRoot} />
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default MentorIntroSection;
