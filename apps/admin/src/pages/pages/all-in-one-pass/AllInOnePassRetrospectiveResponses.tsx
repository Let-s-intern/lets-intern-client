import Header from '@/domain/admin/ui/header/Header';
import Heading from '@/domain/admin/ui/heading/Heading';

/** A-5 회고 응답 조회 */
export default function AllInOnePassRetrospectiveResponses() {
  return (
    <main className="flex flex-col gap-5 p-6">
      <Header>
        <Heading>회고 응답 조회</Heading>
      </Header>
    </main>
  );
}
