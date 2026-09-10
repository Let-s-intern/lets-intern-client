import {
  CATEGORIES,
  COURSE_PLAN_BODY,
  COURSE_PLAN_HEADER,
  COURSE_TAG_LABEL,
  type CourseTag,
  MATRIX_CELL_MAP,
  MATRIX_CELLS,
  matrixCellKey,
  MONTH_GROUPS,
  Owner,
  PLAYBOOK_CAPTION_LINES,
  PLAYBOOK_SHOT_ALT,
  PLAYBOOK_SHOT_SIZE,
  PLAYBOOK_SHOT_SRC,
  STEPS,
  WEEKS,
} from './coursePlan';

const VALID_OWNERS: Owner[] = ['self', 'free', 'challenge', 'challenge-deep'];
const VALID_TAGS: CourseTag[] = [
  'free',
  'template',
  'checklist',
  'vod',
  'challenge',
  'live',
  'mentoring',
];

describe('coursePlan 데이터 무결성', () => {
  describe('매트릭스 차원', () => {
    it('단계는 5종(STEP01~05)이다', () => {
      expect(STEPS).toHaveLength(5);
    });

    it('카테고리는 7종이다 (시안 8)', () => {
      expect(CATEGORIES).toHaveLength(7);
    });

    /*
     * 셀 개수를 못 박아 둔다. 표가 41칸이라 손으로 넣다 한 줄 빠뜨려도 화면에서는
     * 빈 칸이 원래 그런 것처럼 보인다 — 숫자로 잡는 게 유일한 방법이다.
     */
    it('셀은 41개다 (시안 8)', () => {
      expect(MATRIX_CELLS).toHaveLength(41);
    });

    // 시안 8 은 STEP05 의 면접·지원 실행과 라이브 세미나에 한 칸당 여러 항목을 넣는다.
    it('한 칸에 여러 항목이 들어가는 자리가 있다', () => {
      const key = matrixCellKey('step05', 'interview');
      expect(MATRIX_CELL_MAP.get(key)).toHaveLength(2);
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

    it('일정은 desc 가 아니라 when 에 들어간다', () => {
      // desc 에 "연사 · 10.8 목 20:00" 처럼 한 문자열로 두면, 좁은 셀에서
      // "10.8 목" / "20:00" 으로 갈려 다른 날 일정처럼 읽힌다. when 은 화면에서
      // nowrap 한 덩어리로 렌더된다(.cpm-cell-when).
      const schedule = /\d+\.\d+\s[월화수목금토일]\s\d+:\d+/;
      for (const cell of MATRIX_CELLS) {
        expect(cell.desc).not.toMatch(schedule);
      }
    });

    it('라이브 세미나 셀은 모두 일정(when)을 갖는다', () => {
      const live = MATRIX_CELLS.filter((cell) => cell.tag === 'live');
      expect(live.length).toBeGreaterThan(0);
      for (const cell of live) {
        expect(cell.when).toMatch(/^\d+\.\d+ [월화수목금토일] \d+:\d+$/);
      }
    });

    it('모든 셀이 배지(tag) 4종 중 하나를 갖고 라벨이 비어 있지 않다', () => {
      for (const cell of MATRIX_CELLS) {
        expect(VALID_TAGS).toContain(cell.tag);
        expect(COURSE_TAG_LABEL[cell.tag].length).toBeGreaterThan(0);
      }
    });

    it('배지 라벨은 시안 8 범례 7종이다', () => {
      expect(Object.keys(COURSE_TAG_LABEL)).toHaveLength(7);
      for (const label of Object.values(COURSE_TAG_LABEL)) {
        expect(label.length).toBeGreaterThan(0);
      }
    });
  });

  describe('헤더 카피', () => {
    it('섹션 헤더는 배지·제목·설명을 갖는다', () => {
      expect(COURSE_PLAN_HEADER.badge.length).toBeGreaterThan(0);
      expect(COURSE_PLAN_HEADER.titleLines.length).toBeGreaterThan(0);
      expect(COURSE_PLAN_HEADER.subLines.length).toBeGreaterThan(0);
    });

    it('섹션 헤더의 강조 어절이 제목 안에 실제로 존재한다', () => {
      const title = COURSE_PLAN_HEADER.titleLines.join(' ');
      for (const word of COURSE_PLAN_HEADER.titleHighlights) {
        expect(title).toContain(word);
      }
    });

    it('본문 도입부와 매트릭스 캡션 문구가 비어 있지 않다', () => {
      expect(COURSE_PLAN_BODY.titleLines.length).toBeGreaterThan(0);
      expect(COURSE_PLAN_BODY.sub.length).toBeGreaterThan(0);
      expect(COURSE_PLAN_BODY.matrixTitle.length).toBeGreaterThan(0);
      expect(COURSE_PLAN_BODY.matrixSub.length).toBeGreaterThan(0);
      expect(COURSE_PLAN_BODY.matrixFootnote.length).toBeGreaterThan(0);
    });
  });

  describe('13주 타임라인', () => {
    it('월 그룹은 3종(SEP/OCT/NOV)이며 액센트색을 갖는다', () => {
      expect(MONTH_GROUPS).toHaveLength(3);
      expect(MONTH_GROUPS.map((m) => m.month)).toEqual(['SEP', 'OCT', 'NOV']);
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

  describe('플레이북 화면 컷', () => {
    it('반입 이미지는 WebP 다', () => {
      // PRD 7-3: PNG·JPG 반입 금지.
      expect(PLAYBOOK_SHOT_SRC.endsWith('.webp')).toBe(true);
    });

    it('표시 폭 300px 의 @2x 크기다', () => {
      // 시안에서 매트릭스(1080px) 대비 27.65% 로 잰 값이다.
      // 이 비율이 깨지면 시안과 화면이 어긋난다.
      expect(PLAYBOOK_SHOT_SIZE.width).toBe(600);
      expect(PLAYBOOK_SHOT_SIZE.height).toBe(1070);
    });

    it('alt 는 이름표가 아니라 화면 내용을 옮긴 문장이다', () => {
      expect(PLAYBOOK_SHOT_ALT.length).toBeGreaterThan(30);
    });

    it('마무리 문구가 의도된 줄바꿈 단위로 나뉘어 있다', () => {
      expect(PLAYBOOK_CAPTION_LINES).toHaveLength(2);
      for (const line of PLAYBOOK_CAPTION_LINES) {
        expect(line.length).toBeGreaterThan(0);
      }
    });
  });
});
