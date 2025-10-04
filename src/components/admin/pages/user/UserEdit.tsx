import {
  PatchUserType,
  usePatchUserAdminMutation,
  useUserDetailAdminQuery,
} from '@/api/user';
import ActionButton from '@/components/admin/ui/button/ActionButton';
import GradeDropdown from '@/components/common/mypage/privacy/form-control/GradeDropdown';
import Input from '@/components/ui/input/Input';
import { isValidEmail, isValidPhoneNumber } from '@/utils/valid';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const UserEdit = () => {
  const params = useParams<{ userId: string }>();
  const router = useRouter();
  const [userForm, setUserForm] = useState<PatchUserType>({
    name: '',
    email: '',
    contactEmail: null,
    phoneNum: '',
    university: null,
    inflowPath: null,
    grade: '',
    major: null,
    wishJob: null,
    wishCompany: null,
  });

  const { data, isLoading } = useUserDetailAdminQuery({
    userId: Number(params.userId || 0),
    enabled: params.userId !== undefined,
  });

  const { mutate: tryPatchUserDetail } = usePatchUserAdminMutation({
    userId: Number(params.userId || 0),
    successCallback: () => {
      alert('수정되었습니다.');
      router.back();
    },
    errorCallback: (error: Error) => {
      console.log(error);
      alert('수정에 실패했습니다.');
    },
  });

  useEffect(() => {
    if (data) {
      setUserForm(data.userInfo);
    }
  }, [data]);

  const handleCancelButtonClick = () => {
    router.back();
  };

  const handleInputChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserForm({
      ...userForm,
      [name]: value,
    });
  };

  const handlePhoneNumChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let phoneNum = e.target.value.replace(/[^0-9]/g, '');

    if (phoneNum.length > 11) {
      phoneNum = phoneNum.slice(0, 11);
    }

    if (phoneNum.length <= 6) {
      phoneNum = phoneNum.replace(/(\d{0,3})(\d{0,3})/, (match, p1, p2) => {
        return p2 ? `${p1}-${p2}` : `${p1}`;
      });
    } else if (phoneNum.length <= 10) {
      phoneNum = phoneNum.replace(
        /(\d{0,3})(\d{0,3})(\d{0,4})/,
        (match, p1, p2, p3) => {
          return p3 ? `${p1}-${p2}-${p3}` : `${p1}-${p2}`;
        },
      );
    } else {
      phoneNum = phoneNum.replace(
        /(\d{3})(\d{4})(\d+)/,
        (match, p1, p2, p3) => {
          return `${p1}-${p2}-${p3}`;
        },
      );
    }

    setUserForm({ ...userForm, phoneNum });
  };

  const handleGradeChange = (grade: string) => {
    setUserForm({ ...userForm, grade });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userForm.name) {
      alert('이름을 입력해주세요.');
      return;
    }
    if (!isValidEmail(userForm.email ?? '')) {
      alert('이메일 형식이 올바르지 않습니다.');
      return;
    }
    if (!isValidPhoneNumber(userForm.phoneNum ?? '')) {
      alert('휴대폰 번호 형식이 올바르지 않습니다.');
      return;
    }

    tryPatchUserDetail(userForm);
  };

  return (
    <div className="py flex h-full w-full flex-col items-center justify-start gap-y-8 px-8 py-16">
      <div className="w-full text-xl font-bold">회원 정보 수정</div>
      <form
        className="grid w-full grid-cols-2 flex-col items-center justify-start gap-x-5 gap-y-4"
        onSubmit={handleSubmit}
      >
        {!data ? (
          isLoading ? (
            <div>로딩 중...</div>
          ) : (
            <div>데이터가 없습니다.</div>
          )
        ) : (
          <>
            <Input
              label="이름"
              name="name"
              value={userForm.name ? userForm.name : ''}
              onChange={handleInputChanged}
              placeholder="이름을 입력하세요"
            />
            <Input
              label="이메일"
              name="email"
              value={userForm.email ? userForm.email : ''}
              onChange={handleInputChanged}
              placeholder="이메일을 입력하세요"
            />
            <Input
              label="소통용 이메일"
              name="contactEmail"
              value={userForm.contactEmail ? userForm.contactEmail : ''}
              onChange={handleInputChanged}
              placeholder="소통용 이메일을 입력하세요"
            />
            <Input
              label="전화번호"
              name="phoneNum"
              value={userForm.phoneNum ? userForm.phoneNum : ''}
              onChange={handlePhoneNumChange}
              placeholder="010-1234-5678"
            />
            <Input
              label="유입경로"
              name="inflowPath"
              value={userForm.inflowPath ? userForm.inflowPath : ''}
              onChange={handleInputChanged}
              placeholder="유입경로를 입력하세요"
            />
            <Input
              label="학교"
              name="university"
              value={userForm.university ? userForm.university : ''}
              onChange={handleInputChanged}
              placeholder="학교를 입력하세요"
            />
            <div className="z-10 flex w-full flex-col gap-y-2">
              <GradeDropdown
                value={!userForm.grade ? '' : userForm.grade}
                setValue={handleGradeChange}
                type="MYPAGE"
              />
            </div>
            <Input
              label="전공"
              name="major"
              value={userForm.major ? userForm.major : ''}
              onChange={handleInputChanged}
              placeholder="전공을 입력하세요"
            />
            <Input
              label="희망 직무"
              name="wishJob"
              value={userForm.wishJob ? userForm.wishJob : ''}
              onChange={handleInputChanged}
              placeholder="희망 직무를 입력하세요"
            />
            <Input
              label="희망 기업"
              name="wishCompany"
              value={userForm.wishCompany ? userForm.wishCompany : ''}
              onChange={handleInputChanged}
              placeholder="희망 기업을 입력하세요"
            />
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
            <div className="col-span-2 mt-9 flex w-full items-center justify-center gap-x-5">
              <ActionButton
                bgColor="gray"
                type="button"
                onClick={handleCancelButtonClick}
              >
                닫기
              </ActionButton>
              <ActionButton bgColor="green" type={'submit'}>
                수정하기
              </ActionButton>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default UserEdit;
