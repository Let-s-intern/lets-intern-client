import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import AdminLiveMentoringDetailPageEditPage from './AdminLiveMentoringDetailPageEditPage';

const CurrentLocation = () => {
  const location = useLocation();
  return <span>{`${location.pathname}${location.search}`}</span>;
};

describe('AdminLiveMentoringDetailPageEditPage', () => {
  it('예전 주소를 1:1 화면의 상세페이지 탭으로 보낸다', () => {
    render(
      <MemoryRouter initialEntries={['/live-mentoring/7/detail-page']}>
        <Routes>
          <Route
            path="/live-mentoring/:mentorId/detail-page"
            element={<AdminLiveMentoringDetailPageEditPage />}
          />
          <Route path="/live-mentoring" element={<CurrentLocation />} />
        </Routes>
      </MemoryRouter>,
    );
    expect(
      screen.getByText('/live-mentoring?tab=detailPage&mentorId=7'),
    ).toBeInTheDocument();
  });
});
