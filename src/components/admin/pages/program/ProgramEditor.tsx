'use client';

import ProgramInputContent from '@/components/admin/program/ui/editor/ProgramInputContent';
import axios from '@/utils/axios';
import { generateRandomString } from '@/utils/random';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

interface AllValue {
  program?: string;
  programType?: string[];
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
  criticalNotice?: string;
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
  criticalNotice?: string;
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
  beginning?: string;
  deadline?: string;
  chatLink?: string;
  chatPassword?: string;
  challengeType?: string;
  criticalNotice?: string;
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
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<unknown>(null);
  const [value, setValue] = useState<AllValue>({
    faqList: [],
  });
  const [content, setContent] = useState<string>('');

  const programType = searchParams.get('programType') || '';
  const programId = Number(params.programId);

  useQuery({
    queryKey: [programType.toLowerCase(), programId],
    queryFn: async () => {
      const res = await axios.get(`/${programType.toLowerCase()}/${programId}`);
      const data = res.data.data;
      if (programType === 'CHALLENGE') {
        const priceInfo = data.priceInfo[0];
        const basicPriceInfo = data.priceInfo.filter(
          (price: { challengeUserType: string }) =>
            price.challengeUserType === 'BASIC',
        )[0];
        const premiumPriceInfo = data.priceInfo.filter(
          (price: { challengeUserType: string }) =>
            price.challengeUserType === 'PREMIUM',
        )[0];
        setValue({
          program: programType,
          programType: data.classificationInfo.map(
            (info: { programClassification: string }) =>
              info.programClassification,
          ),
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
          basicPrice: basicPriceInfo?.price,
          basicRefund: basicPriceInfo?.refund,
          basicDiscount: basicPriceInfo?.discount,
          premiumPrice: premiumPriceInfo?.price,
          premiumDiscount: premiumPriceInfo?.discount,
          premiumRefund: premiumPriceInfo?.refund,
          accountType: priceInfo.accountType,
          accountNumber: priceInfo.accountNumber,
          feeDueDate: priceInfo.deadline,
          startDate: data.startDate,
          endDate: data.endDate,
          dueDate: data.deadline,
          beginning: data.beginning,
          faqList: data.faqInfo?.map((faq: { id: number }) => faq.id),
          criticalNotice: data.criticalNotice,
        });
      } else if (programType === 'LIVE') {
        setValue({
          program: programType,
          programType: data.classificationInfo.map(
            (info: { programClassification: string }) =>
              info.programClassification,
          ),
          way: data.progressType ?? 'OFFLINE',
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
          criticalNotice: data.criticalNotice,
        });
      } else if (programType === 'VOD') {
        setValue({
          program: programType,
          programType: data.programTypeInfo.map(
            (info: { programClassification: string }) =>
              info.programClassification,
          ),
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
      router.push('/admin/programs');
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
      router.back();
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
      router.push('/admin/programs');
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
      router.back();
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
      router.push('/admin/programs');
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
      router.back();
    },
    onError: () => {
      alert('프로그램 수정에 실패했습니다.');
    },
  });

  const uploadImage = useMutation({
    mutationFn: async (params: { formData: FormData; type: string }) => {
      const res = await axios.post('/file', params.formData, {
        params: {
          type: params.type,
        },
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return res.data;
    },
    onSuccess: (data) => {
      setValue({
        ...value,
        thumbnail: data.data.fileUrl,
      });
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && value.program) {
      const formData = new FormData();
      formData.append(
        'file',
        e.target.files[0],
        `${generateRandomString(10)}_${e.target.files[0].name}`,
      );
      uploadImage.mutate({ formData, type: value.program });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (value.program === 'VOD') {
      const newValue: VodClassRequest = {
        title: value.title,
        shortDesc: value.shortDescription,
        thumbnail: value.thumbnail,
        job: value.job,
        link: value.link,
        programTypeInfo:
          value.programType?.map((type) => ({
            classificationInfo: {
              programClassification: type,
            },
          })) || [],
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
        criticalNotice: value.criticalNotice,
        programTypeInfo:
          value.programType?.map((type) => ({
            classificationInfo: {
              programClassification: type,
            },
          })) || [],
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
        criticalNotice: value.criticalNotice,
        programTypeInfo:
          value.programType?.map((type) => ({
            classificationInfo: {
              programClassification: type,
            },
          })) || [],
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

  if (loading) {
    return <div className="mx-auto max-w-xl">로딩중</div>;
  }

  if (error) {
    return <div className="mx-auto max-w-xl">에러 발생</div>;
  }

  return (
    <ProgramInputContent
      value={value}
      content={content}
      setValue={setValue}
      setContent={setContent}
      handleSubmit={handleSubmit}
      editorMode={mode}
      handleImageUpload={handleImageUpload}
    />
  );
};

export default ProgramEditor;
