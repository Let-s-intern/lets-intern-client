import Header from '@/domain/admin/ui/header/Header';
import Heading from '@/domain/admin/ui/heading/Heading';

/** A-2 올인원 패스 생성 */
export default function AllInOnePassCreate() {
  return (
    <main className="flex flex-col gap-5 p-6">
      <Header>
        <Heading>올인원 패스 생성</Heading>
      </Header>
    </main>
  );
}
