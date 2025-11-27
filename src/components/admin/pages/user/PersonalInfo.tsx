import { UserAdminDetail } from '@/schema';
import { gradeToText } from '@/utils/convert';

const PersonalInfo = ({ data }: { data: UserAdminDetail }) => {
  return (
    <div>
      <div className="flex items-center justify-between border-b pb-2">
        <h1 className="text-lg font-semibold">개인 정보</h1>
        <button
          onClick={() =>
            (window.location.href = `/admin/users/${data?.userInfo.id}/edit`)
          }
          className="rounded-lg bg-neutral-50 px-4 py-1 text-white hover:opacity-80"
        >
          수정
        </button>
      </div>
      <div className="mt-2 grid w-full grid-cols-2 flex-col gap-x-5 gap-y-4">
        <div className="flex w-full flex-col gap-y-2">
          <div className="font-semibold">이름</div>
          <div className="w-full rounded-sm bg-neutral-90 px-4 py-3">
            {data.userInfo.name}
          </div>
        </div>
        <div className="flex w-full flex-col gap-y-2">
          <div className="font-semibold">희망 기업</div>
          <div className="w-full rounded-sm bg-neutral-90 px-4 py-3">
            {data.userInfo.wishCompany ? data.userInfo.wishCompany : '-'}
          </div>
        </div>
        <div className="flex w-full flex-col gap-y-2">
          <div className="font-semibold">휴대폰 번호</div>
          <div className="w-full rounded-sm bg-neutral-90 px-4 py-3">
            {data.userInfo.phoneNum}
          </div>
        </div>
        <div className="flex w-full flex-col gap-y-2">
          <div className="font-semibold">희망 직무</div>
          <div className="w-full rounded-sm bg-neutral-90 px-4 py-3">
            {data.userInfo.wishJob ? data.userInfo.wishJob : '-'}
          </div>
        </div>
        <div className="flex w-full flex-col gap-y-2">
          <div className="font-semibold">이메일</div>
          <div className="w-full rounded-sm bg-neutral-90 px-4 py-3">
            {data.userInfo.email}
          </div>
        </div>
        <div className="flex w-full flex-col gap-y-2">
          <div className="font-semibold">희망 산업</div>
          <div className="w-full rounded-sm bg-neutral-90 px-4 py-3">
            {data.userInfo.wishIndustry ? data.userInfo.wishIndustry : '-'}
          </div>
        </div>
        <div className="flex w-full flex-col gap-y-2">
          <div className="font-semibold">소통용 이메일</div>
          <div className="w-full rounded-sm bg-neutral-90 px-4 py-3">
            {data.userInfo.contactEmail ? data.userInfo.contactEmail : '-'}
          </div>
        </div>

        <div className="flex w-full flex-col gap-y-2">
          <div className="font-semibold">희망 구직 조건</div>
          <div className="w-full rounded-sm bg-neutral-90 px-4 py-3">
            {data.userInfo.wishEmploymentType
              ? data.userInfo.wishEmploymentType
              : '-'}
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
          <div className="font-semibold">참여 프로그램 내역</div>
          <div className="max-h-40 w-full overflow-auto rounded-sm bg-neutral-90 px-4 py-3">
            {data.applicationInfo.length < 1 ? (
              <div>신청 내역이 없습니다.</div>
            ) : (
              data.applicationInfo.map((applicationInfo, idx) => (
                <div key={data.userInfo.id + applicationInfo.programId + idx}>
                  {applicationInfo.programTitle}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;
