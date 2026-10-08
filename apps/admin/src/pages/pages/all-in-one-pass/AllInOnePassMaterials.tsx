import Header from '@/domain/admin/ui/header/Header';
import Heading from '@/domain/admin/ui/heading/Heading';

/** A-7 자료집 관리 (신규). 기존 혜택(benefit) API를 재사용해 자료집을 관리한다. */
export default function AllInOnePassMaterials() {
  return (
    <main className="flex flex-col gap-5 p-6">
      <Header>
        <Heading>자료집 관리</Heading>
      </Header>
    </main>
  );
}
