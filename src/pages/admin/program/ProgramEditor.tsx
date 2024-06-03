import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import axios from '../../../utils/axios';
import ProgramInputContent from '../../../components/admin/program/ui/editor/ProgramInputContent';
import { useMutation, useQuery } from '@tanstack/react-query';
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

interface ProgramEditorProps {
  mode: 'create' | 'edit';
}

const ProgramEditor = ({ mode }: ProgramEditorProps) => {
  const navigate = useNavigate();
  const params = useParams();
  const [searchParams] = useSearchParams();

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<unknown>(null);
  const [value, setValue] = useState<any>({});
  const [content, setContent] = useState<any>('');
  const [faqList, setFaqList] = useState<any>([]);
  const [faqIdList, setFaqIdList] = useState<any>([]);

  const programType = searchParams.get('programType') || '';
  const programId = Number(params.programId);

  useQuery({
    queryKey: [programType.toLowerCase(), programId],
    queryFn: async () => {
      try {
        const res = await axios.get(
          `/${programType.toLowerCase()}/${programId}`,
        );
        setValue(res.data.data);
        console.log(res.data.data);
        return res.data;
      } catch (err) {
        setError(err);
      }
    },
    enabled: mode === 'edit',
  });

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
    if (!value.type) return;
    const fetchFaqList = async () => {
      try {
        const res = await axios.get(`/faq/${value.type}`);
        setFaqList(res.data.faqList);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFaqList();
  }, [value.type]);

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
    if (!value.type) {
      alert('프로그램 유형을 선택해주세요.');
      return;
    }
    try {
      const res = await axios.post(`/faq/${value.type}`, {
        question: '',
        answer: '',
      });
      setFaqList([...faqList, res.data]);
    } catch (err) {
      setError(err);
    }
  };

  const handleFAQDelete = async (faqId: number) => {
    if (!value.type) {
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
    if (value.program === 'VOD') {
      const newValue: VodClassRequest = {
        title: value.title,
        shortDesc: value.shortDescription,
        thumbnail: value.thumbnail,
        job: value.job,
        programTypeInfo: [
          {
            classificationInfo: {
              programClassification: value.programType,
            },
          },
        ],
      };
      addVodClass.mutate(newValue);
      return;
    } else if (value.program === 'LIVE') {
      const newValue: LiveClassRequest = {
        title: value.title,
        shortDesc: value.shortDescription,
        desc: content,
        mentorName: value.mentorName,
        participationCount: Number(value.headcount),
        thumbnail: value.thumbnail,
        job: value.job,
        progressType: value.way,
        place: value.location,
        startDate: value.startDate,
        endDate: value.endDate,
        deadline: value.dueDate,
        programTypeInfo: [
          {
            classificationInfo: {
              programClassification: value.programType,
            },
          },
        ],
        priceInfo: {
          priceInfo: {
            price: Number(value.price),
            discount: Number(value.discount),
            accountNumber: value.accountNumber,
            deadline: value.feeDueDate,
            accountType: value.accountType,
          },
          livePriceType: value.feeType,
        },
        faqInfo: [{ faqId: 1 }],
      };
      addLiveClass.mutate(newValue);
      return;
    } else if (value.program === 'CHALLENGE') {
      const newPriceInfo = [];
      if (value.priceType === 'BASIC' || value.priceType === 'ALL') {
        newPriceInfo.push({
          priceInfo: {
            price: Number(value.basicPrice),
            discount: Number(value.basicDiscount),
            accountNumber: value.accountNumber,
            deadline: value.feeDueDate,
            accountType: value.accountType,
          },
          challengePriceType: value.feeType,
          challengeUserType: value.priceType,
          challengeParticipationType: value.participationType,
        });
      }
      if (value.priceType === 'PREMIUM' || value.priceType === 'ALL') {
        newPriceInfo.push({
          priceInfo: {
            price: Number(value.premiumPrice),
            discount: Number(value.premiumDiscount),
            accountNumber: value.accountNumber,
            deadline: value.feeDueDate,
            accountType: value.accountType,
          },
          challengePriceType: value.feeType,
          challengeUserType: value.priceType,
          challengeParticipationType: value.participationType,
        });
      }
      const newValue: ChallengeRequest = {
        title: value.title,
        shortDesc: value.shortDescription,
        desc: content,
        participationCount: Number(value.headcount),
        thumbnail: value.thumbnail,
        startDate: value.startDate,
        endDate: value.endDate,
        deadline: value.dueDate,
        chatLink: value.openKakaoLink,
        chatPassword: value.openKakaoPassword,
        challengeType: value.challengeType,
        programTypeInfo: [
          {
            classificationInfo: {
              programClassification: value.programType,
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
    <ProgramInputContent
      values={value}
      content={content}
      faqList={faqList}
      faqIdList={faqIdList}
      setValues={setValue}
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

export default ProgramEditor;
