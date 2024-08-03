/** 사용하지 않습니다. react-query 이슈로 사용하기 어려움 */

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { routes } from './routes';

export const router = createBrowserRouter(routes);

const BrowserRouter = () => {
  return <RouterProvider router={router} />;
};

export default BrowserRouter;
