import { pageInfo } from '@/schema';
import { IPageable } from '@/types/interface';
import axios from '@/utils/axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

const leadHistoryEventTypeSchema = z.enum(['SIGN_UP', 'PROGRAM', 'LEAD_EVENT']);

export type LeadHistoryEventType = z.infer<typeof leadHistoryEventTypeSchema>;

const leadHistoryItemSchema = z.object({
  eventType: leadHistoryEventTypeSchema.optional(),
  leadEventId: z.number().nullable().optional(),
  leadEventType: z.string().nullable().optional(),
  userId: z.number().nullable().optional(),
  title: z.string().nullable().optional(),
  name: z.string().nullable().optional(),
  phoneNum: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  wishField: z.string().nullable().optional(),
  wishCompany: z.string().nullable().optional(),
  wishIndustry: z.string().nullable().optional(),
  wishJob: z.string().nullable().optional(),
  university: z.string().nullable().optional(),
  major: z.string().nullable().optional(),
  jobStatus: z.string().nullable().optional(),
  inflow: z.string().nullable().optional(),
  instagramId: z.string().nullable().optional(),
  marketingAgree: z.boolean().nullable().optional(),
  finalPrice: z.number().nullable().optional(),
  createDate: z.string().nullable().optional(),
});

const leadHistoryListSchema = z.object({
  leadHistoryList: z.array(leadHistoryItemSchema),
  pageInfo,
});

const leadEventItemSchema = z.object({
  leadEventId: z.number(),
  title: z.string().nullable().optional(),
  type: z.string().nullable().optional(),
  createDate: z.string().nullable().optional(),
});

const leadEventListSchema = z.object({
  leadEventList: z.array(leadEventItemSchema),
  pageInfo,
});

const joinParam = (value?: Array<string | number>) =>
  value && value.length ? value.map(String).join(',') : undefined;

export type LeadHistory = z.infer<typeof leadHistoryItemSchema>;
export type LeadEvent = z.infer<typeof leadEventItemSchema>;
export type LeadHistoryListResponse = z.infer<typeof leadHistoryListSchema>;
export type LeadEventListResponse = z.infer<typeof leadEventListSchema>;

export const leadHistoryListQueryKey = 'leadHistoryListQueryKey';
export const leadEventListQueryKey = 'leadEventListQueryKey';

export type LeadHistoryFilters = {
  eventTypeList?: LeadHistoryEventType[];
  leadEventIdList?: number[];
  leadEventTypeList?: string[];
  nameList?: string[];
  phoneNumList?: string[];
};

export type LeadHistoryListParams = LeadHistoryFilters & {
  pageSize?: number;
};

export const useLeadHistoryListQuery = (
  params: LeadHistoryListParams = {},
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: [leadHistoryListQueryKey, params],
    enabled: options?.enabled ?? true,
    queryFn: async () => {
      const { pageSize = 1000, ...rest } = params;

      const leadHistoryList: LeadHistory[] = [];
      let page = 1;
      let totalPages = 1;

      while (page <= totalPages) {
        const res = await axios.get('/admin/lead-history', {
          params: {
            page,
            size: pageSize,
            eventTypeList: joinParam(rest.eventTypeList),
            leadEventIdList: joinParam(rest.leadEventIdList),
            leadEventTypeList: joinParam(rest.leadEventTypeList),
            nameList: joinParam(rest.nameList),
            phoneNumList: joinParam(rest.phoneNumList),
          },
        });

        const parsed = leadHistoryListSchema.parse(res.data.data);
        leadHistoryList.push(...parsed.leadHistoryList);

        totalPages = Math.max(parsed.pageInfo.totalPages, 1);
        if (!parsed.leadHistoryList.length) {
          break;
        }

        page += 1;
      }

      return leadHistoryList;
    },
  });
};

export type CreateLeadHistoryRequest = {
  leadEventId: number;
  userId?: number;
  name?: string;
  phoneNum?: string;
  email?: string;
  inflow?: string;
  university?: string;
  major?: string;
  wishField?: string;
  wishCompany?: string;
  wishIndustry?: string;
  wishJob?: string;
  jobStatus?: string;
  instagramId?: string;
};

export const useCreateLeadHistoryMutation = () => {
  const client = useQueryClient();

  return useMutation({
    mutationFn: async (body: CreateLeadHistoryRequest) => {
      return axios.post('/admin/lead-history', body);
    },
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: [leadHistoryListQueryKey] });
    },
    onError: (error) => console.error('useCreateLeadHistoryMutation >>', error),
  });
};

export type LeadEventListParams = {
  pageable: IPageable;
  leadEventIdList?: number[];
  typeList?: string[];
  titleKeyword?: string;
};

export const useLeadEventListQuery = (
  params: LeadEventListParams,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: [leadEventListQueryKey, params],
    enabled: options?.enabled ?? true,
    queryFn: async () => {
      const { pageable, ...rest } = params;
      const res = await axios.get('/admin/lead-event', {
        params: {
          page: pageable.page,
          size: pageable.size,
          leadEventIdList: joinParam(rest.leadEventIdList),
          typeList: joinParam(rest.typeList),
          titleKeyword: rest.titleKeyword,
        },
      });

      return leadEventListSchema.parse(res.data.data);
    },
  });
};

export type CreateLeadEventRequest = {
  type?: string;
  title?: string;
};

export const useDeleteLeadEventMutation = () => {
  const client = useQueryClient();

  return useMutation({
    mutationFn: async (leadEventId: number) => {
      return axios.delete(`/admin/lead-event/${leadEventId}`);
    },
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: [leadEventListQueryKey] });
    },
    onError: (error) => console.error('useDeleteLeadEventMutation >>', error),
  });
};

export const useCreateLeadEventMutation = () => {
  const client = useQueryClient();

  return useMutation({
    mutationFn: async (body: CreateLeadEventRequest) => {
      return axios.post('/admin/lead-event', body);
    },
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: [leadEventListQueryKey] });
    },
    onError: (error) => console.error('useCreateLeadEventMutation >>', error),
  });
};
