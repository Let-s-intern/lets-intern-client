import MentorPickManager from '@/domain/mentor/pick/MentorPickManager';
import Heading from '@/domain/admin/ui/heading/Heading';

export default function AdminMentorPickPage() {
  return (
    <section className="p-5">
      <Heading className="mb-4">멘토 관리</Heading>

      <MentorPickManager />
    </section>
  );
}
