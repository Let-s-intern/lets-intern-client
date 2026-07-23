import { describe, expect, it } from 'vitest';

import { missionTemplateAdmin } from '@/schema';

/**
 * 1.1 회귀 방지: 미션 템플릿 옵션 소스(`missionTemplatesOptions`)는
 * `missionTemplateAdmin.parse(...).missionTemplateAdminList` 로 그대로 만들어진다.
 * BE 가 size 20 페이지네이션을 도입한 뒤에도 (size=1000 로) 전량 응답을 받으면
 * 20개를 초과하는 템플릿(21번째 이상)도 옵션 목록에 포함돼야 미션명 파생이 깨지지 않는다.
 */
describe('missionTemplateAdmin 파싱 — 20개 초과 템플릿', () => {
  const makeTemplate = (id: number) => ({
    id,
    createDate: '2026-01-01T00:00:00',
    missionTag: `tag-${id}`,
    title: `템플릿 ${id}`,
    description: '',
    guide: '',
    templateLink: null,
    vodLink: null,
  });

  it('21번째 이상 템플릿도 옵션 목록에 포함된다', () => {
    const total = 25;
    const data = {
      missionTemplateAdminList: Array.from({ length: total }, (_, i) =>
        makeTemplate(i + 1),
      ),
      pageInfo: {
        pageNum: 0,
        pageSize: 1000,
        totalElements: total,
        totalPages: 1,
      },
    };

    const options = missionTemplateAdmin.parse(data).missionTemplateAdminList;

    expect(options).toHaveLength(total);
    // 최신 20개 밖(=21번째 이상)의 오래된 템플릿도 조회 가능해야 한다.
    const template21 = options.find((t) => t.id === 21);
    expect(template21?.title).toBe('템플릿 21');
    expect(template21?.missionTag).toBe('tag-21');
  });
});
