import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import axios from '../../../utils/axios';
import ProgramInputContent from '../../../components/admin/program/ui/editor/ProgramInputContent';
import { useMutation, useQuery } from '@tanstack/react-query';
import { newProgramTypeDetailToText } from '../../../utils/convert';

interface AllValue {
  program?: string;
  programType?: string;
  thumbnail?: string;
  title?: string;
  shortDescription?: string;
  headcount?: string;
  way?: string;
  location?: string;
  job?: string;
  mentorName?: string;
  startDate?: string;
  endDate?: string;
  dueDate?: string;
  openKakaoLink?: string;
  openKakaoPassword?: string;
  feeType?: string;
  price?: string;
  discount?: string;
  accountType?: string;
  accountNumber?: string;
  content?: string;
  challengeType?: string;
  participationType?: string;
  basicPrice?: string;
  basicDiscount?: string;
  basicRefund?: string;
  premiumPrice?: string;
  premiumDiscount?: string;
  premiumRefund?: string;
  priceType?: string;
  feeDueDate?: string;
  link?: string;
  beginning?: string;
  faqList?: number[];
}

interface VodClassRequest {
  title?: string;
  shortDesc?: string;
  thumbnail?: string;
  job?: string;
  link?: string;
  programTypeInfo?: {
    classificationInfo?: {
      programClassification?: string;
    };
  }[];
}

interface LiveClassRequest {
  title?: string;
  shortDesc?: string;
  desc?: string;
  participationCount?: number;
  thumbnail?: string;
  mentorName?: string;
  job?: string;
  place?: string;
  startDate?: string;
  endDate?: string;
  deadline?: string;
  beginning?: string;
  progressType?: string;
  programTypeInfo?: {
    classificationInfo?: {
      programClassification?: string;
    };
  }[];
  priceInfo?: {
    priceInfo?: {
      price?: number;
      discount?: number;
      accountNumber?: string;
      deadline?: string;
      accountType?: string;
    };
    livePriceType?: string;
  };
  faqInfo?: { faqId?: number }[];
}

interface ChallengeRequest {
  title?: string;
  shortDesc?: string;
  desc?: string;
  participationCount?: number;
  thumbnail?: string;
  startDate?: string;
  endDate?: string;
  deadline?: string;
  beginning?: string;
  chatLink?: string;
  chatPassword?: string;
  challengeType?: string;
  programTypeInfo?: {
    classificationInfo?: {
      programClassification?: string;
    };
  }[];
  priceInfo?: {
    priceInfo?: {
      price?: number;
      discount?: number;
      accountNumber?: string;
      deadline?: string;
      accountType?: string;
    };
    charge?: number;
    refund?: number;
    challengePriceType?: string;
    challengeUserType?: string;
    challengeParticipationType?: string;
  }[];
  faqInfo?: { faqId?: number }[];
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
  const [value, setValue] = useState<AllValue>({
    faqList: [],
  });
  const [content, setContent] = useState<string>('');
  const [faqList, setFaqList] = useState<any>([]);
  const [faqIdList, setFaqIdList] = useState<any>([]);

  const programType = searchParams.get('programType') || '';
  const programId = Number(params.programId);

  useQuery({
    queryKey: [programType.toLowerCase(), programId],
    queryFn: async () => {
      const res = await axios.get(`/${programType.toLowerCase()}/${programId}`);
      const data = res.data.data;
      console.log(data);
      if (programType === 'CHALLENGE') {
        const priceInfo = data.priceInfo[0];
        const basicPriceInfo = data.priceInfo.filter(
          (price: { challengeUserType: string }) =>
            price.challengeUserType === 'BASIC',
        )[0];
        setValue({
          program: programType,
          programType: data.classificationInfo[0].programClassification,
          challengeType: data.challengeType,
          priceType: priceInfo.challengeUserType,
          participationType: priceInfo.challengeParticipationType,
          thumbnail: data.thumbnail,
          title: data.title,
          shortDescription: data.shortDesc,
          headcount: data.participationCount,
          openKakaoLink: data.chatLink,
          openKakaoPassword: data.chatPassword,
          feeType: priceInfo.challengePriceType,
          basicPrice: basicPriceInfo.price,
          basicDiscount: basicPriceInfo.discount,
          accountType: priceInfo.accountType,
          accountNumber: priceInfo.accountNumber,
          feeDueDate: priceInfo.deadline,
          startDate: data.startDate,
          endDate: data.endDate,
          dueDate: data.deadline,
          beginning: data.beginning,
          faqList: data.faqInfo?.map((faq: { id: number }) => faq.id),
        });
      } else if (programType === 'LIVE') {
        setValue({
          program: programType,
          programType: data.classificationInfo[0].programClassification,
          way: data.place === null ? 'ONLINE' : 'OFFLINE',
          location: data.place,
          job: data.job,
          thumbnail: data.thumbnail,
          title: data.title,
          shortDescription: data.shortDesc,
          headcount: data.participationCount,
          mentorName: data.mentorName,
          feeType: data.priceInfo.livePriceType,
          feeDueDate: data.priceInfo.deadline,
          startDate: data.startDate,
          endDate: data.endDate,
          dueDate: data.deadline,
          beginning: data.beginning,
          price: data.priceInfo.price,
          discount: data.priceInfo.discount,
          accountType: data.priceInfo.accountType,
          accountNumber: data.priceInfo.accountNumber,
          faqList: data.faqInfo?.map((faq: { id: number }) => faq.id),
        });
      } else if (programType === 'VOD') {
        setValue({
          program: programType,
          programType: data.programTypeInfo[0].programClassification,
          job: data.vodInfo.job,
          thumbnail: data.vodInfo.thumbnail,
          title: data.vodInfo.title,
          shortDescription: data.vodInfo.shortDesc,
          link: data.vodInfo.link,
        });
      }
      setContent(data.desc);
      return res.data;
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

  const editVodClass = useMutation({
    mutationFn: async (req: VodClassRequest) => {
      const res = await axios.patch(`/vod/${programId}`, req);
      return res.data;
    },
    onSuccess: () => {
      navigate(-1);
    },
    onError: () => {
      alert('프로그램 수정에 실패했습니다.');
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

  const editLiveClass = useMutation({
    mutationFn: async (req: LiveClassRequest) => {
      const res = await axios.patch(`/live/${programId}`, req);
      return res.data;
    },
    onSuccess: () => {
      navigate(-1);
    },
    onError: () => {
      alert('프로그램 수정에 실패했습니다.');
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

  const editChallenge = useMutation({
    mutationFn: async (req: ChallengeRequest) => {
      const res = await axios.patch(`/challenge/${programId}`, req);
      return res.data;
    },
    onSuccess: () => {
      navigate(-1);
    },
    onError: () => {
      alert('프로그램 수정에 실패했습니다.');
    },
  });

  // useEffect(() => {
  //   if (!programType) return;
  //   const fetchFaqList = async () => {
  //     try {
  //       const res = await axios.get(`/faq/${programType}`);
  //       setFaqList(res.data.faqList);
  //     } catch (err) {
  //       setError(err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchFaqList();
  // }, [programType]);

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
    if (!programType) {
      alert('프로그램 유형을 선택해주세요.');
      return;
    }
    try {
      const res = await axios.post(`/faq/${programType}`, {
        question: '',
        answer: '',
      });
      setFaqList([...faqList, res.data]);
    } catch (err) {
      setError(err);
    }
  };

  const handleFAQDelete = async (faqId: number) => {
    if (!programType) {
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
        link: value.link,
        programTypeInfo: [
          {
            classificationInfo: {
              programClassification: value.programType,
            },
          },
        ],
      };
      if (mode === 'edit') {
        editVodClass.mutate(newValue);
      } else if (mode === 'create') {
        addVodClass.mutate(newValue);
      }
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
        beginning: value.beginning,
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
        faqInfo: value.faqList?.map((faqId: number) => ({ faqId })),
      };
      if (mode === 'edit') {
        editLiveClass.mutate(newValue);
      } else if (mode === 'create') {
        addLiveClass.mutate(newValue);
      }
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
          charge: Number(value.basicPrice) || 0,
          refund: Number(value.basicRefund) || 0,
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
          charge: Number(value.premiumPrice) || 0,
          refund: Number(value.premiumRefund) || 0,
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
        beginning: value.beginning,
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
        faqInfo: value.faqList?.map((faqId: number) => ({ faqId })),
      };
      if (mode === 'edit') {
        editChallenge.mutate(newValue);
      } else if (mode === 'create') {
        addChallenge.mutate(newValue);
      }
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
      value={value}
      content={content}
      faqList={faqList}
      faqIdList={faqIdList}
      setValue={setValue}
      setContent={setContent}
      handleSubmit={handleSubmit}
      handleFAQAdd={handleFAQAdd}
      handleFAQDelete={handleFAQDelete}
      handleFAQChange={handleFAQChange}
      handleFAQCheckChange={handleFAQCheckChange}
      handleFAQIdListReset={handleFAQIdListReset}
      editorMode={mode}
    />
  );
};

export default ProgramEditor;
