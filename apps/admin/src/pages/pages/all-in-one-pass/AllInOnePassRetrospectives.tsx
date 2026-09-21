import Header from '@/domain/admin/ui/header/Header';
import Heading from '@/domain/admin/ui/heading/Heading';
import CommonQuestionSection from '@/domain/all-in-one-pass/section/CommonQuestionSection';
import RoundListSection from '@/domain/all-in-one-pass/section/RoundListSection';

/** A-4 회고 관리 */
export default function AllInOnePassRetrospectives() {
  return (
    <main className="flex flex-col gap-5 p-6">
      <Header>
        <Heading>회고 관리</Heading>
      </Header>
      <CommonQuestionSection />
      <RoundListSection />
    </main>
  );
}
