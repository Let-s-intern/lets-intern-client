import { userAdminDetailType } from '@/schema';
import { adminUserDetailSchema } from '@/api/user/userSchema';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import UserDetail from '../UserDetail';

vi.mock('@/utils/axios', () => ({ default: {} }));
vi.mock('@/utils/axiosV2', () => ({ default: {} }));

const legacyDetail = vi.hoisted(() => ({
  userInfo: {
    id: '7',
    name: '김유저',
    email: 'user@test.com',
    contactEmail: null,
    phoneNum: '010-0000-0000',
    university: null,
    inflowPath: null,
    grade: null,
    major: null,
    wishJob: null,
    wishCompany: null,
    wishIndustry: null,
    wishEmploymentType: null,
    accountType: null,
    accountNum: null,
    marketingAgree: null,
    authProvider: null,
  },
  // 서버 배포 전 응답: applicationDetailInfo, liveMentoringSubmissionList 가 없다
  applicationInfo: [{ programId: 1, programTitle: '옛 챌린지' }],
  userDocumentInfo: null,
  careerInfos: null,
  experienceInfos: null,
}));

vi.mock('@/api/user/user', () => ({
  useUserDetailAdminQuery: () => ({ data: legacyDetail, isLoading: false }),
}));
vi.mock('../PersonalInfo', () => ({
  default: () => <div>개인 정보 패널</div>,
}));
vi.mock('../PersonalHistory', () => ({ default: () => null }));
vi.mock('../PersonalExperience', () => ({ default: () => null }));

describe('유저 상세 스키마', () => {
  it('새 필드가 없는 응답도 파싱된다', () => {
    const parsed = userAdminDetailType.parse(legacyDetail);
    expect(parsed.applicationDetailInfo).toBeUndefined();
    expect(parsed.liveMentoringSubmissionList).toBeUndefined();
  });

  it('새 필드가 있는 응답을 파싱한다', () => {
    const parsed = userAdminDetailType.parse({
      ...legacyDetail,
      applicationDetailInfo: [
        {
          applicationId: 10,
          programType: 'CHALLENGE',
          programTitle: '챌린지',
          isCanceled: false,
          finalPrice: 0,
          couponDiscount: -1,
        },
        { membershipApplicationId: 3, programType: 'MEMBERSHIP', programId: 2 },
      ],
      liveMentoringSubmissionList: [
        { applicationId: 11, questionDeferred: true },
      ],
    });
    expect(parsed.applicationDetailInfo).toHaveLength(2);
    expect(parsed.liveMentoringSubmissionList?.[0].applicationId).toBe(11);
  });

  it('v2 어드민 유저 상세 스키마도 새 필드를 optional 로 받는다', () => {
    const shape = adminUserDetailSchema.shape;
    expect(shape.applicationDetailInfo.isOptional()).toBe(true);
    expect(shape.liveMentoringSubmissionList.isOptional()).toBe(true);
  });
});

describe('UserDetail', () => {
  const renderPage = () =>
    render(
      <MemoryRouter initialEntries={['/users/7']}>
        <Routes>
          <Route path="/users/:userId" element={<UserDetail />} />
        </Routes>
      </MemoryRouter>,
    );

  it('새 필드가 없는 응답으로도 기본 정보 탭이 렌더된다', () => {
    renderPage();
    expect(screen.getByText('개인 정보 패널')).toBeInTheDocument();
    expect(screen.getAllByRole('tab').map((tab) => tab.textContent)).toEqual([
      '기본 정보',
      '구매·참여 이력',
      '멘토링 제출',
      '문의',
      '쿠폰',
    ]);
  });

  it('다른 탭으로 바꾸면 기본 정보가 사라진다', () => {
    renderPage();
    fireEvent.click(screen.getByRole('tab', { name: '문의' }));
    expect(screen.queryByText('개인 정보 패널')).not.toBeInTheDocument();
  });
});
