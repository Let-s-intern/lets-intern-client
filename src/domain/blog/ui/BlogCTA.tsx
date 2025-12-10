'use client';

import { ProgramInfo, programSchema } from '@/schema';
import axios from '@/utils/axios';
import { PROGRAM_STATUS_KEY, PROGRAM_TYPE_KEY } from '@/utils/programConst';
import { useEffect, useState } from 'react';

interface BlogCTAProps {
  ctaText: string;
  ctaLink: string;
}

const findProgramIncludingKeyword = async (
  keyword: string,
): Promise<ProgramInfo> => {
  const res = await axios.get('/program', {
    params: {
      pageable: { page: 1, size: 10000 },
      type: PROGRAM_TYPE_KEY.CHALLENGE,
      status: PROGRAM_STATUS_KEY.PROCEEDING,
    },
  });
  const programList = programSchema
    .parse(res.data.data)
    .programList.filter((item) => item.programInfo.title?.includes(keyword));
  // 마감일이 가장 빠른 프로그램을 찾아서 반환
  return programList.reduce(
    (latest, program) =>
      program.programInfo.deadline! < latest.programInfo.deadline!
        ? program
        : latest,
    programList[0],
  );
};

const BlogCTA = ({ ctaText, ctaLink }: BlogCTAProps) => {
  const [showCTA, setShowCTA] = useState(false);
  const [programIncludingKeyword, setProgramIncludingKeyword] =
    useState<ProgramInfo | null>(null);
  const isLatest = ctaLink?.startsWith('latest:');

  useEffect(() => {
    if (!ctaLink) {
      return;
    }

    if (isLatest) {
      const keyword = ctaLink.split('latest:')[1].trim();
      findProgramIncludingKeyword(keyword).then((program) => {
        setProgramIncludingKeyword(program);
      });
    }
  }, [ctaLink, isLatest]);

  const handleCtaButtonClick = () => {
    if (!ctaLink) {
      return;
    }

    if (isLatest) {
      if (!programIncludingKeyword) {
        // eslint-disable-next-line no-console
        console.log(`no latest program for ${ctaLink}`);
        return;
      }

      window.open(
        window.location.origin +
          `/program/challenge/${programIncludingKeyword.programInfo.id}`,
        '_self',
      );

      return;
    }

    window.open(
      ctaLink,
      ctaLink.includes(window.location.origin) ? '_self' : '_blank',
    );
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowCTA(window.scrollY > window.innerHeight / 2);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-0 left-0 flex w-full items-center justify-center pb-6 pt-3 transition-all duration-150 ${showCTA ? 'translate-y-0' : 'translate-y-full'}`}
    >
      <div className="flex w-full max-w-[1200px] flex-col items-center px-5 md:px-10">
        <div className="flex w-full flex-col items-center md:px-[100px]">
          <button
            className="blog_cta w-full rounded-md bg-primary px-6 py-3 text-small18 font-medium text-neutral-100"
            onClick={handleCtaButtonClick}
          >
            {ctaText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogCTA;
