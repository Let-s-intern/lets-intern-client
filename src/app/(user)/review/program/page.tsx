import Link from 'next/link';

const Page = () => {
  return (
    // TODO: 레이아웃 파일로 만들어보기
    <div className="flex">
      <nav>
        <ul>
          <li>
            <Link href="/review/blog">Blog</Link>
          </li>
          <li>
            <Link href="/review/interview">Interview</Link>
          </li>
          <li>
            <Link href="/review/program">Program</Link>
          </li>
        </ul>
      </nav>
      <div>Program</div>
    </div>
  );
};

export default Page;
