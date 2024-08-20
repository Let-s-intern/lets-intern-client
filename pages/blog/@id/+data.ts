// Environment: server

export { data };

import fetch from 'node-fetch';
import { PageContextServer } from 'vike/types';
import { blogSchema } from '../../../src/api/blogSchema';

async function data(pageContext: PageContextServer) {
  const { id } = pageContext.routeParams;

  try {
    const res = await fetch(`${import.meta.env.VITE_SERVER_API}/blog/${id}`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = (await res.json()) as any;
    return blogSchema.parse(data.data);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    throw new Error('Failed to fetch blog data');
  }
}

export type Data = Awaited<ReturnType<typeof data>>;
