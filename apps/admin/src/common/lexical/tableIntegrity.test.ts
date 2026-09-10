import { describe, expect, it } from 'vitest';

import {
  isTableIntegrityError,
  repairSerializedTables,
} from './tableIntegrity';

/*
 * LC-3292 회귀 테스트.
 *
 * 표에 행이 아닌 자식이 있으면 `<TablePlugin>` 의 TableNode 트랜스폼이 예외를 던지고,
 * 트랜스폼이라 표를 건드릴 때마다 다시 던져 그 글이 통째로 편집 불가가 된다.
 *
 * 노드 쪽 복구(`$repairTableNode`)는 Lexical 에디터 인스턴스가 필요해 jsdom 에서 돌리기
 * 어렵다. 화면에서 확인했고, 여기서는 **불러오기 경로**(저장된 JSON)와 에러 판별만 잡는다.
 * 실제로 사람을 막는 것이 "이미 저장된 글이 안 열리는 것" 이라 이쪽이 더 중요하다.
 */

const text = (value: string) => ({
  type: 'text',
  version: 1,
  text: value,
  detail: 0,
  format: 0,
  mode: 'normal',
  style: '',
});

const paragraph = (value: string) => ({
  type: 'paragraph',
  version: 1,
  indent: 0,
  format: '',
  direction: null,
  children: [text(value)],
});

const cell = (value: string) => ({
  type: 'tablecell',
  version: 1,
  indent: 0,
  format: '',
  direction: null,
  headerState: 0,
  colSpan: 1,
  rowSpan: 1,
  children: [paragraph(value)],
});

const row = (...cells: unknown[]) => ({
  type: 'tablerow',
  version: 1,
  indent: 0,
  format: '',
  direction: null,
  height: null,
  children: cells,
});

const table = (...children: unknown[]) => ({
  type: 'table',
  version: 1,
  indent: 0,
  format: '',
  direction: null,
  children,
});

const root = (...children: unknown[]) =>
  ({
    type: 'root',
    version: 1,
    indent: 0,
    format: '',
    direction: null,
    children,
  }) as never;

/** 타입만 벗겨 구조를 눈으로 비교하기 쉽게 만든다. */
const shape = (node: { type: string; children?: unknown[] }): unknown => ({
  t: node.type,
  c: (node.children ?? []).map((child) =>
    shape(child as { type: string; children?: unknown[] }),
  ),
});

describe('repairSerializedTables', () => {
  it('정상 표는 건드리지 않는다', () => {
    const tree = root(table(row(cell('a'), cell('b')), row(cell('c'))));

    expect(repairSerializedTables(tree)).toBe(false);
    expect(shape(tree)).toEqual(
      shape(root(table(row(cell('a'), cell('b')), row(cell('c'))))),
    );
  });

  it('표에 끼어든 문단을 표 바로 뒤로 옮긴다', () => {
    const tree = root(table(row(cell('a')), paragraph('끼어든 문단')));

    expect(repairSerializedTables(tree)).toBe(true);
    expect(shape(tree)).toEqual(
      shape(root(table(row(cell('a'))), paragraph('끼어든 문단'))),
    );
  });

  it('옮긴 내용을 지우지 않는다', () => {
    const tree = root(table(row(cell('a')), paragraph('살아남아야 한다')));
    repairSerializedTables(tree);

    expect(JSON.stringify(tree)).toContain('살아남아야 한다');
  });

  it('여러 개가 끼어들어도 원래 순서를 지킨다', () => {
    const tree = root(
      table(row(cell('a')), paragraph('첫째'), paragraph('둘째')),
    );

    repairSerializedTables(tree);
    expect(shape(tree)).toEqual(
      shape(root(table(row(cell('a'))), paragraph('첫째'), paragraph('둘째'))),
    );
  });

  // 셀이 없는 표는 화면에서 의미가 없고, 이후 다른 표 연산에서 또 문제를 만든다.
  it('행이 하나도 남지 않으면 표 자체를 버린다', () => {
    const tree = root(table(paragraph('내용만 있었다')));

    expect(repairSerializedTables(tree)).toBe(true);
    expect(shape(tree)).toEqual(shape(root(paragraph('내용만 있었다'))));
  });

  // 루트에 텍스트를 그대로 두면 Lexical 이 또 다른 이유로 죽는다.
  it('텍스트가 끼어들면 문단으로 감싸서 꺼낸다', () => {
    const tree = root(table(row(cell('a')), text('맨몸 텍스트')));

    repairSerializedTables(tree);
    expect(shape(tree)).toEqual(
      shape(root(table(row(cell('a'))), paragraph('맨몸 텍스트'))),
    );
  });

  // 셀 안에 표를 또 넣을 수 있다. 바깥만 보면 안쪽이 그대로 남아 계속 죽는다.
  it('중첩된 표도 찾아 고친다', () => {
    const cellWith = (...children: unknown[]) => ({
      ...cell('자리표시'),
      children,
    });
    const tree = root(
      table(row(cellWith(table(row(cell('안쪽')), paragraph('안쪽 침입자'))))),
    );

    expect(repairSerializedTables(tree)).toBe(true);
    // 침입자는 안쪽 표 밖으로 나와 같은 셀의 형제가 된다.
    expect(shape(tree)).toEqual(
      shape(
        root(
          table(
            row(cellWith(table(row(cell('안쪽'))), paragraph('안쪽 침입자'))),
          ),
        ),
      ),
    );
  });

  it('children 이 없는 노드에서도 터지지 않는다', () => {
    const tree = root({ type: 'horizontalrule', version: 1 });
    expect(repairSerializedTables(tree)).toBe(false);
  });
});

describe('isTableIntegrityError', () => {
  // 실제로 겪는 것은 배포 빌드의 코드 형태다.
  it('배포 빌드의 최소화된 메시지를 잡는다', () => {
    expect(
      isTableIntegrityError(
        new Error(
          'Minified Lexical error #146; visit https://lexical.dev/docs/error?code=146',
        ),
      ),
    ).toBe(true);
  });

  it('개발 빌드의 원문을 잡는다', () => {
    expect(
      isTableIntegrityError(
        new Error('Expected GridNode children to be TableRowNode'),
      ),
    ).toBe(true);
  });

  // 전부 삼키면 다른 버그가 숨는다.
  it('다른 Lexical 에러는 잡지 않는다', () => {
    expect(
      isTableIntegrityError(new Error('Minified Lexical error #110')),
    ).toBe(false);
    expect(isTableIntegrityError(new Error('무언가 다른 오류'))).toBe(false);
  });

  it('코드가 146 으로 시작하는 다른 번호를 잡지 않는다', () => {
    expect(
      isTableIntegrityError(new Error('Minified Lexical error #1460')),
    ).toBe(false);
  });
});
