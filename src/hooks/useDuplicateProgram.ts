import {
  getChallenge,
  getLive,
  getVod,
  usePostChallengeMutation,
} from '@/api/program';
import { CreateChallengeReq, ProgramAdminListItem } from '@/schema';
import { useCallback } from 'react';

type CreateReqPriceInfo = CreateChallengeReq['priceInfo'][0];

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

  const postLive = usePostChallengeMutation({
    successCallback,
    errorCallback,
  });

  const postVod = usePostChallengeMutation({
    successCallback,
    errorCallback,
  });

  return useCallback(
    async ({
      programInfo: { programType, id },
      classificationList,
    }: ProgramAdminListItem) => {
      switch (programType) {
        case 'CHALLENGE': {
          const challenge = await getChallenge(id);
          await postChallenge.mutateAsync({
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
              (price): CreateReqPriceInfo => ({
                challengeParticipationType:
                  price.challengeParticipationType ?? 'LIVE',
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
            programTypeInfo: classificationList.map((value) => ({
              classificationInfo: {
                programClassification: value.programClassification ?? 'PASS',
              },
            })),
            shortDesc: challenge.shortDesc ?? '',
            startDate: challenge.startDate?.format('YYYY-MM-DDTHH:mm:ss') ?? '',
            deadline: challenge.deadline?.format('YYYY-MM-DDTHH:mm:ss') ?? '',
            thumbnail: challenge.thumbnail ?? '',
          });
          return;
        }

        case 'LIVE': {
          const live = await getLive(id);
          console.log(live);
          return;
        }
        case 'VOD': {
          const vod = await getVod(id);
          console.log(vod);
          return;
        }
        case 'REPORT':
          throw new Error('Not implemented');
      }
    },
    [],
  );
};
