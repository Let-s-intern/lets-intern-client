import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import axios from '../../../utils/axios';
import ProgramEditor from '../../../components/admin/program/ui/editor/ProgramEditor';
import { useMutation } from '@tanstack/react-query';
import { newProgramTypeDetailToText } from '../../../utils/convert';

interface VodClassRequest {
  title: string;
  shortDesc: string;
  thumbnail: string;
  job: string;
  programTypeInfo: {
    classificationInfo: {
      programClassification: keyof typeof newProgramTypeDetailToText;
    };
  }[];
}

interface LiveClassRequest {
  title: string;
  shortDesc: string;
  desc: string;
  participationCount: number;
  thumbnail: string;
  mentorName: string;
  job: string;
  place: string;
  startDate: string;
  endDate: string;
  deadline: string;
  progressType: string;
  programTypeInfo: {
    classificationInfo: {
      programClassification: string;
    };
  }[];
  priceInfo: {
    priceInfo: {
      price: number;
      discount: number;
      accountNumber: string;
      deadline: string;
      accountType: string;
    };
    livePriceType: string;
  };
  faqInfo: { faqId: number }[];
}

interface ChallengeRequest {
  title: string;
  shortDesc: string;
  desc: string;
  participationCount: number;
  thumbnail: string;
  startDate: string;
  endDate: string;
  deadline: string;
  chatLink: string;
  chatPassword: string;
  challengeType: string;
  programTypeInfo: {
    classificationInfo: {
      programClassification: string;
    };
  }[];
  priceInfo: {
    priceInfo: {
      price: number;
      discount: number;
      accountNumber: string;
      deadline: string;
      accountType: string;
    };
    challengePriceType: string;
    challengeUserType: string;
    challengeParticipationType: string;
  }[];
  faqInfo: { faqId: number }[];
}

const ProgramCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<unknown>(null);
  const [values, setValues] = useState<any>({});
  const [content, setContent] = useState<any>('');
  const [faqList, setFaqList] = useState<any>([]);
  const [faqIdList, setFaqIdList] = useState<any>([]);

  const addVodClass = useMutation({
    mutationFn: async (req: VodClassRequest) => {
      const res = await axios.post('/vod', req);
      return res.data;
    },
    onSuccess: () => {
      navigate('/admin/programs');
    },
    onError: () => {
      alert('프로그램 생성에 실패했습니다.');
    },
  });

  const addLiveClass = useMutation({
    mutationFn: async (req: LiveClassRequest) => {
      const res = await axios.post('/live', req);
      return res.data;
    },
    onSuccess: () => {
      navigate('/admin/programs');
    },
    onError: () => {
      alert('프로그램 생성에 실패했습니다.');
    },
  });

  const addChallenge = useMutation({
    mutationFn: async (req: ChallengeRequest) => {
      const res = await axios.post('/challenge', req);
      return res.data;
    },
    onSuccess: () => {
      navigate('/admin/programs');
    },
    onError: () => {
      alert('프로그램 생성에 실패했습니다.');
    },
  });

  useEffect(() => {
    if (!values.type) return;
    const fetchFaqList = async () => {
      try {
        const res = await axios.get(`/faq/${values.type}`);
        setFaqList(res.data.faqList);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFaqList();
  }, [values.type]);

  useEffect(() => {
    if (!faqList) return;
    const newFaqIdList: number[] = [];
    const originFaqIdList = faqList.map((faq: any) => faq.id);
    for (let faqId of faqIdList) {
      if (originFaqIdList.includes(faqId)) {
        newFaqIdList.push(faqId);
      }
    }
    newFaqIdList.sort();
  }, [faqList, faqIdList]);

  const handleFAQChange = (e: any, faqId: number) => {
    const { name, value } = e.target;
    console.log(name, value);
    setFaqList(
      faqList.map((faq: any) => {
        if (faq.id === faqId) {
          return {
            ...faq,
            [name]: value,
          };
        }
        return faq;
      }),
    );
  };

  const handleFAQAdd = async () => {
    if (!values.type) {
      alert('프로그램 유형을 선택해주세요.');
      return;
    }
    try {
      const res = await axios.post(`/faq/${values.type}`, {
        question: '',
        answer: '',
      });
      setFaqList([...faqList, res.data]);
    } catch (err) {
      setError(err);
    }
  };

  const handleFAQDelete = async (faqId: number) => {
    if (!values.type) {
      alert('프로그램 유형을 선택해주세요.');
      return;
    }
    try {
      await axios.delete(`/faq/${faqId}`);
      setFaqList(faqList.filter((faq: any) => faq.id !== faqId));
      setFaqIdList(faqIdList.filter((id: number) => id !== faqId));
    } catch (err) {
      setError(err);
    }
  };

  const handleFAQCheckChange = (e: any, faqId: number) => {
    if (e.target.checked) {
      setFaqIdList([...faqIdList, faqId]);
    } else {
      setFaqIdList(faqIdList.filter((id: number) => id !== faqId));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // if (!values.type) {
    //   alert('프로그램 유형을 선택해주세요.');
    //   return;
    // }
    // if (faqIdList.length === 0 || !faqIdList) {
    //   alert('FAQ를 하나 이상 선택해주세요.');
    //   return;
    // }
    if (values.program === 'VOD') {
      const newValue: VodClassRequest = {
        title: values.title,
        shortDesc: values.shortDescription,
        thumbnail: values.thumbnail,
        job: values.job,
        programTypeInfo: [
          {
            classificationInfo: {
              programClassification: values.programType,
            },
          },
        ],
      };
      addVodClass.mutate(newValue);
      return;
    } else if (values.program === 'LIVE') {
      const newValue: LiveClassRequest = {
        title: values.title,
        shortDesc: values.shortDescription,
        desc: content,
        mentorName: values.mentorName,
        participationCount: Number(values.headcount),
        thumbnail: values.thumbnail,
        job: values.job,
        progressType: values.way,
        place: values.location,
        startDate: values.startDate,
        endDate: values.endDate,
        deadline: values.dueDate,
        programTypeInfo: [
          {
            classificationInfo: {
              programClassification: values.programType,
            },
          },
        ],
        priceInfo: {
          priceInfo: {
            price: Number(values.price),
            discount: Number(values.discount),
            accountNumber: values.accountNumber,
            deadline: values.feeDueDate,
            accountType: values.accountType,
          },
          livePriceType: values.feeType,
        },
        faqInfo: [{ faqId: 1 }],
      };
      addLiveClass.mutate(newValue);
      return;
    } else if (values.program === 'CHALLENGE') {
      const newPriceInfo = [];
      if (values.priceType === 'BASIC' || values.priceType === 'ALL') {
        newPriceInfo.push({
          priceInfo: {
            price: Number(values.basicPrice),
            discount: Number(values.basicDiscount),
            accountNumber: values.accountNumber,
            deadline: values.feeDueDate,
            accountType: values.accountType,
          },
          challengePriceType: values.feeType,
          challengeUserType: values.priceType,
          challengeParticipationType: values.participationType,
        });
      }
      if (values.priceType === 'PREMIUM' || values.priceType === 'ALL') {
        newPriceInfo.push({
          priceInfo: {
            price: Number(values.premiumPrice),
            discount: Number(values.premiumDiscount),
            accountNumber: values.accountNumber,
            deadline: values.feeDueDate,
            accountType: values.accountType,
          },
          challengePriceType: values.feeType,
          challengeUserType: values.priceType,
          challengeParticipationType: values.participationType,
        });
      }
      const newValue: ChallengeRequest = {
        title: values.title,
        shortDesc: values.shortDescription,
        desc: content,
        participationCount: Number(values.headcount),
        thumbnail: values.thumbnail,
        startDate: values.startDate,
        endDate: values.endDate,
        deadline: values.dueDate,
        chatLink: values.openKakaoLink,
        chatPassword: values.openKakaoPassword,
        challengeType: values.challengeType,
        programTypeInfo: [
          {
            classificationInfo: {
              programClassification: values.programType,
            },
          },
        ],
        priceInfo: newPriceInfo,
        faqInfo: [{ faqId: 1 }],
      };
      addChallenge.mutate(newValue);
      return;
    }
  };

  const handleFAQIdListReset = () => {
    setFaqIdList([]);
  };

  if (loading) {
    return <div className="mx-auto max-w-xl font-notosans">로딩중</div>;
  }

  if (error) {
    return <div className="mx-auto max-w-xl font-notosans">에러 발생</div>;
  }

  return (
    <ProgramEditor
      values={values}
      content={content}
      faqList={faqList}
      faqIdList={faqIdList}
      setValues={setValues}
      setContent={setContent}
      handleSubmit={handleSubmit}
      handleFAQAdd={handleFAQAdd}
      handleFAQDelete={handleFAQDelete}
      handleFAQChange={handleFAQChange}
      handleFAQCheckChange={handleFAQCheckChange}
      handleFAQIdListReset={handleFAQIdListReset}
      editorMode="create"
    />
  );
};

export default ProgramCreate;
