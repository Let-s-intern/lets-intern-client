'use client';

import { useUserQuery } from '@/api/user/user';
import { capturePastSeminarClick } from '../analytics';
import { PastSeminarMentor } from '../data/pastSeminars';

/**
 * 지난 인기 세미나 멘토 카드 — 유튜브 미리보기 링크 + 클릭 시 PostHog 캡처.
 * 통이미지(모바일 세로/데스크톱 가로)만 렌더하는 얇은 client 래퍼(섹션은 RSC 유지).
 */
const PastSeminarCard = ({ mentor }: { mentor: PastSeminarMentor }) => {
  const { data: user } = useUserQuery();

  return (
    <a
      href={mentor.videoUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() =>
        capturePastSeminarClick({
          mentorId: mentor.id,
          mentorName: mentor.name,
          videoUrl: mentor.videoUrl,
          userId: user?.userId,
        })
      }
      className="block transition-opacity hover:opacity-95"
    >
      {/* 모바일: 세로형 카드 이미지 */}
      <img
        src={mentor.mobileImage}
        alt={mentor.alt}
        loading="lazy"
        className="w-full rounded-xl md:hidden"
      />
      {/* 데스크톱: 가로형 카드 이미지 */}
      <img
        src={mentor.image}
        alt={mentor.alt}
        loading="lazy"
        className="hidden w-full rounded-xl md:block"
      />
    </a>
  );
};

export default PastSeminarCard;
