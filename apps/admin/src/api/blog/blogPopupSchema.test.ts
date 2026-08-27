import { describe, expect, it } from 'vitest';

import {
  adminBlogPopupListSchema,
  adminBlogPopupSchema,
} from './blogPopupSchema';

/**
 * 서버 응답이 이 스키마를 통과하는지만 본다. 필드 이름이 하나만 어긋나도 화면은
 * 조용히 빈 값을 그린다 (`.claude/rules/non-compiler-links.md`).
 *
 * 아래 페이로드는 로컬 서버의 `/v3/api-docs` 에 실린 `AdminBlogPopupVo`,
 * `AdminBlogPopupDetailVo` 스키마를 그대로 옮긴 것이다. 실호출로 녹화하지 못한 이유는
 * `blog_popup` 테이블이 아직 생성되지 않았고 어드민 토큰도 없어 403 이 나기 때문이다.
 * 테이블이 생긴 뒤에는 실응답으로 다시 녹화한다.
 */

const listResponse = {
  blogPopupList: [
    {
      blogPopupId: 1,
      title: '1대1 라이브 멘토링 홍보',
      link: 'https://letscareer.co.kr/live-mentoring?utm_source=blog',
      targetType: 'SELECTED',
      targetBlogCount: 3,
      isVisible: true,
      startDate: '2026-09-01T00:00:00',
      endDate: '2026-09-30T23:59:59',
      impressionCount: 1200,
      clickCount: 37,
      clickRate: 3.1,
      priority: 1,
    },
  ],
  pageInfo: {
    pageNum: 0,
    pageSize: 10,
    totalElements: 1,
    totalPages: 1,
  },
};

const detailResponse = {
  blogPopupInfo: {
    blogPopupId: 1,
    title: '1대1 라이브 멘토링 홍보',
    imageUrl: 'https://cdn.letscareer.co.kr/banner/blog/popup.png',
    link: 'https://letscareer.co.kr/live-mentoring?utm_source=blog',
    targetType: 'SELECTED',
    blogIds: [12, 34, 56],
    triggerRatio: 1.0,
    priority: 1,
    isVisible: true,
    startDate: '2026-09-01T00:00:00',
    endDate: '2026-09-30T23:59:59',
    impressionCount: 1200,
    clickCount: 37,
  },
};

describe('adminBlogPopupListSchema', () => {
  it('목록 응답을 파싱한다', () => {
    const parsed = adminBlogPopupListSchema.parse(listResponse);

    expect(parsed.blogPopupList[0].clickRate).toBe(3.1);
    expect(parsed.blogPopupList[0].targetBlogCount).toBe(3);
    expect(parsed.pageInfo.totalElements).toBe(1);
  });

  it('팝업이 없으면 빈 배열이다', () => {
    const parsed = adminBlogPopupListSchema.parse({
      blogPopupList: [],
      pageInfo: { pageNum: 0, pageSize: 10, totalElements: 0, totalPages: 0 },
    });

    expect(parsed.blogPopupList).toEqual([]);
  });

  it('전체 노출 팝업은 targetBlogCount 가 0 이다', () => {
    const parsed = adminBlogPopupListSchema.parse({
      ...listResponse,
      blogPopupList: [
        {
          ...listResponse.blogPopupList[0],
          targetType: 'ALL',
          targetBlogCount: 0,
        },
      ],
    });

    expect(parsed.blogPopupList[0].targetType).toBe('ALL');
    expect(parsed.blogPopupList[0].targetBlogCount).toBe(0);
  });

  it('제목·링크·기간이 비어 있어도 파싱된다', () => {
    const parsed = adminBlogPopupListSchema.parse({
      ...listResponse,
      blogPopupList: [
        {
          ...listResponse.blogPopupList[0],
          title: null,
          link: null,
          startDate: null,
          endDate: null,
        },
      ],
    });

    expect(parsed.blogPopupList[0].title).toBeNull();
  });

  it('우선순위를 파싱한다', () => {
    const parsed = adminBlogPopupListSchema.parse(listResponse);

    expect(parsed.blogPopupList[0].priority).toBe(1);
  });

  it('우선순위가 null 이거나 아예 없어도 파싱된다', () => {
    // 서버가 priority 를 추가하는 중이다. 없다고 목록 화면이 통째로 깨지면 안 된다.
    const { priority: _priority, ...withoutPriority } =
      listResponse.blogPopupList[0];

    expect(
      adminBlogPopupListSchema.parse({
        ...listResponse,
        blogPopupList: [{ ...listResponse.blogPopupList[0], priority: null }],
      }).blogPopupList[0].priority,
    ).toBeNull();
    expect(
      adminBlogPopupListSchema.parse({
        ...listResponse,
        blogPopupList: [withoutPriority],
      }).blogPopupList[0].priority,
    ).toBeUndefined();
  });

  it('targetType 이 정의되지 않은 값이면 실패한다', () => {
    expect(() =>
      adminBlogPopupListSchema.parse({
        ...listResponse,
        blogPopupList: [
          { ...listResponse.blogPopupList[0], targetType: 'CATEGORY' },
        ],
      }),
    ).toThrow();
  });
});

describe('adminBlogPopupSchema', () => {
  it('상세 응답을 파싱한다', () => {
    const parsed = adminBlogPopupSchema.parse(detailResponse);

    expect(parsed.blogPopupInfo.blogIds).toEqual([12, 34, 56]);
    expect(parsed.blogPopupInfo.triggerRatio).toBe(1.0);
  });

  it('전체 노출이면 blogIds 가 빈 배열이다', () => {
    const parsed = adminBlogPopupSchema.parse({
      blogPopupInfo: {
        ...detailResponse.blogPopupInfo,
        targetType: 'ALL',
        blogIds: [],
      },
    });

    expect(parsed.blogPopupInfo.blogIds).toEqual([]);
  });

  it('상세 응답에 우선순위가 없어도 파싱된다', () => {
    const { priority: _priority, ...withoutPriority } =
      detailResponse.blogPopupInfo;

    expect(
      adminBlogPopupSchema.parse(detailResponse).blogPopupInfo.priority,
    ).toBe(1);
    expect(
      adminBlogPopupSchema.parse({ blogPopupInfo: withoutPriority })
        .blogPopupInfo.priority,
    ).toBeUndefined();
  });

  it('blogIds 가 없으면 실패한다', () => {
    // 서버가 항상 내려주는 필드다. 빠졌다면 계약이 바뀐 것이므로 조용히 넘기지 않는다.
    const { blogIds: _blogIds, ...rest } = detailResponse.blogPopupInfo;

    expect(() => adminBlogPopupSchema.parse({ blogPopupInfo: rest })).toThrow();
  });
});
