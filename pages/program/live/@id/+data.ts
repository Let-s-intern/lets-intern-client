// Environment: server

export { data };

import { getLiveIdSchema } from '@/schema';
import fetch from 'node-fetch';
import { PageContextServer } from 'vike/types';

async function data(pageContext: PageContextServer) {
  const { id } = pageContext.routeParams;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API}/live/${id}`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = (await res.json()) as any;
    return { ...getLiveIdSchema.parse(data.data), id };
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    throw new Error('Failed to fetch live data');
  }
}

export type Data = Awaited<ReturnType<typeof data>>;
