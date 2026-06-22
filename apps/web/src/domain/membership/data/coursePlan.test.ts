import {
  CATEGORIES,
  MATRIX_CELL_MAP,
  MATRIX_CELLS,
  matrixCellKey,
  MONTH_GROUPS,
  OWNER_LEGEND,
  Owner,
  STEPS,
  WEEKS,
} from './coursePlan';

const VALID_OWNERS: Owner[] = ['self', 'free', 'challenge', 'challenge-deep'];

describe('coursePlan 데이터 무결성', () => {
  describe('매트릭스 차원', () => {
    it('단계는 5종(STEP01~05)이다', () => {
      expect(STEPS).toHaveLength(5);
    });

    it('카테고리는 6종이다', () => {
      expect(CATEGORIES).toHaveLength(6);
    });

    it('셀은 31개다(6×5 + 서류 STEP03 추가 1셀)', () => {
      expect(MATRIX_CELLS).toHaveLength(31);
    });

    it('서류 작성 STEP03 은 2셀(이력서 + 대기업 자소서)이다', () => {
      const cells = MATRIX_CELL_MAP.get(matrixCellKey('step03', 'document'));
      expect(cells).toHaveLength(2);
      expect(cells?.map((c) => c.owner)).toEqual([
        'challenge',
        'challenge-deep',
      ]);
    });

    it('모든 (단계, 카테고리) 조합이 최소 하나의 셀로 존재한다', () => {
      for (const step of STEPS) {
        for (const category of CATEGORIES) {
          const cells = MATRIX_CELL_MAP.get(
            matrixCellKey(step.id, category.id),
          );
          expect(cells).toBeDefined();
          expect(cells?.length).toBeGreaterThanOrEqual(1);
        }
      }
    });

    it('모든 셀의 owner·title·desc 가 유효하다', () => {
      for (const cell of MATRIX_CELLS) {
        expect(VALID_OWNERS).toContain(cell.owner);
        expect(cell.title.length).toBeGreaterThan(0);
        expect(cell.desc.length).toBeGreaterThan(0);
      }
    });
  });

  describe('13주 타임라인', () => {
    it('월 그룹은 3종(JUL/AUG/SEP)이며 액센트색을 갖는다', () => {
      expect(MONTH_GROUPS).toHaveLength(3);
      expect(MONTH_GROUPS.map((m) => m.month)).toEqual(['JUL', 'AUG', 'SEP']);
      for (const m of MONTH_GROUPS) {
        expect(m.accent).toMatch(/^#[0-9a-f]{6}$/i);
      }
    });

    it('카드는 12개이며 12주차가 13주까지 묶음으로 13주를 커버한다', () => {
      expect(WEEKS).toHaveLength(12);
      const last = WEEKS[WEEKS.length - 1];
      expect(last.week).toBe(12);
      expect(last.weekEnd).toBe(13);
    });

    it('주차가 1부터 빠짐없이 13까지 이어진다', () => {
      const covered = new Set<number>();
      for (const item of WEEKS) {
        const end = item.weekEnd ?? item.week;
        for (let w = item.week; w <= end; w += 1) {
          covered.add(w);
        }
      }
      expect([...covered].sort((a, b) => a - b)).toEqual([
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
      ]);
    });

    it('모든 주차에 title 이 비어있지 않다', () => {
      for (const item of WEEKS) {
        expect(item.title.length).toBeGreaterThan(0);
      }
    });
  });

  describe('범례', () => {
    it('범례는 4종 owner 를 모두 다룬다', () => {
      const legendOwners = OWNER_LEGEND.map((l) => l.owner).sort();
      expect(legendOwners).toEqual([...VALID_OWNERS].sort());
    });
  });
});
