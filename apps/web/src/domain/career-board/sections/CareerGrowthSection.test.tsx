import { LIBRARY_VISIBLE_MAGNET_TYPES } from '@/api/magnet/magnetSchema';

const mypageMagnetListQueryOptionsMock = jest.fn();

jest.mock('@/api/magnet/magnet', () => ({
  mypageMagnetListQueryOptions: (...args: unknown[]) =>
    mypageMagnetListQueryOptionsMock(...args),
}));

describe('CareerGrowthSection - LibraryGrowthList typeList', () => {
  beforeEach(() => {
    mypageMagnetListQueryOptionsMock.mockReset();
    mypageMagnetListQueryOptionsMock.mockImplementation((typeList) => ({
      queryKey: ['MypageMagnetListQueryKey', typeList] as const,
      queryFn: async () => ({ magnetList: [] }),
    }));
  });

  it('LIBRARY_VISIBLE_MAGNET_TYPES 가 EVENT/LAUNCH_ALERT 를 포함하지 않는다', () => {
    expect(LIBRARY_VISIBLE_MAGNET_TYPES).toEqual([
      'MATERIAL',
      'VOD',
      'FREE_TEMPLATE',
    ]);
    expect(LIBRARY_VISIBLE_MAGNET_TYPES).not.toContain('EVENT');
    expect(LIBRARY_VISIBLE_MAGNET_TYPES).not.toContain('LAUNCH_ALERT');
  });

  it('mypageMagnetListQueryOptions 가 LIBRARY_VISIBLE_MAGNET_TYPES 와 함께 호출되도록 소스에서 명시되어야 한다', () => {
    // CareerGrowthSection 의 LibraryGrowthList 가 import 되었을 때
    // mypageMagnetListQueryOptions 호출 인자가 typeList 를 갖고 있어야 함을 보증.
    // 실제 컴포넌트 렌더는 useSuspenseQuery + RSC 컨텍스트 의존성이 커서
    // 본 테스트는 소스 정적 분석 수준에서 호출 인자를 검증한다.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const fs = require('fs');
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const path = require('path');
    const source = fs.readFileSync(
      path.join(__dirname, 'CareerGrowthSection.tsx'),
      'utf8',
    );

    // import 확인
    expect(source).toMatch(
      /from\s+['"]@\/api\/magnet\/magnetSchema['"]/,
    );
    expect(source).toContain('LIBRARY_VISIBLE_MAGNET_TYPES');
    // mypageMagnetListQueryOptions 호출 시 typeList 인자 전달 확인
    expect(source).toMatch(
      /mypageMagnetListQueryOptions\(\s*\[\s*\.\.\.LIBRARY_VISIBLE_MAGNET_TYPES\s*\]\s*\)/,
    );
  });
});
