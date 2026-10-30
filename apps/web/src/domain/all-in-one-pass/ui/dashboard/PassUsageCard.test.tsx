import { render, screen } from '@testing-library/react';
import PassUsageCard from './PassUsageCard';

let mockPrivileges: { programType: string }[] = [];
jest.mock('../../api/dashboard', () => ({
  useGetMyPassPlan: () => ({
    data: { title: '올인원패스', privilegeList: mockPrivileges },
  }),
}));

let mockVodPassList: unknown;
jest.mock('@/api/vodPass', () => ({
  useVodPassListQuery: () => ({ data: mockVodPassList }),
}));

const passesWith = (status: string) => ({
  passes: [{ applicationId: 1, status, refundable: false }],
});

describe('PassUsageCard VOD 이용권 배지', () => {
  it('ACTIVE 이용권이 있으면 VOD 이용권 배지를 보여준다', () => {
    mockPrivileges = [{ programType: 'CHALLENGE' }];
    mockVodPassList = passesWith('ACTIVE');
    render(<PassUsageCard applicationId={1} />);
    expect(screen.getByText('VOD 이용권')).toBeInTheDocument();
    expect(screen.getByText('챌린지 이용권')).toBeInTheDocument();
  });

  it.each([
    ['만료된 이용권만 있으면', passesWith('EXPIRED')],
    ['이용권 조회 결과가 없으면', undefined],
  ])('%s 배지가 없다', (_, list) => {
    mockPrivileges = [{ programType: 'CHALLENGE' }];
    mockVodPassList = list;
    render(<PassUsageCard applicationId={1} />);
    expect(screen.queryByText('VOD 이용권')).toBeNull();
  });

  it('플랜 권한 배지와 겹치면 한 번만 보여준다', () => {
    mockPrivileges = [{ programType: 'VOD' }];
    mockVodPassList = passesWith('ACTIVE');
    render(<PassUsageCard applicationId={1} />);
    expect(screen.getAllByText('VOD 이용권')).toHaveLength(1);
  });

  it('이용권이 없어도 플랜 권한 기준 배지는 그대로 둔다', () => {
    mockPrivileges = [{ programType: 'VOD' }];
    mockVodPassList = { passes: [] };
    render(<PassUsageCard applicationId={1} />);
    expect(screen.getByText('VOD 이용권')).toBeInTheDocument();
  });
});
