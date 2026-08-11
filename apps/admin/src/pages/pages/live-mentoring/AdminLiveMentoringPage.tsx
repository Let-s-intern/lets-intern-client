import Heading from '@/domain/admin/ui/heading/Heading';
import AdminLiveMentoringTable from '@/domain/live-mentoring/AdminLiveMentoringTable';

export default function AdminLiveMentoringPage() {
  return (
    <section className="p-5">
      <Heading className="mb-1">1대1 라이브 멘토링 관리</Heading>
      <p className="text-xsmall14 text-neutral-40 mb-4">
        멘토가 제출한 상품을 검토하고 승인합니다. 승인하면 제출한 진행시간·기간
        으로 개설이 함께 생성되어 곧바로 오픈됩니다.
      </p>

      <AdminLiveMentoringTable />
    </section>
  );
}
