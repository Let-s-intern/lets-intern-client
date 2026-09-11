import Header from '@/domain/admin/ui/header/Header';
import Heading from '@/domain/admin/ui/heading/Heading';

/** A-1 올인원 패스 개설(목록) */
export default function AllInOnePassList() {
  return (
    <main className="flex flex-col gap-5 p-6">
      <Header>
        <Heading>올인원 패스 개설</Heading>
      </Header>
    </main>
  );
}
