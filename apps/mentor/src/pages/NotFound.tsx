import { Link, useLocation } from 'react-router-dom';

export default function NotFound() {
  const location = useLocation();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="text-center text-lg font-bold text-neutral-900">
          페이지를 찾을 수 없습니다
        </h1>
        <p className="mt-2 break-all text-center text-sm text-neutral-500">
          {location.pathname}
          {location.search}
        </p>
        <div className="mt-6 flex justify-center">
          <Link
            to="/"
            className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
          >
            홈으로
          </Link>
        </div>
      </div>
    </div>
  );
}
