import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { MagnetApplicationByMagnet } from '@/api/leadManagement';

// react-query 훅을 mock하여 네트워크 없이 페이지 렌더링을 검증한다.
const useMagnetApplicationByMagnetIdQueryMock = vi.fn();

vi.mock('@/api/leadManagement', () => ({
  useMagnetApplicationByMagnetIdQuery: (
    magnetId: number,
    options?: { enabled?: boolean },
  ) => useMagnetApplicationByMagnetIdQueryMock(magnetId, options),
}));

// downloadCsv 호출을 가로채 정렬·필터된 행이 전달되는지 검증한다.
const downloadCsvMock = vi.fn();
vi.mock('./utils/csv', () => ({
  downloadCsv: (...args: unknown[]) => downloadCsvMock(...args),
}));

import LeadUserDetailPage from './LeadUserDetailPage';

const mockApplications: MagnetApplicationByMagnet[] = [
  {
    magnetApplicationId: 1,
    name: '홍길동',
    phoneNum: '01011112222',
    grade: '3학년',
    wishField: '개발',
    wishJob: '프론트엔드',
    wishIndustry: 'IT',
    wishCompany: '렛츠커리어',
    marketingAgree: true,
    questionAnswerList: [{ question: '왜', answer: '성장' }],
    createDate: '2026-05-10T09:00:00',
  },
  {
    magnetApplicationId: 2,
    name: '김철수',
    phoneNum: '01099998888',
    grade: '4학년',
    wishField: '디자인',
    wishJob: 'UX',
    wishIndustry: '플랫폼',
    wishCompany: '회사',
    marketingAgree: false,
    questionAnswerList: [],
    createDate: '2026-05-12T18:30:00',
  },
];

const renderPage = () =>
  render(
    <MemoryRouter initialEntries={['/leads/managements/123']}>
      <Routes>
        <Route path="/leads/managements/:id" element={<LeadUserDetailPage />} />
      </Routes>
    </MemoryRouter>,
  );

describe('LeadUserDetailPage', () => {
  beforeEach(() => {
    useMagnetApplicationByMagnetIdQueryMock.mockReset();
    downloadCsvMock.mockReset();
  });

  it('컬럼 헤더가 모두 렌더링된다', () => {
    useMagnetApplicationByMagnetIdQueryMock.mockReturnValue({
      data: mockApplications,
      isLoading: false,
    });

    renderPage();

    const grid = screen.getByRole('grid');
    expect(
      within(grid).getByRole('columnheader', { name: /신청일자/ }),
    ).toBeInTheDocument();
    expect(
      within(grid).getByRole('columnheader', { name: /이름/ }),
    ).toBeInTheDocument();
    expect(
      within(grid).getByRole('columnheader', { name: /전화번호/ }),
    ).toBeInTheDocument();
    expect(
      within(grid).getByRole('columnheader', { name: /마케팅 동의 여부/ }),
    ).toBeInTheDocument();
  });

  it('신청일자 컬럼이 기본 내림차순으로 정렬된다', () => {
    useMagnetApplicationByMagnetIdQueryMock.mockReturnValue({
      data: mockApplications,
      isLoading: false,
    });

    renderPage();

    // 가장 최근 createDate(2026-05-12 18:30)가 가장 먼저(첫 데이터 행) 표시되는지 확인.
    const rows = screen.getAllByRole('row');
    // rows[0]은 header row. 첫 데이터 행은 rows[1].
    expect(rows[1]).toHaveTextContent('김철수');
    expect(rows[2]).toHaveTextContent('홍길동');
  });

  it('데이터가 비어 있을 때 CSV 버튼이 비활성화된다', () => {
    useMagnetApplicationByMagnetIdQueryMock.mockReturnValue({
      data: [],
      isLoading: false,
    });

    renderPage();

    const csvButton = screen.getByRole('button', { name: 'CSV 내보내기' });
    expect(csvButton).toBeDisabled();
  });

  it('CSV 내보내기는 DataGrid 정렬 순서(내림차순)대로 행을 전달한다', () => {
    useMagnetApplicationByMagnetIdQueryMock.mockReturnValue({
      data: mockApplications,
      isLoading: false,
    });

    renderPage();

    const csvButton = screen.getByRole('button', { name: 'CSV 내보내기' });
    fireEvent.click(csvButton);

    expect(downloadCsvMock).toHaveBeenCalledTimes(1);

    const [filename, headers, dataRows] = downloadCsvMock.mock.calls[0] as [
      string,
      string[],
      string[][],
    ];

    expect(filename).toBe('magnet-123-applications');
    expect(headers[0]).toBe('신청일자');
    // 기본 정렬: createDate 내림차순. 더 최근(김철수, 2026-05-12)이 먼저.
    expect(dataRows).toHaveLength(2);
    expect(dataRows[0][1]).toBe('김철수');
    expect(dataRows[1][1]).toBe('홍길동');
    // 신청일자 첫 컬럼이 YYYY-MM-DD HH:mm 포맷인지 검증.
    expect(dataRows[0][0]).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/);
    expect(dataRows[1][0]).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/);
  });
});
