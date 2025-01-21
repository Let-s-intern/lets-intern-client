import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import TextArea from '@components/common/ui/input/TextArea';
import GradeDropdown from '../../../components/common/mypage/privacy/form-control/GradeDropdown';
import Input from '../../../components/common/ui/input/Input';
import axios from '../../../utils/axios';

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
    goal: '',
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
        goal: '',
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

  const { data: programTitleData, isLoading: programTitleLoading } = useQuery({
    queryKey: ['challenge', params.programId, 'title'],
    queryFn: async ({ queryKey }) => {
      const res = await axios.get(
        `/${queryKey[0]}/${queryKey[1]}/${queryKey[2]}`,
      );
      return res.data;
    },
  });

  const programTitle = programTitleData?.data?.title;

  const { data: usernameData, isLoading: usernameLoading } = useQuery({
    queryKey: ['user'],
    queryFn: async ({ queryKey }) => {
      const res = await axios.get(`/${queryKey[0]}`);
      return res.data;
    },
  });

  const username = usernameData?.data?.name;

  const isLoading =
    isValidUserInfoLoading || programTitleLoading || usernameLoading;

  const editMyInfo = useMutation({
    mutationFn: async () => {
      const res = await axios.patch('/user', value);
      return res.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['user'] });
      navigate(`/challenge/${params.programId}`);
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue({ ...value, [e.target.name]: e.target.value });
  };

  const handleGoalChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue({ ...value, goal: e.target.value });
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
        !value.goal,
    );
  }, [value]);

  useEffect(() => {
    if (isLoading) return;
    if (isValidUserInfo) navigate(`/challenge/${params.programId}`);
  }, [isValidUserInfo, isLoading]);

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 pb-24 pt-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-center text-xl font-semibold">
          챌린지 대시보드 추가정보 입력
        </h1>
        <p className="text-center text-neutral-40">
          안녕하세요, {username}님! {programTitle}에 입장하신 걸 환영합니다!
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
                학교<span className="text-requirement">*</span>
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
                학년<span className="text-requirement">*</span>
              </label>
              <GradeDropdown
                value={value.grade}
                setValue={handleGradeChange}
                type="MYPAGE"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="major" className="text-1-medium">
                전공<span className="text-requirement">*</span>
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
                희망 직무<span className="text-requirement">*</span>
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
                희망 기업<span className="text-requirement">*</span>
              </label>
              <Input
                id="wishCompany"
                name="wishCompany"
                placeholder="희망 기업을 입력해주세요."
                value={value.wishCompany}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="wishCompany" className="text-1-medium">
                챌린지 목표<span className="text-requirement">*</span>
              </label>
              <TextArea
                id="wishCompany"
                name="wishCompany"
                placeholder={`챌린지를 신청한 목적과 계기,\n또는 챌린지 참여를 통해 이루고 싶은 목표를 자유롭게 작성해주세요.`}
                className="text-xsmall14 font-normal"
                value={value.goal}
                onChange={handleGoalChange}
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
