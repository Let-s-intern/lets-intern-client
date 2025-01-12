'use client';

import { programSchema } from '@/schema';
import { PROGRAM_STATUS_KEY, PROGRAM_TYPE_KEY } from '@/utils/programConst';
import axios from 'axios';
import { useEffect, useState } from 'react';

interface BlogCTAProps {
  ctaText: string;
  ctaLink: string;
}

const findProgramIncludingKeyword = async (keyword: string) => {
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

  const handleCtaButtonClick = () => {
    // [이슈] iOS에서 비동기 함수 내의 window.open() 차단 이슈로 open() 함수를 미리 선언
    const open = window.open('', '_self');

    // 모집 중인 챌린지 상세 페이지로 이동
    if (ctaLink!.startsWith('latest:')) {
      const keyword = ctaLink!.split('latest:')[1].trim();
      findProgramIncludingKeyword(keyword).then((program) => {
        ctaLink =
          program === undefined
            ? ''
            : window.location.origin +
              `/program/challenge/${program?.programInfo?.id}`;
        open?.location.assign(ctaLink);
      });
    } else {
      window.open(
        ctaLink!,
        ctaLink?.includes(window.location.origin) ? '_self' : '_blank',
      );
    }
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
            className="w-full px-6 py-3 font-medium rounded-md blog_cta bg-primary text-small18 text-neutral-100"
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
