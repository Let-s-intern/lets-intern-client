import { useUserDetailAdminQuery } from '@/api/user';
import ActionButton from '@/components/admin/ui/button/ActionButton';
import { gradeToText } from '@/utils/convert';
import { useParams, useRouter } from 'next/navigation';

const UserDetail = () => {
  const params = useParams<{ userId: string }>();
  const router = useRouter();

  const { data, isLoading } = useUserDetailAdminQuery({
    userId: Number(params.userId || 0),
    enabled: params.userId !== undefined,
  });

  return (
    <div className="py flex h-full w-full flex-col items-center justify-start gap-y-8 px-8 py-16">
      <div className="grid w-full grid-cols-2 flex-col items-center justify-start gap-x-5 gap-y-4">
        {!data ? (
          isLoading ? (
            <div>로딩 중...</div>
          ) : (
            <div>데이터가 없습니다.</div>
          )
        ) : (
          <>
            <div className="flex w-full flex-col gap-y-2">
              <div className="font-semibold">이름</div>
              <div className="w-full rounded-sm bg-neutral-90 px-4 py-3">
                {data.userInfo.name}
              </div>
            </div>
            <div className="flex w-full flex-col gap-y-2">
              <div className="font-semibold">이메일</div>
              <div className="w-full rounded-sm bg-neutral-90 px-4 py-3">
                {data.userInfo.email}
              </div>
            </div>
            <div className="flex w-full flex-col gap-y-2">
              <div className="font-semibold">소통용 이메일</div>
              <div className="w-full rounded-sm bg-neutral-90 px-4 py-3">
                {data.userInfo.contactEmail ? data.userInfo.contactEmail : '-'}
              </div>
            </div>
            <div className="flex w-full flex-col gap-y-2">
              <div className="font-semibold">휴대폰 번호</div>
              <div className="w-full rounded-sm bg-neutral-90 px-4 py-3">
                {data.userInfo.phoneNum}
              </div>
            </div>
            <div className="flex w-full flex-col gap-y-2">
              <div className="font-semibold">유입경로</div>
              <div className="w-full rounded-sm bg-neutral-90 px-4 py-3">
                {data.userInfo.inflowPath ? data.userInfo.inflowPath : '-'}
              </div>
            </div>
            <div className="flex w-full flex-col gap-y-2">
              <div className="font-semibold">학교</div>
              <div className="w-full rounded-sm bg-neutral-90 px-4 py-3">
                {data.userInfo.university ? data.userInfo.university : '-'}
              </div>
            </div>
            <div className="flex w-full flex-col gap-y-2">
              <div className="font-semibold">학년</div>
              <div className="w-full rounded-sm bg-neutral-90 px-4 py-3">
                {data.userInfo.grade ? gradeToText[data.userInfo.grade] : '-'}
              </div>
            </div>
            <div className="flex w-full flex-col gap-y-2">
              <div className="font-semibold">전공</div>
              <div className="w-full rounded-sm bg-neutral-90 px-4 py-3">
                {data.userInfo.major ? data.userInfo.major : '-'}
              </div>
            </div>
            <div className="flex w-full flex-col gap-y-2">
              <div className="font-semibold">희망 직무</div>
              <div className="w-full rounded-sm bg-neutral-90 px-4 py-3">
                {data.userInfo.wishJob ? data.userInfo.wishJob : '-'}
              </div>
            </div>
            <div className="flex w-full flex-col gap-y-2">
              <div className="font-semibold">희망 기업</div>
              <div className="w-full rounded-sm bg-neutral-90 px-4 py-3">
                {data.userInfo.wishCompany ? data.userInfo.wishCompany : '-'}
              </div>
            </div>
            <div className="flex w-full flex-col gap-y-2">
              <div className="font-semibold">참여 프로그램 내역</div>
              <div className="w-full rounded-sm bg-neutral-90 px-4 py-3">
                {data.applicationInfo.length < 1 ? (
                  <div>신청 내역이 없습니다.</div>
                ) : (
                  data.applicationInfo.map((applicationInfo, idx) => (
                    <div
                      key={data.userInfo.id + applicationInfo.programId + idx}
                    >
                      {applicationInfo.programTitle}
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </div>
      <div className="flex items-center justify-center gap-x-5">
        <ActionButton bgColor="gray" onClick={() => router.back()}>
          이전
        </ActionButton>
        <ActionButton
          to={`/admin/users/${data?.userInfo.id}/edit`}
          bgColor="green"
        >
          수정
        </ActionButton>
      </div>
    </div>
  );
};

export default UserDetail;
