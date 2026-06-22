import {
  CATEGORIES,
  MATRIX_CELL_MAP,
  MATRIX_CELLS,
  matrixCellKey,
  OWNER_LEGEND,
  Owner,
  STEPS,
  WEEKS,
} from './coursePlan';

const VALID_OWNERS: Owner[] = ['self', 'free', 'challenge'];

describe('coursePlan 데이터 무결성', () => {
  describe('매트릭스 차원', () => {
    it('단계는 5종(STEP01~05)이다', () => {
      expect(STEPS).toHaveLength(5);
    });

    it('카테고리는 6종이다', () => {
      expect(CATEGORIES).toHaveLength(6);
    });

    it('셀은 5×6 = 30개로 차원이 완전하다', () => {
      expect(MATRIX_CELLS).toHaveLength(30);
    });

    it('모든 (단계, 카테고리) 조합이 정확히 하나의 셀로 존재한다', () => {
      for (const step of STEPS) {
        for (const category of CATEGORIES) {
          const cell = MATRIX_CELL_MAP.get(matrixCellKey(step.id, category.id));
          expect(cell).toBeDefined();
          expect(cell?.step).toBe(step.id);
          expect(cell?.category).toBe(category.id);
        }
      }
    });

    it('과업이 있는 셀의 owner 는 유효한 enum 값이다', () => {
      for (const cell of MATRIX_CELLS) {
        if (cell.owner !== undefined) {
          expect(VALID_OWNERS).toContain(cell.owner);
        }
      }
    });
  });

  describe('13주 타임라인', () => {
    it('주차는 13개다', () => {
      expect(WEEKS).toHaveLength(13);
    });

    it('week 가 1~13 으로 연속한다', () => {
      const weeks = WEEKS.map((w) => w.week);
      expect(weeks).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]);
    });

    it('각 주차 owner 는 유효한 enum 값이다(있는 경우)', () => {
      for (const item of WEEKS) {
        if (item.owner !== undefined) {
          expect(VALID_OWNERS).toContain(item.owner);
        }
      }
    });

    it('모든 주차에 title 이 비어있지 않다(placeholder 포함)', () => {
      for (const item of WEEKS) {
        expect(item.title.length).toBeGreaterThan(0);
      }
    });
  });

  describe('범례', () => {
    it('범례는 3종 owner 를 모두 다룬다', () => {
      const legendOwners = OWNER_LEGEND.map((l) => l.owner);
      expect(legendOwners).toEqual(VALID_OWNERS);
    });
  });
});
