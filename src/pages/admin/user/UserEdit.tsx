import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { TextField } from '@mui/material';
import {
  PatchUserType,
  usePatchUserAdminMutation,
  useUserDetailAdminQuery,
} from '../../../api/user';
import { isValidEmail, isValidPhoneNumber } from '../../../utils/valid';

const UserEdit = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [userForm, setUserForm] = useState<PatchUserType>({
    name: '',
    email: '',
    contactEmail: null,
    phoneNum: '',
    university: null,
    inflowPath: null,
    grade: null,
    major: null,
    wishJob: null,
    wishCompany: null,
  });

  const { data, isLoading } = useUserDetailAdminQuery({
    userId: Number(params.userId || 0),
    enabled: params.userId !== undefined,
  });

  const {
    mutate: tryPatchUserDetail,
    isPending,
    isSuccess,
  } = usePatchUserAdminMutation(Number(params.userId || 0));

  useEffect(() => {
    if (data) {
      setUserForm(data.userInfo);
    }
  }, [data]);

  const handleCancelButtonClick = () => {
    navigate(-1);
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userForm.name) {
      alert('이름을 입력해주세요.');
      return;
    }
    if (!isValidEmail(userForm.email)) {
      alert('이메일 형식이 올바르지 않습니다.');
      return;
    }
    if (!isValidPhoneNumber(userForm.phoneNum)) {
      alert('휴대폰 번호 형식이 올바르지 않습니다.');
      return;
    }

    tryPatchUserDetail(userForm);
  };

  return (
    <div className="py flex h-full w-full flex-col items-center justify-start gap-y-8 px-8 py-16">
      <div className="text-xl font-bold">회원 정보 수정</div>
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
            <TextField
              label="이름"
              name="name"
              value={userForm.name ? userForm.name : ''}
              onChange={handleInputChanged}
              placeholder="이름을 입력하세요"
            />
            <TextField
              label="이메일"
              name="email"
              value={userForm.email ? userForm.email : ''}
              onChange={handleInputChanged}
              placeholder="이메일을 입력하세요"
            />
            <TextField
              label="소통용 이메일"
              name="contactEmail"
              value={userForm.contactEmail ? userForm.contactEmail : ''}
              onChange={handleInputChanged}
              placeholder="소통용 이메일을 입력하세요"
            />
            <TextField
              label="전화번호"
              name="phoneNum"
              value={userForm.phoneNum ? userForm.phoneNum : ''}
              onChange={handlePhoneNumChange}
              placeholder="010-1234-5678"
            />
            <TextField
              label="유입경로"
              name="inflowPath"
              value={userForm.inflowPath ? userForm.inflowPath : ''}
              onChange={handleInputChanged}
              placeholder="유입경로를 입력하세요"
            />
            <TextField
              label="학교"
              name="university"
              value={userForm.inflowPath ? userForm.inflowPath : ''}
              onChange={handleInputChanged}
              placeholder="학교를 입력하세요"
            />
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
                  data.applicationInfo.map((applicationInfo) => (
                    <div key={applicationInfo.programId}>
                      {applicationInfo.programTitle}
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </form>
      <div className="flex items-center justify-center gap-x-5">
        <ActionButton bgColor="gray" onClick={() => navigate(-1)}>
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

export default UserEdit;
