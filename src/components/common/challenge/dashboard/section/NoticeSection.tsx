import clsx from 'clsx';
import { Link } from 'react-router-dom';

interface Props {
  noticeList: any;
  isLoading: boolean;
}

const NoticeSection = ({ noticeList, isLoading }: Props) => {
  if (isLoading) {
    return <section className="mb-10">로딩 중...</section>;
  }

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-1 flex-col gap-2 rounded-xl border border-[#E4E4E7] p-6">
        <h2 className="font-semibold text-[#4A495C]">공지사항</h2>
        <ul className="flex flex-1 flex-col gap-1">
          {noticeList.map((notice: any) => (
            <Link key={notice.id} to="#" className="text-sm text-[#333333]">
              {notice.title}
            </Link>
          ))}
        </ul>
      </div>
      <ul className="flex rounded-xl border border-[#E4E4E7]">
        <li
          className={clsx(
            'flex h-16 w-16 cursor-pointer items-center justify-center rounded-xl text-center text-sm text-[#6A6A77]',
            {
              'bg-[#F0F0F0]': true,
            },
          )}
        >
          미션
          <br />
          수행법
        </li>
        <li className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-xl text-center text-sm text-[#9A9AA3]">
          환급
          <br />
          정책
        </li>
        <li className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-xl text-center text-sm text-[#9A9AA3]">
          대시보드
          <br />
          설명서
        </li>
      </ul>
    </section>
  );
};

export default NoticeSection;
