import axios from '@/utils/axios';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

/**
 * 사용 중인 회의(Jitsi) 서버 목록 (LC-3439).
 *
 * 서버 `meeting_server` 테이블이 유일한 출처다. 앞에서부터 헬스체크해 살아 있는 base 를
 * 회의실 주소 저장 API 로 보낸다. 서버는 이 목록에 있는 base 만 받는다.
 *
 * GET /api/v1/meeting-servers — 인증 없이 부를 수 있다. 우선순위 오름차순.
 */
const meetingServerListSchema = z.object({
  meetingServerList: z.array(
    z.object({
      baseUrl: z.string(),
      priority: z.number(),
    }),
  ),
});

const meetingServerQuery = {
  queryKey: ['meeting-servers'],
  queryFn: async (): Promise<string[]> => {
    const res = await axios.get('/meeting-servers');
    return meetingServerListSchema
      .parse(res.data.data)
      .meetingServerList.map((server) => server.baseUrl);
  },
};

const EMPTY: string[] = [];

/**
 * `baseUrls` 는 렌더용(JitsiEmbed failover 후보), `loadBaseUrls` 는 입장 직전에 부른다.
 * 입장 시점에 다시 받아야 어드민에서 방금 바꾼 서버가 반영된다.
 */
export const useMeetingServerBaseUrls = () => {
  const queryClient = useQueryClient();
  const { data } = useQuery(meetingServerQuery);

  return {
    baseUrls: data ?? EMPTY,
    loadBaseUrls: () => queryClient.fetchQuery(meetingServerQuery),
  };
};
