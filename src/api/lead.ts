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

/** lead api
 * 
 * {
  "openapi": "3.0.1",
  "info": {
    "title": "Lets career API",
    "version": "1.0.0"
  },
  "servers": [
    {
      "url": "/"
    }
  ],
  "security": [
    {
      "JWT": []
    }
  ],
  "paths": {
    "/api/v1/admin/lead-history": {
      "get": {
        "tags": [
          "lead-history-v-1-admin-controller"
        ],
        "summary": "리드 히스토리 목록 조회",
        "operationId": "getLeadHistoryList",
        "parameters": [
          {
            "name": "eventTypeList",
            "in": "query",
            "required": false,
            "schema": {
              "type": "array",
              "items": {
                "type": "string",
                "enum": [
                  "SIGN_UP",
                  "PROGRAM",
                  "LEAD_EVENT"
                ]
              }
            }
          },
          {
            "name": "leadEventIdList",
            "in": "query",
            "required": false,
            "schema": {
              "type": "array",
              "items": {
                "type": "integer",
                "format": "int64"
              }
            }
          },
          {
            "name": "leadEventTypeList",
            "in": "query",
            "required": false,
            "schema": {
              "type": "array",
              "items": {
                "type": "string"
              }
            }
          },
          {
            "name": "nameList",
            "in": "query",
            "required": false,
            "schema": {
              "type": "array",
              "items": {
                "type": "string"
              }
            }
          },
          {
            "name": "phoneNumList",
            "in": "query",
            "required": false,
            "schema": {
              "type": "array",
              "items": {
                "type": "string"
              }
            }
          },
          {
            "name": "pageable",
            "in": "query",
            "required": true,
            "schema": {
              "$ref": "#/components/schemas/Pageable"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/GetLeadHistoryListResponseDto"
                }
              }
            }
          }
        }
      },
      "post": {
        "tags": [
          "lead-history-v-1-admin-controller"
        ],
        "summary": "리드 히스토리 생성",
        "operationId": "createLeadEvent",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/CreateLeadHistoryRequestDto"
              }
            }
          },
          "required": true
        },
        "responses": {
          "201": {
            "description": "Created",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/SuccessResponseObject"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/admin/lead-event": {
      "get": {
        "tags": [
          "lead-event-v-1-admin-controller"
        ],
        "summary": "리드 이벤트 목록 조회",
        "operationId": "getLeadEventList",
        "parameters": [
          {
            "name": "leadEventIdList",
            "in": "query",
            "required": false,
            "schema": {
              "type": "array",
              "items": {
                "type": "integer",
                "format": "int64"
              }
            }
          },
          {
            "name": "typeList",
            "in": "query",
            "required": false,
            "schema": {
              "type": "array",
              "items": {
                "type": "string"
              }
            }
          },
          {
            "name": "titleKeyword",
            "in": "query",
            "required": false,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "pageable",
            "in": "query",
            "required": true,
            "schema": {
              "$ref": "#/components/schemas/Pageable"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/GetLeadEventListResponseDto"
                }
              }
            }
          }
        }
      },
      "post": {
        "tags": [
          "lead-event-v-1-admin-controller"
        ],
        "summary": "리드 이벤트 생성",
        "operationId": "createLeadEvent_1",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/CreateLeadEventRequestDto"
              }
            }
          },
          "required": true
        },
        "responses": {
          "201": {
            "description": "Created",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/SuccessResponseObject"
                }
              }
            }
          }
        }
      }
    }
  },
  "components": {
    "schemas": {
      
      "CreateLeadHistoryRequestDto": {
        "required": [
          "leadEventId"
        ],
        "type": "object",
        "properties": {
          "leadEventId": {
            "type": "integer",
            "format": "int64"
          },
          "userId": {
            "type": "integer",
            "format": "int64"
          },
          "name": {
            "type": "string"
          },
          "phoneNum": {
            "type": "string"
          },
          "email": {
            "type": "string"
          },
          "inflow": {
            "type": "string"
          },
          "university": {
            "type": "string"
          },
          "major": {
            "type": "string"
          },
          "wishField": {
            "type": "string"
          },
          "wishCompany": {
            "type": "string"
          },
          "wishIndustry": {
            "type": "string"
          },
          "wishJob": {
            "type": "string"
          },
          "jobStatus": {
            "type": "string"
          },
          "instagramId": {
            "type": "string"
          }
        }
      },
      "CreateLeadEventRequestDto": {
        "type": "object",
        "properties": {
          "type": {
            "type": "string"
          },
          "title": {
            "type": "string"
          }
        }
      },
      
      "GetLeadHistoryListResponseDto": {
        "type": "object",
        "properties": {
          "leadHistoryList": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/LeadHistoryVo"
            }
          },
          "pageInfo": {
            "$ref": "#/components/schemas/PageInfo"
          }
        }
      },
      "LeadHistoryVo": {
        "type": "object",
        "properties": {
          "eventType": {
            "type": "string",
            "enum": [
              "SIGN_UP",
              "PROGRAM",
              "LEAD_EVENT"
            ]
          },
          "leadEventId": {
            "type": "integer",
            "format": "int64"
          },
          "userId": {
            "type": "integer",
            "format": "int64"
          },
          "title": {
            "type": "string"
          },
          "name": {
            "type": "string"
          },
          "phoneNum": {
            "type": "string"
          },
          "email": {
            "type": "string"
          },
          "wishField": {
            "type": "string"
          },
          "wishCompany": {
            "type": "string"
          },
          "wishIndustry": {
            "type": "string"
          },
          "wishJob": {
            "type": "string"
          },
          "university": {
            "type": "string"
          },
          "major": {
            "type": "string"
          },
          "jobStatus": {
            "type": "string"
          },
          "inflow": {
            "type": "string"
          },
          "instagramId": {
            "type": "string"
          },
          "finalPrice": {
            "type": "integer",
            "format": "int32"
          },
          "createDate": {
            "type": "string",
            "format": "date-time"
          }
        }
      },
      "GetLeadEventListResponseDto": {
        "type": "object",
        "properties": {
          "leadEventList": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/LeadEventVo"
            }
          },
          "pageInfo": {
            "$ref": "#/components/schemas/PageInfo"
          }
        }
      },
      "LeadEventVo": {
        "type": "object",
        "properties": {
          "leadEventId": {
            "type": "integer",
            "format": "int64"
          },
          "title": {
            "type": "string"
          },
          "type": {
            "type": "string"
          },
          "createDate": {
            "type": "string",
            "format": "date-time"
          }
        }
      }
    },
    "securitySchemes": {
      "JWT": {
        "type": "http",
        "scheme": "bearer",
        "bearerFormat": "JWT"
      }
    }
  }
}
 * 
 * 
 */
