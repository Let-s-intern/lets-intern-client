'use client';

import { useUserDetailAdminQuery } from '@/api/user';
import ActionButton from '@/components/admin/ui/button/ActionButton';
import Header from '@/components/admin/ui/header/Header';
import Heading from '@/components/admin/ui/heading/Heading';
import { useParams, useRouter } from 'next/navigation';
import PersonalExperience from './PersonalExperience';
import PersonalHistory from './PersonalHistory';
import PersonalInfo from './PersonalInfo';

const UserDetail = () => {
  const params = useParams<{ userId: string }>();
  const router = useRouter();

  const { data, isLoading } = useUserDetailAdminQuery({
    userId: Number(params.userId || 0),
    enabled: params.userId !== undefined,
  });

  return (
    <div className="py flex h-full w-full flex-col gap-y-8 p-8">
      {!data ? (
        isLoading ? (
          <div>로딩 중...</div>
        ) : (
          <div>데이터가 없습니다.</div>
        )
      ) : (
        <div>
          <Header>
            <Heading>커리어 DB</Heading>
          </Header>
          <main className="flex w-full flex-col gap-y-8">
            <div className="grid w-full grid-cols-2 flex-col gap-x-8 gap-y-4">
              <PersonalInfo data={data} />
              <PersonalHistory data={data} />
            </div>
            <PersonalExperience data={data} />
          </main>
        </div>
      )}
      <div className="flex items-center justify-center gap-x-5">
        <ActionButton bgColor="gray" onClick={() => router.back()}>
          이전
        </ActionButton>
      </div>
    </div>
  );
};

export default UserDetail;
