import type { DifferentiatorMentor } from '../data/mentors';

/**
 * S6 차별점2 멘토 카드 — 로고·실루엣·회사·한줄 소개가 baked-in 된 카드 이미지를
 * 렌더한다. 텍스트가 이미지에 포함되어 있어 접근성용 alt 만 데이터에서 조합한다.
 */
const MentorProfileCard = ({ mentor }: { mentor: DifferentiatorMentor }) => {
  const alt = mentor.desc
    ? `${mentor.company} — ${mentor.desc}`
    : mentor.company;

  return (
    <img
      src={mentor.image}
      alt={alt}
      loading="lazy"
      className="w-full rounded-md"
    />
  );
};

export default MentorProfileCard;
