// Environment: server

export { data };

import { getActiveReportsSchema } from '@/api/report';
import fetch from 'node-fetch';

async function data() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_API}/report/active`,
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = (await res.json()) as any;
    return getActiveReportsSchema.parse(data.data);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    throw new Error('Failed to fetch blog data');
  }
}

export type Data = Awaited<ReturnType<typeof data>>;
