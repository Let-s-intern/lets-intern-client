import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import SsoRedirectWhitelistCreate from '../SsoRedirectWhitelistCreate';

/**
 * 등록 폼이 지켜야 할 것.
 *
 *   1. 잘못된 값을 서버까지 보내지 않는다 — 오타 난 URL 이 DB 에 들어가면 SSO 로그인이
 *      조용히 실패하고, 원인을 화이트리스트에서 찾기까지 오래 걸린다.
 *   2. 서버가 거절한 사유를 그대로 보여준다 — `등록 실패` 로 뭉개면 같은 값을 계속 넣는다.
 */

const createMutate = vi.fn();
let createOptions: {
  successCallback?: () => void;
  errorCallback?: (error: Error) => void;
} = {};

vi.mock('@/api/sso', () => ({
  useCreateSsoRedirectWhitelist: (options: typeof createOptions) => {
    createOptions = options;
    return { mutate: createMutate, isPending: false };
  },
}));

const renderForm = () =>
  render(
    <MemoryRouter>
      <SsoRedirectWhitelistCreate />
    </MemoryRouter>,
  );

const fill = async (serviceName: string, uri: string) => {
  if (serviceName) {
    await userEvent.type(screen.getByLabelText('서비스명'), serviceName);
  }
  if (uri) {
    await userEvent.type(screen.getByLabelText('허용 리다이렉트 URL'), uri);
  }
};

const submit = () =>
  userEvent.click(screen.getByRole('button', { name: '등록' }));

beforeEach(() => {
  createMutate.mockReset();
  createOptions = {};
});

describe('SsoRedirectWhitelistCreate', () => {
  it('서비스명과 허용 URL 을 그대로 보낸다', async () => {
    renderForm();
    await fill(
      'FreeSeminarVodHub',
      'https://vod.letscareer.co.kr/auth/callback',
    );
    await submit();

    expect(createMutate).toHaveBeenCalledWith({
      serviceName: 'FreeSeminarVodHub',
      allowedRedirectUri: 'https://vod.letscareer.co.kr/auth/callback',
    });
  });

  it('URL 형식이 틀리면 요청하지 않고 사유를 보여준다', async () => {
    renderForm();
    await fill('FreeSeminarVodHub', 'vod.letscareer.co.kr/auth/callback');
    await submit();

    expect(createMutate).not.toHaveBeenCalled();
    expect(screen.getByRole('alert')).toHaveTextContent('https://');
  });

  it('localhost 가 아닌 http 는 요청하지 않는다', async () => {
    renderForm();
    await fill(
      'FreeSeminarVodHub',
      'http://vod.letscareer.co.kr/auth/callback',
    );
    await submit();

    expect(createMutate).not.toHaveBeenCalled();
    expect(screen.getByRole('alert')).toHaveTextContent('localhost');
  });

  it('서비스명이 비면 요청하지 않는다', async () => {
    renderForm();
    await fill('', 'https://vod.letscareer.co.kr/auth/callback');
    await submit();

    expect(createMutate).not.toHaveBeenCalled();
    expect(screen.getByRole('alert')).toHaveTextContent('서비스명');
  });

  it('서버가 거절하면 그 사유를 그대로 보여준다', async () => {
    renderForm();
    await fill(
      'FreeSeminarVodHub',
      'https://vod.letscareer.co.kr/auth/callback',
    );
    await submit();

    act(() =>
      createOptions.errorCallback?.(new Error('이미 등록된 URL 입니다.')),
    );

    expect(await screen.findByRole('alert')).toHaveTextContent(
      '이미 등록된 URL 입니다.',
    );
  });
});
