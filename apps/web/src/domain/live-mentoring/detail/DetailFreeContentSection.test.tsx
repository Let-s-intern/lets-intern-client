import { render, screen } from '@testing-library/react';

// 실제 LexicalContent 는 swiper CSS 를 끌고 와 jest 가 파싱하지 못한다. 글자만 이어 그리는 목으로 바꾼다
jest.mock('@/common/lexical/LexicalContent', () => {
  type Node = { text?: string; children?: Node[] };
  const collect = (node: Node): string =>
    (node.text ?? '') + (node.children ?? []).map(collect).join('');
  return {
    __esModule: true,
    default: ({ node }: { node: Node }) => <div>{collect(node)}</div>,
  };
});

import DetailFreeContentSection from './DetailFreeContentSection';

const lexical = (text: string) =>
  JSON.stringify({
    root: {
      type: 'root',
      version: 1,
      direction: null,
      format: '',
      indent: 0,
      children: [
        {
          type: 'paragraph',
          version: 1,
          direction: null,
          format: '',
          indent: 0,
          children: [
            {
              type: 'text',
              version: 1,
              text,
              format: 0,
              style: '',
              mode: 'normal',
              detail: 0,
            },
          ],
        },
      ],
    },
  });

const EMPTY = JSON.stringify({
  root: {
    type: 'root',
    version: 1,
    children: [{ type: 'paragraph', version: 1, children: [] }],
  },
});

describe('DetailFreeContentSection', () => {
  it('위치가 맞으면 본문을 그린다', () => {
    render(
      <DetailFreeContentSection
        at="AFTER_STRATEGY"
        freeContent={{
          visible: true,
          content: lexical('운영 안내 문구'),
          position: 'AFTER_STRATEGY',
        }}
      />,
    );
    expect(screen.getByText('운영 안내 문구')).toBeInTheDocument();
  });

  it('위치가 다르면 그리지 않는다', () => {
    const { container } = render(
      <DetailFreeContentSection
        at="AFTER_VIDEO"
        freeContent={{
          visible: true,
          content: lexical('운영 안내 문구'),
          position: 'AFTER_STRATEGY',
        }}
      />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('위치가 없으면 멘토링 유형 뒤에 그린다', () => {
    render(
      <DetailFreeContentSection
        at="AFTER_MENTORING_TYPES"
        freeContent={{
          visible: true,
          content: lexical('기본 자리'),
          position: null,
        }}
      />,
    );
    expect(screen.getByText('기본 자리')).toBeInTheDocument();
  });

  it.each([
    ['꺼져 있으면', { visible: false, content: lexical('숨김') }],
    ['JSON 이 아니면', { visible: true, content: '{깨진' }],
    ['본문이 비었으면', { visible: true, content: EMPTY }],
    ['본문이 null 이면', { visible: true, content: null }],
  ])('%s 그리지 않는다', (_, partial) => {
    const { container } = render(
      <DetailFreeContentSection
        at="AFTER_PLAN"
        freeContent={{ ...partial, position: 'AFTER_PLAN' }}
      />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('자유 입력란이 없는 응답이면 그리지 않는다', () => {
    const { container } = render(
      <DetailFreeContentSection at="AFTER_PLAN" freeContent={undefined} />,
    );
    expect(container).toBeEmptyDOMElement();
  });
});
