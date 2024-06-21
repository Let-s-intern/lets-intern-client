import { useEffect, useState } from 'react';

import Input from '../../../components/common/ui/input/Input';
import GradeDropdown from '../../../components/common/mypage/privacy/form-control/GradeDropdown';
import Button from '../../../components/common/ui/button/Button';
import BankDropdown from '../../../components/common/mypage/privacy/form-control/BankDropdown';
import { accountType } from '../../../schema';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from '../../../utils/axios';
import { isValidEmail, isValidPhoneNumber } from '../../../utils/valid';
import { useNavigate, useParams } from 'react-router-dom';

const ChallengeUserInfo = () => {
  const queryClient = useQueryClient();
  const params = useParams();
  const navigate = useNavigate();

  const [value, setValue] = useState({
    university: '',
    grade: '',
    major: '',
    wishJob: '',
    wishCompany: '',
    accountNum: '',
    accountType: '',
  });
  const [buttonDisabled, setButtonDisabled] = useState(false);

  useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const res = await axios.get('/user');
      setValue({
        university: res.data.data.university,
        grade: res.data.data.grade,
        major: res.data.data.major,
        wishJob: res.data.data.wishJob,
        wishCompany: res.data.data.wishCompany,
        accountNum: res.data.data.accountNum,
        accountType: res.data.data.accountType,
      });
      return res.data;
    },
    refetchOnWindowFocus: false,
  });

  const { data: isValidUserInfoData, isLoading: isValidUserInfoLoading } =
    useQuery({
      queryKey: ['user', 'challenge-info'],
      queryFn: async ({ queryKey }) => {
        const res = await axios.get(`/${queryKey[0]}/${queryKey[1]}`);
        return res.data;
      },
    });

  const isValidUserInfo = isValidUserInfoData?.data?.pass;

  const isLoading = isValidUserInfoLoading;

  const editMyInfo = useMutation({
    mutationFn: async () => {
      const res = await axios.patch('/user', value);
      return res.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['user'] });
      navigate(`/challenge/${params.programId}`);
      // window.location.href = `/challenge/${params.programId}`;
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue({ ...value, [e.target.name]: e.target.value });
  };

  const handleGradeChange = (grade: string) => {
    setValue({ ...value, grade });
  };

  const handleSubmit = () => {
    editMyInfo.mutate();
  };

  useEffect(() => {
    setButtonDisabled(
      !value.university ||
        !value.grade ||
        !value.major ||
        !value.wishJob ||
        !value.wishCompany ||
        !value.accountNum ||
        !value.accountType,
    );
  }, [value]);

  useEffect(() => {
    if (isLoading) return;
    if (isValidUserInfo) navigate(`/challenge/${params.programId}`);
  }, [isValidUserInfo, isValidUserInfoLoading]);

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 pb-24 pt-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-center text-xl font-semibold">
          챌린지 대시보드 추가정보 입력
        </h1>
        <p className="text-center text-neutral-40">
          안녕하세요, 이름님! 챌린지 대시보드에 입장하신 걸 환영합니다!
          <br />
          챌린지 대시보드 입장을 위해 추가정보를 입력해주세요.
        </p>
      </div>
      <div className="flex flex-col gap-8">
        <section className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold">기본 정보</h2>
            <p className="text-neutral-40">
              * 기본 정보를 바탕으로 더 유익한 학습콘텐츠를 제공해드릴게요!
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label htmlFor="university" className="text-1-medium">
                학교
              </label>
              <Input
                id="university"
                name="university"
                placeholder="렛츠대학교"
                value={value.university}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="grade" className="text-1-medium">
                학년
              </label>
              <GradeDropdown
                value={value.grade}
                setValue={handleGradeChange}
                type="MYPAGE"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="major" className="text-1-medium">
                전공
              </label>
              <Input
                id="major"
                name="major"
                placeholder="OO학과"
                value={value.major}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="wishJob" className="text-1-medium">
                희망 직무
              </label>
              <Input
                id="wishJob"
                name="wishJob"
                placeholder="희망 직무를 입력해주세요."
                value={value.wishJob}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="wishCompany" className="text-1-medium">
                희망 기업
              </label>
              <Input
                id="wishCompany"
                name="wishCompany"
                placeholder="희망 기업을 입력해주세요."
                value={value.wishCompany}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </section>
        <section className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-lg font-semibold">계좌 정보</h1>
            <p className="text-neutral-40">
              * 미션을 성공하여, 페이백 점수를 달성하면 아래 계좌 정보를 통해
              환급금이 지급될 예정이에요!
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label htmlFor="bank" className="text-1-medium">
                거래 은행
              </label>
              <BankDropdown value={value} setValue={setValue} />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="accountNum" className="text-1-medium">
                계좌번호
              </label>
              <Input
                id="accountNum"
                name="accountNum"
                placeholder="계좌번호를 입력해주세요."
                value={value.accountNum}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </section>
        <button
          className="rounded-md bg-primary px-4 py-3 font-medium text-white disabled:bg-neutral-60"
          onClick={handleSubmit}
          disabled={buttonDisabled}
        >
          챌린지 대시보드 입장하기
        </button>
      </div>
    </main>
  );
};

export default ChallengeUserInfo;
