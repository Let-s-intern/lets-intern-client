// Environment: server

export { data };

import { getActiveReportsSchema } from '@/api/report';
import fetch from 'node-fetch';

async function data() {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_SERVER_API}/report/active`,
      {
        headers: {
          Accept: 'application/json',
        },
      },
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = (await res.json()) as any;
    return getActiveReportsSchema.parse(data.data);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    throw new Error('Failed to fetch personal statement data');
  }
}

export type Data = Awaited<ReturnType<typeof data>>;
