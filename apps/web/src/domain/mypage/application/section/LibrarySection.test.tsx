import { LIBRARY_VISIBLE_MAGNET_TYPES } from '@/api/magnet/magnetSchema';
import { render } from '@testing-library/react';

const useGetMypageMagnetListQueryMock = jest.fn();

jest.mock('@/api/magnet/magnet', () => ({
  useGetMypageMagnetListQuery: (...args: unknown[]) =>
    useGetMypageMagnetListQueryMock(...args),
}));

// 무거운 카드/버튼 컴포넌트는 본 테스트 관심사 밖이므로 stub 처리.
jest.mock('../../ui/card/NewApplicationCard', () => ({
  MypageApplicationCard: () => null,
}));
jest.mock('../../ui/button/MoreButton', () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock('./EmptySection', () => ({
  __esModule: true,
  default: () => null,
}));

// LibrarySection 은 위 mock 이후 import 해야 한다.
// eslint-disable-next-line import/first, @typescript-eslint/no-require-imports
const LibrarySection = require('./LibrarySection').default;

describe('LibrarySection', () => {
  beforeEach(() => {
    useGetMypageMagnetListQueryMock.mockReset();
    useGetMypageMagnetListQueryMock.mockReturnValue({
      data: { magnetList: [] },
      isLoading: false,
    });
  });

  it('LIBRARY_VISIBLE_MAGNET_TYPES(typeList)로 마그넷 리스트를 조회한다', () => {
    render(<LibrarySection />);

    expect(useGetMypageMagnetListQueryMock).toHaveBeenCalledTimes(1);
    const callArg = useGetMypageMagnetListQueryMock.mock.calls[0][0];
    expect(callArg.typeList).toEqual([...LIBRARY_VISIBLE_MAGNET_TYPES]);
    // EVENT/LAUNCH_ALERT 가 포함되지 않아야 한다
    expect(callArg.typeList).not.toContain('EVENT');
    expect(callArg.typeList).not.toContain('LAUNCH_ALERT');
  });
});
