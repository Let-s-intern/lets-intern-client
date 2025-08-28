import Link from 'next/link';

const NotFound = () => {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-screen-xl px-4 py-16 lg:px-6 lg:py-32">
        <div className="mx-auto max-w-screen-sm text-center">
          <span className="mb-4 text-7xl font-extrabold tracking-tight text-primary-dark lg:text-9xl">
            404
          </span>
          <p className="mb-4 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
            찾을 수 없는 페이지입니다.
          </p>
          <p className="mb-4 text-lg font-light text-gray-500">
            죄송합니다. 홈페이지에서 다양한 정보를 찾아보세요.
          </p>
          <Link
            href="/"
            className="my-4 inline-flex rounded-lg bg-primary px-5 py-2.5 text-center text-sm font-medium text-white transition hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-primary-light focus:ring-offset-2"
          >
            홈페이지로 돌아가기
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NotFound;