import {
  $createParagraphNode,
  $isElementNode,
  type LexicalNode,
  type SerializedLexicalNode,
} from 'lexical';
import { $isTableRowNode, type TableNode } from '@lexical/table';

/**
 * 표에 행이 아닌 자식이 섞이면 에디터가 죽는다. 그걸 되돌린다.
 *
 * `@lexical/react` 의 `<TablePlugin>` 은 `TableNode` 에 노드 트랜스폼을 건다. 행마다 셀
 * 개수가 다를 때 짧은 행을 채워 주는 것이 목적인데, 그 계산을 시작하기 전에
 * `$computeTableMapSkipCellCheck` 로 격자 지도를 만들면서 **자식이 전부 행인지 단언**한다.
 * 하나라도 아니면 `Expected GridNode children to be TableRowNode`(배포 빌드에서는
 * `Minified Lexical error #146`)를 던진다.
 *
 * 트랜스폼이라 표가 dirty 해지는 **모든 업데이트마다** 실행된다. 그래서 증상이 "한 번 에러"
 * 가 아니라 "그 글은 더 이상 편집할 수 없음" 이 된다. 저장된 콘텐츠 안에 그 표가 있으니
 * 새로고침해도 살아난다.
 *
 * 고치는 방식은 **표 밖으로 옮기기**다. 지우지 않는 이유는, 표 안에 문단이 끼어드는 것은
 * 대개 편집 사고이고 그 문단에 사람이 쓴 글이 들어 있을 수 있어서다. 표 안에 둘 수는 없으니
 * 표 바로 다음 형제로 뺀다.
 *
 * 같은 규칙을 두 벌로 구현한다. 편집 중에는 노드로(`$repairTableNode`), 저장된 JSON 을
 * 불러올 때는 직렬화 상태로(`repairSerializedTables`) 고쳐야 하는데, 후자는 아직 에디터
 * 노드가 만들어지기 전이라 노드 API 를 쓸 수 없다.
 */

const TABLE_TYPE = 'table';
const TABLE_ROW_TYPE = 'tablerow';

/** 루트나 표 바깥에 그대로 놓을 수 없는 것(텍스트·줄바꿈)은 문단으로 감싼다. */
const $asBlock = (node: LexicalNode): LexicalNode => {
  if ($isElementNode(node)) return node;
  const paragraph = $createParagraphNode();
  paragraph.append(node);
  return paragraph;
};

/**
 * 표에서 행이 아닌 자식을 표 바로 뒤로 옮긴다.
 *
 * @returns 고칠 것이 있었으면 true. 호출부가 기록을 남길 수 있게 알린다.
 */
export const $repairTableNode = (table: TableNode): boolean => {
  const strays = table.getChildren().filter((child) => !$isTableRowNode(child));
  if (strays.length === 0) return false;

  /*
   * 뒤에서부터 표 바로 뒤에 꽂는다. 앞에서부터 하면 나중 것이 앞 것보다 먼저 놓여
   * 원래 순서가 뒤집힌다. `insertAfter` 는 이동이므로 표에서는 자동으로 빠진다.
   */
  for (let i = strays.length - 1; i >= 0; i--) {
    table.insertAfter($asBlock(strays[i]));
  }

  // 행이 하나도 없는 표는 화면에서 의미가 없고, 이후 표 연산에서 또 문제를 만든다.
  if (table.getChildrenSize() === 0) {
    table.remove();
  }

  return true;
};

/**
 * 표 무결성 때문에 난 에러인지 본다.
 *
 * 개발 빌드는 원문(`Expected GridNode children to be TableRowNode`)을 주지만, 배포
 * 빌드는 코드만 남긴 `Minified Lexical error #146` 을 준다. 실제로 겪는 것은 후자라
 * **둘 다** 잡아야 한다. 코드 뒤에 숫자가 더 붙는 경우(#1460 등)를 걸러내려고 경계를 둔다.
 */
export const isTableIntegrityError = (error: unknown): boolean => {
  const message = error instanceof Error ? error.message : String(error);
  return (
    message.includes('Expected GridNode children to be TableRowNode') ||
    /Minified Lexical error #146(?!\d)/.test(message)
  );
};

interface SerializedParent extends SerializedLexicalNode {
  children?: SerializedLexicalNode[];
}

const hasChildren = (node: SerializedLexicalNode): node is SerializedParent =>
  Array.isArray((node as SerializedParent).children);

const asSerializedBlock = (
  node: SerializedLexicalNode,
): SerializedLexicalNode => {
  if (node.type !== 'text' && node.type !== 'linebreak') return node;
  return {
    type: 'paragraph',
    version: 1,
    children: [node],
    direction: null,
    format: '',
    indent: 0,
  } as SerializedLexicalNode;
};

/**
 * 직렬화된 트리를 훑어 표를 고친다. `$repairTableNode` 와 같은 규칙이다.
 *
 * 편집 중 트랜스폼만으로는 늦다. 문제가 되는 표는 **이미 저장된 글** 안에 있어서, 여는
 * 즉시 안전해야 한다.
 *
 * 인자를 제자리에서 고친다. 호출부가 `JSON.parse` 결과를 바로 넘기는 자리라 사본을 뜨는
 * 비용이 아깝다.
 *
 * @returns 고칠 것이 있었으면 true.
 */
export const repairSerializedTables = (
  node: SerializedLexicalNode,
): boolean => {
  if (!hasChildren(node)) return false;

  let repaired = false;
  const next: SerializedLexicalNode[] = [];

  for (const child of node.children) {
    if (repairSerializedTables(child)) repaired = true;

    if (child?.type !== TABLE_TYPE || !hasChildren(child)) {
      next.push(child);
      continue;
    }

    const rows = child.children.filter((c) => c?.type === TABLE_ROW_TYPE);
    if (rows.length === child.children.length) {
      next.push(child);
      continue;
    }

    const strays = child.children
      .filter((c) => c?.type !== TABLE_ROW_TYPE)
      .map(asSerializedBlock);

    repaired = true;
    child.children = rows;

    if (rows.length > 0) next.push(child);
    next.push(...strays);
  }

  node.children = next;
  return repaired;
};
