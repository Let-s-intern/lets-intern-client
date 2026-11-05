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

/** 목록 페이지. 상세 주소는 서버가 공개 조건으로 골라준 것만 넣는다 */
const STATIC_PATHS = ['/', '/program', '/blog/list', '/library/list'];

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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getCanonicalSiteUrl();
  const { magnetList, blogList, programList } = await fetchSitemapPages();

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
  ];
}
