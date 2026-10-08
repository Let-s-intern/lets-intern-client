import Header from '@/domain/admin/ui/header/Header';
import Heading from '@/domain/admin/ui/heading/Heading';

/** A-8 참여중 유저 목록 (신규). 전체 올인원패스의 참여중 유저를 조회한다. */
export default function AllInOnePassParticipants() {
  return (
    <main className="flex flex-col gap-5 p-6">
      <Header>
        <Heading>참여중인 유저 목록</Heading>
      </Header>
    </main>
  );
}
