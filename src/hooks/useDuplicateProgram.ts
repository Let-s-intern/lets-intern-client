import {
  getChallenge,
  getLive,
  getVod,
  usePostChallengeMutation,
  usePostLiveMutation,
  usePostVodMutation,
} from '@/api/program';
import {
  ChallengeIdSchema,
  CreateChallengeReq,
  CreateLiveReq,
  LiveIdSchema,
  ProgramAdminListItem
} from '@/schema';
import { useCallback } from 'react';

type CreateChallengeReqPriceInfo = CreateChallengeReq['priceInfo'][0];

export const challengeToCreateInput = (
  challenge: ChallengeIdSchema,
): CreateChallengeReq => {
  return {
    challengeType: challenge.challengeType,
    title: challenge.title + ' - 사본',
    beginning: challenge.beginning?.format('YYYY-MM-DDTHH:mm:ss') ?? '',
    chatLink: '',
    chatPassword: '',
    criticalNotice: challenge.criticalNotice ?? '',
    desc: challenge.desc ?? '',
    endDate: challenge.endDate?.format('YYYY-MM-DDTHH:mm:ss') ?? '',
    faqInfo: challenge.faqInfo.map((faq) => ({ faqId: faq.id })),
    participationCount: challenge.participationCount ?? 0,
    priceInfo: challenge.priceInfo.map(
      (price): CreateChallengeReqPriceInfo => ({
        challengeParticipationType: price.challengeParticipationType ?? 'LIVE',
        challengePriceType: price.challengePriceType ?? 'CHARGE',
        challengeUserType: price.challengeUserType ?? 'BASIC',
        charge: price.price ?? 0,
        priceInfo: {
          price: price.price ?? 0,
          discount: price.discount ?? 0,
        },
        refund: 0,
      }),
    ),
    programTypeInfo: challenge.classificationInfo.map((value) => ({
      classificationInfo: {
        programClassification: value.programClassification ?? 'PASS',
      },
    })),
    adminProgramTypeInfo: challenge.adminClassificationInfo ?  challenge.adminClassificationInfo.map((value) => ({
      classificationInfo: {
        programAdminClassification: value.programAdminClassification,
      },
    })) : [],
    shortDesc: challenge.shortDesc ?? '',
    startDate: challenge.startDate?.format('YYYY-MM-DDTHH:mm:ss') ?? '',
    deadline: challenge.deadline?.format('YYYY-MM-DDTHH:mm:ss') ?? '',
    thumbnail: challenge.thumbnail ?? '',
  };
};

export const liveToCreateInput = (live: LiveIdSchema): CreateLiveReq => {
  return {
    title: live.title + ' - 사본',
    beginning: live.beginning?.format('YYYY-MM-DDTHH:mm:ss') ?? '',
    criticalNotice: live.criticalNotice ?? '',
    desc: live.desc ?? '',
    endDate: live.endDate?.format('YYYY-MM-DDTHH:mm:ss') ?? '',
    faqInfo: live.faqInfo.map((faq) => ({ faqId: faq.id })),
    participationCount: live.participationCount ?? 0,
    priceInfo: {
      livePriceType: live.priceInfo.livePriceType ?? 'CHARGE',
      priceInfo: {
        price: live.priceInfo.price ?? 0,
        discount: live.priceInfo.discount ?? 0,
      },
    },
    programTypeInfo: live.classificationInfo.map((value) => ({
      classificationInfo: {
        programClassification: value.programClassification ?? 'PASS',
      },
    })),
    adminProgramTypeInfo: live.adminClassificationInfo? live.adminClassificationInfo.map((value) => ({
      classificationInfo: {
        programAdminClassification: value.programAdminClassification,
      },
    })):[],
    shortDesc: live.shortDesc ?? '',
    startDate: live.startDate?.format('YYYY-MM-DDTHH:mm:ss') ?? '',
    deadline: live.deadline?.format('YYYY-MM-DDTHH:mm:ss') ?? '',
    thumbnail: live.thumbnail ?? '',
    job: live.job ?? '',
    mentorName: live.mentorName ?? '',
    place: live.place ?? '',
    progressType: live.progressType ?? 'ONLINE',
    mentorCareer: live.mentorCareer ?? '',
    mentorCompany: live.mentorCompany ?? '',
    mentorImg: live.mentorImg ?? '',
    mentorIntroduction: live.mentorIntroduction ?? '',
    mentorJob: live.mentorJob ?? '',
    vod: live.vod ?? false,
  };
};

export const useDuplicateProgram = ({
  errorCallback,
  successCallback,
}: {
  successCallback?: () => void;
  errorCallback?: (error: Error) => void;
} = {}) => {
  const postChallenge = usePostChallengeMutation({
    successCallback,
    errorCallback,
  });

  const postLive = usePostLiveMutation({
    successCallback,
    errorCallback,
  });

  const postVod = usePostVodMutation({
    successCallback,
    errorCallback,
  });

  return useCallback(
    async ({
      programInfo: { programType, id },
      classificationList,
      adminClassificationList,
    }: ProgramAdminListItem) => {
      switch (programType) {
        case 'CHALLENGE': {
          const challenge = await getChallenge(id);
          await postChallenge.mutateAsync(challengeToCreateInput(challenge));
          return;
        }

        case 'LIVE': {
          const live = await getLive(id);
          await postLive.mutateAsync(liveToCreateInput(live));
          return;
        }
        case 'VOD': {
          const vod = await getVod(id);
          await postVod.mutateAsync({
            title: vod.vodInfo.title + ' - 사본',
            job: vod.vodInfo.job ?? '',
            link: vod.vodInfo.link ?? '',
            programTypeInfo: classificationList.map((value) => ({
              classificationInfo: {
                programClassification: value.programClassification ?? 'PASS',
              },
            })),
            adminProgramTypeInfo: adminClassificationList ? adminClassificationList.map((value) => ({
              classificationInfo: {
                programAdminClassification: value.programAdminClassification ,
              },
            })):[],
            thumbnail: vod.vodInfo.thumbnail ?? '',
            shortDesc: vod.vodInfo.shortDesc ?? '',
          });
          return;
        }
        case 'REPORT':
          throw new Error('Not implemented');
      }
    },
    [postChallenge, postLive, postVod],
  );
};
