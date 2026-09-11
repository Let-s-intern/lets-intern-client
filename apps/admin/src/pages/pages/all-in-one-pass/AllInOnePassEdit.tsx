import Header from '@/domain/admin/ui/header/Header';
import Heading from '@/domain/admin/ui/heading/Heading';

/** A-2 올인원 패스 수정 */
export default function AllInOnePassEdit() {
  return (
    <main className="flex flex-col gap-5 p-6">
      <Header>
        <Heading>올인원 패스 수정</Heading>
      </Header>
    </main>
  );
}
