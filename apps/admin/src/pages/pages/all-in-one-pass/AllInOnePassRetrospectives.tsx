import Header from '@/domain/admin/ui/header/Header';
import Heading from '@/domain/admin/ui/heading/Heading';

/** A-4 회고 관리 */
export default function AllInOnePassRetrospectives() {
  return (
    <main className="flex flex-col gap-5 p-6">
      <Header>
        <Heading>회고 관리</Heading>
      </Header>
    </main>
  );
}
