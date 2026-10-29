import type { ProgramCard } from '../ui/ProgramScroller';

// 프로그램 목록 페이지가 쓰는 공개 목록 API. 서버에서 받아 한 시간 동안 다시 쓴다
const SERVER_API = process.env.NEXT_PUBLIC_SERVER_API;
const REVALIDATE_SECONDS = 60 * 60;

// 노출 순서대로. 분야마다 가장 최근 기수 하나를 보여준다
const CATEGORIES: {
  category: ChallengeCategory;
  label: string;
  match: (title: string) => boolean;
}[] = [
  {
    category: 'experience',
    label: '경험정리',
    match: (t) => t.includes('경험정리'),
  },
  { category: 'resume', label: '이력서', match: (t) => t.includes('이력서') },
  {
    category: 'cover-letter',
    label: '자기소개서',
    match: (t) => t.includes('자기소개서') && !t.includes('대기업'),
  },
  {
    category: 'portfolio',
    label: '포트폴리오',
    match: (t) => t.includes('포트폴리오'),
  },
  // [Live 세미나 전용] 기수는 같은 챌린지의 세미나 참가용이라 제외
  {
    category: 'marketing',
    label: '마케팅',
    match: (t) => t.includes('마케팅') && !t.includes('Live 세미나'),
  },
  { category: 'hr', label: 'HR', match: (t) => t.includes('HR') },
  {
    category: 'pm',
    label: 'PM/서비스기획',
    match: (t) => t.includes('PM') && !t.includes('Live 세미나'),
  },
  {
    category: 'large-corp',
    label: '대기업 자기소개서',
    match: (t) => t.includes('대기업 자기소개서'),
  },
  { category: 'aptitude', label: '인적성', match: (t) => t.includes('인적성') },
];

type ProgramInfo = {
  id: number;
  title: string;
  thumbnail: string | null;
  startDate: string | null;
  // PREV 모집 전, PROCEEDING 모집 중, POST 마감
  programStatusType: 'PREV' | 'PROCEEDING' | 'POST';
};

// 최신순 프로그램 목록. 실패하면 빈 목록
async function fetchPrograms(
  type: 'CHALLENGE' | 'LIVE' | 'VOD',
): Promise<ProgramInfo[]> {
  try {
    const res = await fetch(
      `${SERVER_API}/program?type=${type}&page=1&size=300`,
      {
        next: { revalidate: REVALIDATE_SECONDS },
      },
    );
    if (!res.ok) return [];
    const body: { data: { programList: { programInfo: ProgramInfo }[] } } =
      await res.json();
    return body.data.programList
      .map((p) => p.programInfo)
      .sort((a, b) => (b.startDate ?? '').localeCompare(a.startDate ?? ''));
  } catch {
    return [];
  }
}

export type ChallengeCategory =
  | 'experience'
  | 'resume'
  | 'cover-letter'
  | 'portfolio'
  | 'marketing'
  | 'hr'
  | 'pm'
  | 'large-corp'
  | 'aptitude';

export type ChallengeHighlight = {
  category: ChallengeCategory;
  label: string;
  title: string;
  thumbnail: string;
  href: string;
};

export async function getChallengeHighlights(): Promise<ChallengeHighlight[]> {
  // API 장애 시 카드 없이 '전체 프로그램 보기' 링크만 남는다
  const programs = await fetchPrograms('CHALLENGE');

  return CATEGORIES.flatMap(({ category, label, match }) => {
    const latest = programs.find((p) => match(p.title) && p.thumbnail);
    return latest
      ? [
          {
            category,
            label,
            title: latest.title,
            thumbnail: latest.thumbnail!,
            href: `/program/challenge/${latest.id}`,
          },
        ]
      : [];
  });
}

export type SeminarHighlight = {
  label: string;
  title: string;
  thumbnail: string;
  href: string;
};

// 마감된 최근 LIVE 세미나. 제목 앞 '[🎁무료]' 같은 홍보 표시는 떼고 날짜를 라벨로 쓴다
export async function getSeminarHighlights(
  limit = 10,
): Promise<SeminarHighlight[]> {
  const programs = await fetchPrograms('LIVE');
  return programs
    .filter((p) => p.programStatusType === 'POST' && p.thumbnail)
    .slice(0, limit)
    .map((p) => ({
      label: (p.startDate ?? '').slice(0, 10).replaceAll('-', '.'),
      title: p.title
        .replace(/^\s*\[🎁[^\]]*\]\s*/u, '')
        .replace(/\s+/g, ' ')
        .trim(),
      thumbnail: p.thumbnail!,
      href: `/program/live/${p.id}`,
    }));
}

// 세미나 목록 맨 앞에 두는 대표 미리보기. 옆 세미나 카드와 맞춘 4:3 썸네일을 따로 쓴다
export const featuredSeminarPreview = {
  label: '쥬디 멘토 · 렛츠커리어 CEO',
  title: '2026 취뽀를 위해 반드시 알아야 할 핵심 트렌드',
  thumbnail: '/mentor-join/seminar-preview-judy.png',
  href: 'https://youtu.be/E3qa8fEkj2g',
};

// 최근 등록된 VOD. 시작일이 없어 id가 큰(나중에 등록된) 순으로 고르고, 제목 앞 '[렛츠VOD]' 표시는 뗀다
export async function getVodHighlights(
  limit = 10,
): Promise<SeminarHighlight[]> {
  const programs = await fetchPrograms('VOD');
  return programs
    .filter((p) => p.thumbnail)
    .sort((a, b) => b.id - a.id)
    .slice(0, limit)
    .map((p) => ({
      label: '렛츠커리어 VOD',
      title: p.title.replace(/^\s*\[[^\]]*VOD\]\s*/i, '').trim(),
      thumbnail: p.thumbnail!,
      href: `/program/vod/${p.id}`,
    }));
}

type MentoringOpening = {
  mentorId: number;
  mentorNickname: string;
  title: string;
  thumbnail: string | null;
  representativeCareer: { company: string } | null;
};

// 1:1 LIVE 멘토링을 열어 둔 멘토 중 프로필 이미지가 있는 멘토. 추천(PICK) 멘토가 앞에 오는 API 순서를 그대로 쓴다
export async function getMentoringHighlights(
  limit = 10,
): Promise<ProgramCard[]> {
  try {
    const res = await fetch(`${SERVER_API}/live-mentoring?page=1&size=100`, {
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) return [];
    const body: { data: { openingList: MentoringOpening[] } } =
      await res.json();
    return body.data.openingList
      .filter((o) => o.thumbnail)
      .slice(0, limit)
      .map((o) => ({
        label: [`${o.mentorNickname} 멘토`, o.representativeCareer?.company]
          .filter(Boolean)
          .join(' · '),
        title: o.title,
        thumbnail: o.thumbnail!,
        href: `/live-mentoring/${o.mentorId}`,
        square: true,
      }));
  } catch {
    return [];
  }
}
