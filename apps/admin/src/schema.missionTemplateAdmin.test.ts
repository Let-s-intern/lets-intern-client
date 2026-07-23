import { describe, expect, it } from 'vitest';

import { missionTemplateAdmin } from './schema';

// 회귀 방지: /mission-template/admin?size=1000 로 전체 템플릿을 로드하면
// 과거 레거시 템플릿(missionTag/title/description/guide 가 null)까지 파싱된다.
// 이 필드들을 필수 z.string() 으로 두면 항목 하나가 배열 전체 parse 를 throw 시켜
// 미션등록 미션명 드롭다운이 통째로 비어버린다(고쳤더니 더 안 되는 회귀).
// 스키마가 null 을 '' 로 방어해 한 건의 레거시가 전체를 죽이지 않아야 한다.
describe('missionTemplateAdmin 스키마 - 레거시 null 필드 내성', () => {
  const pageInfo = {
    totalElements: 2,
    totalPages: 1,
    pageNum: 0,
    pageSize: 1000,
    first: true,
    last: true,
  };

  it('description/guide 가 null 인 레거시 템플릿이 섞여도 throw 하지 않고 전량 파싱한다', () => {
    const data = {
      missionTemplateAdminList: [
        {
          id: 1,
          createDate: '2026-01-01',
          missionTag: '태그',
          title: '최신 템플릿',
          description: '설명',
          guide: '가이드',
          templateLink: null,
          vodLink: null,
        },
        {
          id: 2,
          createDate: '2024-01-01',
          missionTag: null,
          title: null,
          description: null,
          guide: null,
          templateLink: null,
          vodLink: null,
        },
      ],
      pageInfo,
    };

    const result = missionTemplateAdmin.parse(data);

    // 두 템플릿 모두 살아남아 드롭다운 옵션이 유지된다.
    expect(result.missionTemplateAdminList).toHaveLength(2);
    // 레거시 null 은 '' 로 방어된다.
    expect(result.missionTemplateAdminList[1].title).toBe('');
    expect(result.missionTemplateAdminList[1].missionTag).toBe('');
    // 정상 템플릿은 값 유지.
    expect(result.missionTemplateAdminList[0].title).toBe('최신 템플릿');
  });
});
