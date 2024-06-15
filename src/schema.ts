import dayjs from 'dayjs';
import { z } from 'zod';

const pageinfo = z.object({
  pageNum: z.number().gte(0),
  pageSize: z.number().gte(0),
  totalElements: z.number().gte(0),
  totalPages: z.number().gte(0),
});

export const getChallenge = z
  .object({
    programList: z.array(
      z.object({
        id: z.number(),
        title: z.string(),
        shortDesc: z.string(),
        thumbnail: z.string().url(),
        startDate: z.string(),
        endDate: z.string(),
        beginning: z.string(),
        deadline: z.string(),
        createDate: z.string(),
      }),
    ),
    pageInfo: pageinfo,
  })
  .transform((data) => {
    return {
      programList: data.programList.map((program) => ({
        ...program,
        startDate: dayjs(program.startDate),
        endDate: dayjs(program.endDate),
        beginning: dayjs(program.beginning),
        deadline: dayjs(program.deadline),
        createDate: dayjs(program.createDate),
      })),
      pageInfo: data.pageInfo,
    };
  });

export const challengeType = z.union([
  z.literal('CAREER_START'),
  z.literal('DOCUMENT_PREPARATION'),
  z.literal('MEETING_PREPARATION'),
  z.literal('ETC'),
]);

export const programClassification = z.union([
  z.literal('CAREER_SEARCH'),
  z.literal('DOCUMENT_PREPARATION'),
  z.literal('MEETING_PREPARATION'),
  z.literal('PASS'),
]);

export const challengePriceType = z.union([
  z.literal('CHARGE'),
  z.literal('REFUND'),
]);

export const challengeUserType = z.union([
  z.literal('BASIC'),
  z.literal('PREMIUM'),
]);

export const challengeParticipationType = z.union([
  z.literal('LIVE'),
  z.literal('FREE'),
]);

export const faqProgramType = z.union([
  z.literal('CHALLENGE'),
  z.literal('LIVE'),
  z.literal('VOD'),
]);

export const accountType = z.union([
  z.literal('KB'),
  z.literal('HANA'),
  z.literal('WOORI'),
  z.literal('SHINHAN'),
  z.literal('NH'),
  z.literal('SH'),
  z.literal('IBK'),
  z.literal('MG'),
  z.literal('KAKAO'),
  z.literal('TOSS'),
]);

  
export const getChallengeId = z
  .object({
    title: z.string(),
    shortDesc: z.string(),
    desc: z.string(),
    participationCount: z.number(),
    thumbnail: z.string().url(),
    startDate: z.string(),
    endDate: z.string(),
    beginning: z.string(),
    deadline: z.string(),
    chatLink: z.string(),
    chatPassword: z.string(),
    challengeType: challengeType,
    classificationInfo: z.array(
      z.object({
        programClassification: programClassification,
      }),
    ),
    priceInfo: z.array(
      z.object({
        priceId: z.number(),
        price: z.number(),
        discount: z.number(),
        accountNumber: z.string(),
        deadline: z.string(),
        accountType: accountType,
        challengePriceType: challengePriceType,
        challengeUserType: challengeUserType,
        challengeParticipationType: challengeParticipationType,
      }),
    ),
    faqInfo: z.array(
      z.object({
        id: z.number(),
        question: z.string(),
        answer: z.string(),
        faqProgramType: faqProgramType,
      }),
    ),
  })
  .transform((data) => {
    return {
      ...data,
      startDate: dayjs(data.startDate),
      endDate: dayjs(data.endDate),
      beginning: dayjs(data.beginning),
      deadline: dayjs(data.deadline),
      priceInfo: data.priceInfo.map((price) => ({
        ...price,
        deadline: dayjs(price.deadline),
      })),
    };
  });
