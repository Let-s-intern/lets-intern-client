import { createBrowserRouter } from 'react-router-dom';

// TODO: mentor 라우트 이전 후 추가 예정
export const router = createBrowserRouter([
  {
    path: '/',
    element: <div>렛츠커리어 멘토 (개발 중)</div>,
  },
  {
    path: '/profile',
    element: <div>프로필</div>,
  },
  {
    path: '/challenges',
    element: <div>챌린지 목록</div>,
  },
  {
    path: '/challenges/:challengeId',
    element: <div>챌린지 상세</div>,
  },
  {
    path: '/feedback-management',
    element: <div>피드백 관리</div>,
  },
  {
    path: '/notice',
    element: <div>공지사항</div>,
  },
  {
    path: '/notice/:noticeId',
    element: <div>공지사항 상세</div>,
  },
]);
