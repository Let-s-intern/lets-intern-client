import { LIBRARY_VISIBLE_MAGNET_TYPES } from '@/api/magnet/magnetSchema';
import { fireEvent, render } from '@testing-library/react';

const useGetUserMagnetListQueryMock = jest.fn();
const useGetMyMagnetListQueryMock = jest.fn();

jest.mock('@/api/magnet/magnet', () => ({
  useGetUserMagnetListQuery: (...args: unknown[]) =>
    useGetUserMagnetListQueryMock(...args),
  useGetMyMagnetListQuery: (...args: unknown[]) =>
    useGetMyMagnetListQueryMock(...args),
}));

// CheckBox 는 외부 svg 의존성이 있어 stub 처리.
jest.mock('@/common/box/CheckBox', () => ({
  __esModule: true,
  default: ({ checked }: { checked: boolean }) => (
    <span data-testid="checkbox" data-checked={checked} />
  ),
}));

const EventExtraMagnetSection = require('./EventExtraMagnetSection').default;

const buildMagnet = (
  magnetId: number,
  title: string,
  type: 'MATERIAL' | 'VOD' | 'FREE_TEMPLATE' = 'MATERIAL',
) => ({
  magnetId,
  type,
  title,
  desktopThumbnail: null,
  mobileThumbnail: null,
  appliedLaunchAlert: null,
  startDate: null,
  endDate: null,
});

describe('EventExtraMagnetSection', () => {
  beforeEach(() => {
    useGetUserMagnetListQueryMock.mockReset();
    useGetMyMagnetListQueryMock.mockReset();
  });

  it('LIBRARY_VISIBLE_MAGNET_TYPES(typeList)로 후보/이력 마그넷을 조회한다', () => {
    useGetUserMagnetListQueryMock.mockReturnValue({
      data: { magnetList: [], pageInfo: {} },
      isLoading: false,
    });
    useGetMyMagnetListQueryMock.mockReturnValue({
      data: { magnetList: [], pageInfo: {} },
      isLoading: false,
    });

    render(
      <EventExtraMagnetSection
        selectedMagnetIds={[]}
        onSelectedMagnetIdsChange={() => {}}
      />,
    );

    expect(useGetUserMagnetListQueryMock).toHaveBeenCalledTimes(1);
    expect(useGetMyMagnetListQueryMock).toHaveBeenCalledTimes(1);

    const candidateArg = useGetUserMagnetListQueryMock.mock.calls[0][0];
    const appliedArg = useGetMyMagnetListQueryMock.mock.calls[0][0];

    expect(candidateArg.typeList).toEqual([...LIBRARY_VISIBLE_MAGNET_TYPES]);
    expect(appliedArg.typeList).toEqual([...LIBRARY_VISIBLE_MAGNET_TYPES]);
  });

  it('이미 신청한 magnetId는 후보군에서 제외한다', () => {
    useGetUserMagnetListQueryMock.mockReturnValue({
      data: {
        magnetList: [
          buildMagnet(1, '자료집 A'),
          buildMagnet(2, '자료집 B'),
          buildMagnet(3, '자료집 C'),
        ],
        pageInfo: {},
      },
      isLoading: false,
    });
    useGetMyMagnetListQueryMock.mockReturnValue({
      data: {
        magnetList: [buildMagnet(2, '자료집 B')],
        pageInfo: {},
      },
      isLoading: false,
    });

    const { queryByText } = render(
      <EventExtraMagnetSection
        selectedMagnetIds={[]}
        onSelectedMagnetIdsChange={() => {}}
      />,
    );

    expect(queryByText('자료집 A')).not.toBeNull();
    expect(queryByText('자료집 B')).toBeNull();
    expect(queryByText('자료집 C')).not.toBeNull();
  });

  it('차집합이 빈 배열이면 null 을 반환한다', () => {
    useGetUserMagnetListQueryMock.mockReturnValue({
      data: {
        magnetList: [buildMagnet(1, '자료집 A')],
        pageInfo: {},
      },
      isLoading: false,
    });
    useGetMyMagnetListQueryMock.mockReturnValue({
      data: {
        magnetList: [buildMagnet(1, '자료집 A')],
        pageInfo: {},
      },
      isLoading: false,
    });

    const { container } = render(
      <EventExtraMagnetSection
        selectedMagnetIds={[]}
        onSelectedMagnetIdsChange={() => {}}
      />,
    );

    expect(container.firstChild).toBeNull();
  });

  it('체크박스 클릭 시 onSelectedMagnetIdsChange 가 호출된다', () => {
    useGetUserMagnetListQueryMock.mockReturnValue({
      data: {
        magnetList: [buildMagnet(1, '자료집 A'), buildMagnet(2, '자료집 B')],
        pageInfo: {},
      },
      isLoading: false,
    });
    useGetMyMagnetListQueryMock.mockReturnValue({
      data: { magnetList: [], pageInfo: {} },
      isLoading: false,
    });

    const onChange = jest.fn();
    const { getByText } = render(
      <EventExtraMagnetSection
        selectedMagnetIds={[]}
        onSelectedMagnetIdsChange={onChange}
      />,
    );

    fireEvent.click(getByText('자료집 A'));
    expect(onChange).toHaveBeenCalledWith([1]);
  });

  it('이미 선택된 magnetId 를 다시 클릭하면 선택 해제된다', () => {
    useGetUserMagnetListQueryMock.mockReturnValue({
      data: {
        magnetList: [buildMagnet(1, '자료집 A'), buildMagnet(2, '자료집 B')],
        pageInfo: {},
      },
      isLoading: false,
    });
    useGetMyMagnetListQueryMock.mockReturnValue({
      data: { magnetList: [], pageInfo: {} },
      isLoading: false,
    });

    const onChange = jest.fn();
    const { getByText } = render(
      <EventExtraMagnetSection
        selectedMagnetIds={[1, 2]}
        onSelectedMagnetIdsChange={onChange}
      />,
    );

    fireEvent.click(getByText('자료집 A'));
    expect(onChange).toHaveBeenCalledWith([2]);
  });

  it('로딩 중이면 null 을 렌더한다', () => {
    useGetUserMagnetListQueryMock.mockReturnValue({
      data: undefined,
      isLoading: true,
    });
    useGetMyMagnetListQueryMock.mockReturnValue({
      data: undefined,
      isLoading: true,
    });

    const { container } = render(
      <EventExtraMagnetSection
        selectedMagnetIds={[]}
        onSelectedMagnetIdsChange={() => {}}
      />,
    );

    expect(container.firstChild).toBeNull();
  });
});
