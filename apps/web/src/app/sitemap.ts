import { ProgramType } from '@/types/common';
import {
  getBlogPathname,
  getCanonicalSiteUrl,
  getLibraryPathname,
  getProgramPathname,
} from '@/utils/url';
import { fetchJson } from '@letscareer/api';
import type { MetadataRoute } from 'next';
import { z } from 'zod';

// 검색엔진이 하루 안에 새 글을 알도록 1시간마다 다시 만든다
export const revalidate = 3600;

const pageSchema = z.object({
  id: z.number(),
  title: z.string().nullable(),
  lastModifiedDate: z.string().nullable(),
});

const sitemapResponseSchema = z.object({
  magnetList: z.array(pageSchema),
  blogList: z.array(pageSchema),
  programList: z.array(
    pageSchema.extend({
      programType: z.enum(['CHALLENGE', 'LIVE', 'VOD', 'GUIDEBOOK']),
    }),
  ),
});

/** 열려 있는 멘토링의 멘토 id 만 쓴다. 나머지 필드가 바뀌어도 사이트맵이 깨지지 않게 최소만 읽는다 */
const mentoringOpeningListSchema = z.object({
  openingList: z.array(z.object({ mentorId: z.number() })),
});

/** 목록 페이지. 상세 주소는 서버가 공개 조건으로 골라준 것만 넣는다 */
const STATIC_PATHS = [
  '/',
  '/program',
  '/blog/list',
  '/library/list',
  '/mentors',
  '/bigfirm',
];

/** 서버 `max-page-size` 기본값 — 열려 있는 개설 전체를 한 페이지로 받는다 */
const ALL_OPENINGS_SIZE = 2000;

const toLastModified = (date: string | null) =>
  date ? new Date(date) : undefined;

/**
 * 서버를 못 부르면 목록 페이지만 낸다. 빌드가 서버에 묶이지 않게 한다
 * (CI 는 가짜 API 주소로 빌드하고, 서버보다 웹이 먼저 배포될 수도 있다). 상세는 다음 재생성 때 채워진다
 */
async function fetchSitemapPages() {
  try {
    return await fetchJson(`${process.env.NEXT_PUBLIC_SERVER_API}/sitemap`, {
      code: 'SITEMAP_FETCH_FAILED',
      displayMessage: 'sitemap 조회에 실패했습니다.',
      parse: (data) => sitemapResponseSchema.parse(data),
    });
  } catch (error) {
    console.error('[sitemap] 서버 조회 실패, 목록 페이지만 냅니다', error);
    return { magnetList: [], blogList: [], programList: [] };
  }
}

/**
 * 판매 중인 멘토링 상세(`/live-mentoring/{mentorId}`)의 멘토 id. 같은 멘토가 개설을
 * 여러 번 열 수 있어 중복을 걷는다. 실패해도 다른 주소는 그대로 나간다
 */
async function fetchMentoringMentorIds(): Promise<number[]> {
  try {
    const { openingList } = await fetchJson(
      `${process.env.NEXT_PUBLIC_SERVER_API}/live-mentoring?page=1&size=${ALL_OPENINGS_SIZE}`,
      {
        code: 'SITEMAP_MENTORING_FETCH_FAILED',
        displayMessage: '멘토링 목록 조회에 실패했습니다.',
        parse: (data) => mentoringOpeningListSchema.parse(data),
      },
    );
    return [...new Set(openingList.map((opening) => opening.mentorId))];
  } catch (error) {
    console.error(
      '[sitemap] 멘토링 목록 조회 실패, 멘토링 상세를 뺍니다',
      error,
    );
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getCanonicalSiteUrl();
  const [{ magnetList, blogList, programList }, mentorIds] = await Promise.all([
    fetchSitemapPages(),
    fetchMentoringMentorIds(),
  ]);

  return [
    ...STATIC_PATHS.map((path) => ({ url: `${siteUrl}${path}` })),
    ...programList.map((program) => ({
      url:
        siteUrl +
        getProgramPathname({
          programType: program.programType.toLowerCase() as ProgramType,
          id: program.id,
          title: program.title,
        }),
      lastModified: toLastModified(program.lastModifiedDate),
    })),
    ...blogList.map((blog) => ({
      url: siteUrl + getBlogPathname(blog),
      lastModified: toLastModified(blog.lastModifiedDate),
    })),
    ...magnetList.map((magnet) => ({
      url: siteUrl + getLibraryPathname(magnet),
      lastModified: toLastModified(magnet.lastModifiedDate),
    })),
    ...mentorIds.map((mentorId) => ({
      url: `${siteUrl}/live-mentoring/${mentorId}`,
    })),
  ];
}
