import { useUserDetailAdminQuery } from '@/api/user/user';
import MentoringSubmissionSection from '@/domain/admin/user/user-detail/ui/MentoringSubmissionSection';
import PurchaseHistorySection from '@/domain/admin/user/user-detail/ui/PurchaseHistorySection';
import UserInquirySection from '@/domain/admin/user/user-detail/ui/UserInquirySection';
import UserDetailTabs, {
  UserDetailTabKey,
} from '@/domain/admin/user/user-detail/ui/UserDetailTabs';
import ActionButton from '@/domain/admin/ui/button/ActionButton';
import Header from '@/domain/admin/ui/header/Header';
import Heading from '@/domain/admin/ui/heading/Heading';
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PersonalExperience from './PersonalExperience';
import PersonalHistory from './PersonalHistory';
import PersonalInfo from './PersonalInfo';

const UserDetail = () => {
  const params = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [tab, setTab] = useState<UserDetailTabKey>('info');

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
          <UserDetailTabs value={tab} onChange={setTab} />
          <main className="mt-6 flex w-full flex-col gap-y-8">
            {tab === 'info' ? (
              <>
                <div className="grid w-full grid-cols-2 flex-col gap-x-8 gap-y-4">
                  <PersonalInfo data={data} />
                  <PersonalHistory data={data} />
                </div>
                <PersonalExperience data={data} />
              </>
            ) : tab === 'purchase' ? (
              <PurchaseHistorySection data={data} />
            ) : tab === 'mentoring' ? (
              <MentoringSubmissionSection
                list={data.liveMentoringSubmissionList}
              />
            ) : tab === 'inquiry' ? (
              <UserInquirySection userId={Number(params.userId)} />
            ) : (
              <div>준비 중입니다.</div>
            )}
          </main>
        </div>
      )}
      <div className="flex items-center justify-center gap-x-5">
        <ActionButton bgColor="gray" onClick={() => navigate(-1)}>
          이전
        </ActionButton>
      </div>
    </div>
  );
};

export default UserDetail;
