import Heading from '@/domain/admin/ui/heading/Heading';
import AdminLiveMentoringTable from '@/domain/live-mentoring/AdminLiveMentoringTable';

export default function AdminLiveMentoringPage() {
  return (
    <section className="p-5">
      <Heading className="mb-1">1대1 라이브 멘토링 관리</Heading>
      <p className="text-xsmall14 text-neutral-40 mb-4">
        멘토가 만든 1대1 라이브 멘토링 상품과 현재 개설을 조회합니다. 개설은
        멘토가 직접 열고 닫으며, 필요하면 여기서 강제 종료할 수 있습니다.
      </p>

      <AdminLiveMentoringTable />
    </section>
  );
}
