/* eslint-disable no-empty-pattern */
import { expect, test } from 'vitest';
import {
  getChallenge,
  getChallengeId,
  getChallengeIdApplications,
  getChallengeIdApplicationsPayback,
  missionAdmin
} from './schema';

const requestPromise = (async () => {
  const res = await fetch(`${process.env.REACT_APP_SERVER_API}/user/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: process.env.TEST_EMAIL,
      password: process.env.TEST_PASSWORD,
    }),
  });

  if (!res.ok) {
    throw new Error('Failed to sign in');
  }

  const json = await res.json();
  if (json.status !== 200) {
    throw new Error('Failed to sign in');
  }

  const { accessToken } = json.data as {
    accessToken: string;
    refreshToken: string;
  };

  return ({
    body,
    method,
    path,
  }: {
    path: string;
    method: string;
    body?: Record<string, unknown>;
  }) => {
    return fetch(`${process.env.REACT_APP_SERVER_API}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  };
})();

interface Fixtures {
  request: Awaited<typeof requestPromise>;
}

/** @see https://vitest.dev/guide/test-context.html */
const testWithAuth = test.extend<Fixtures>({
  request: async ({}, use) => {
    // await use(await requestPromise);
    use(await requestPromise);
  },
});

testWithAuth('GET /api/v1/user/is-admin', async ({ request }) => {
  const res = await request({ method: 'GET', path: '/user/is-admin' });
  const data = await res.json();
  expect(data.data).toBe(true);
});

testWithAuth('GET /api/v1/challenge', async ({ request }) => {
  const res = await request({
    method: 'GET',
    path: '/challenge',
  });

  const data = await res.json();
  getChallenge.parse(data.data);
});

testWithAuth('GET /api/v1/challenge/{id}', async ({ request }) => {
  const res = await request({
    method: 'GET',
    path: '/challenge/3',
  });

  const data = await res.json();
  getChallengeId.parse(data.data);
});

testWithAuth('GET /api/v1/mission/admin/{id}', async ({ request }) => {
  const res = await request({
    method: 'GET',
    path: '/mission/admin/20',
  });

  const data = await res.json();
  missionAdmin.parse(data.data);
});

testWithAuth(
  'GET /api/v1/challenge/{id}/applications/payback',
  async ({ request }) => {
    const res = await request({
      method: 'GET',
      path: '/challenge/20/applications/payback',
    });

    const data = await res.json();
    getChallengeIdApplicationsPayback.parse(data.data);
  },
);

testWithAuth('GET /api/v1/challenge/{id}/applications', async ({ request }) => {
  const res = await request({
    method: 'GET',
    path: '/challenge/20/applications',
  });

  const data = await res.json();
  getChallengeIdApplications.parse(data.data);
});
