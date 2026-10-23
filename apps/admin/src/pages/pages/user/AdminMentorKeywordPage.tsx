import Heading from '@/domain/admin/ui/heading/Heading';
import MentorHashTagManagement from '@/domain/mentor/hash-tag/MentorHashTagManagement';

export default function AdminMentorKeywordPage() {
  return (
    <section className="p-5">
      <Heading className="mb-4">멘토 관리</Heading>

      <MentorHashTagManagement />
    </section>
  );
}
