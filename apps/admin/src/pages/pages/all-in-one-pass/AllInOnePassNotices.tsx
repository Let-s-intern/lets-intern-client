import Header from '@/domain/admin/ui/header/Header';
import Heading from '@/domain/admin/ui/heading/Heading';

/** A-3 공지 / 가이드 관리 */
export default function AllInOnePassNotices() {
  return (
    <main className="flex flex-col gap-5 p-6">
      <Header>
        <Heading>공지/가이드 관리</Heading>
      </Header>
    </main>
  );
}
