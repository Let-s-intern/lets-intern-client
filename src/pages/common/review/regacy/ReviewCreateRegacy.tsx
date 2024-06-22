import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';

import axios from '../../../../utils/axios';
import { typeToText } from '../../../../utils/converTypeToText';
import ReviewHeader from '../../../../components/common/review/regacy/ui/ReviewHeader';
import InputTitle from '../../../../components/common/review/regacy/ui/InputTitle';
import Star from '../../../../components/common/review/regacy/ui/Star';
import TextArea from '../../../../components/common/review/regacy/ui/TextArea';
import AlertModal from '../../../../components/ui/alert/AlertModal';

interface SubmitButtonProps {
  $disabled?: boolean;
}

const ReviewCreateRegacy = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [program, setProgram] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);
  const [values, setValues] = useState<any>({});
  const [isSubmitDisabled, setIsSubmitDisabled] = useState<boolean>(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [successModalOpen, setSuccessModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem('access-token');
      if (!token) {
        setIsLoggedIn(false);
        return;
      }
      try {
        await axios.get('/user');
        setIsLoggedIn(true);
      } catch (err) {
        setIsLoggedIn(false);
      }
    };
    checkLoggedIn();
  }, []);

  useEffect(() => {
    if (values.grade >= 1 && values.reviewContents) {
      setIsSubmitDisabled(false);
    } else {
      setIsSubmitDisabled(true);
    }
  }, [values]);

  useEffect(() => {
    const fetchProgram = async () => {
      if (!params.programId) return;
      setLoading(true);
      try {
        const res = await axios.get(`/program/${params.programId}`, {
          headers: {
            Authorization: isLoggedIn
              ? `Bearer ${localStorage.getItem('access-token')}`
              : '',
          },
        });
        console.log(res.data.programDetailVo);
        setProgram({
          ...res.data.programDetailVo,
          type: typeToText[res.data.type],
        });
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProgram();
  }, [params, isLoggedIn]);

  const handleRatingChange = (value: number) => {
    setValues({ ...values, grade: value });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const handleSubmitButton = async () => {
    const reqData = values;
    try {
      if (isLoggedIn && params.applicationId) {
        await axios.post(`/review/${params.applicationId}`, reqData);
        navigate(`/mypage/review`);
      } else {
        await axios.post(`/review?programId=${params.programId}`, reqData, {
          headers: { Authorization: '' },
        });
        setSuccessModalOpen(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div className="mx-auto w-full max-w-xl px-7">loading</div>;
  }

  if (error) {
    return <div className="mx-auto w-full max-w-xl px-7">error</div>;
  }

  return (
    <div className="mx-auto w-full max-w-xl px-7">
      <ReviewHeader program={program} />
      <hr />
      <section className="py-5">
        <InputTitle>프로그램은 어떠셨나요?</InputTitle>
        <p className="mx-auto mt-2 w-52 break-keep text-center text-zinc-500">
          참여한 프로그램의 만족도를 별점으로 평가해 주세요.
        </p>
        <div className="mt-3 flex justify-center">
          <div className="flex gap-2">
            {Array.from({ length: 5 }, (_, i) => (
              <Star
                key={i}
                onClick={() => handleRatingChange(i + 1)}
                isActive={values.grade > i}
              />
            ))}
          </div>
        </div>
      </section>
      <hr />
      <section className="py-7">
        <InputTitle>전반적인 후기를 남겨주세요.</InputTitle>
        <TextArea
          placeholder="후기를 여기에 작성해주세요."
          name="reviewContents"
          value={values.reviewContents}
          onChange={handleInputChange}
        />
      </section>
      <hr />
      <section className="py-7">
        <InputTitle>그 외 바라는 점이 있다면 작성해주세요.</InputTitle>
        <TextArea
          placeholder="바라는 점을 여기에 작성해주세요.(선택)"
          name="suggestContents"
          value={values.suggestContents}
          onChange={handleInputChange}
        />
      </section>
      <div className="h-14 sm:h-20" />
      <div className="fixed bottom-0 left-0 flex w-screen justify-center sm:bottom-3">
        <SubmitButton $disabled={isSubmitDisabled} onClick={handleSubmitButton}>
          등록하기
        </SubmitButton>
      </div>
      {successModalOpen && (
        <AlertModal
          onConfirm={() => {
            setSuccessModalOpen(false);
            navigate('/');
          }}
          title="후기 작성 완료"
          showCancel={false}
          highlight="confirm"
          confirmText="확인"
        >
          후기가 성공적으로 동록되었습니다.
          <br />
          메인 화면으로 이동합니다.
        </AlertModal>
      )}
    </div>
  );
};

export default ReviewCreateRegacy;

const SubmitButton = styled.button<SubmitButtonProps>`
  height: 3.5rem;
  width: 100%;
  background-color: ${({ $disabled }) => ($disabled ? '#a5a1fa' : '#6963F6')};
  color: #ffffff;
  cursor: ${({ $disabled }) => ($disabled ? 'auto' : 'pointer')};

  @media (min-width: 640px) {
    max-width: 36rem;
    border-radius: 4px;
  }
`;
