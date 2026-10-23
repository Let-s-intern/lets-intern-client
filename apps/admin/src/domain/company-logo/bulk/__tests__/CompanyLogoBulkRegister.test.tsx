import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const get = vi.fn();
const post = vi.fn();

vi.mock('@/utils/axios', () => ({
  default: {
    get: (...args: unknown[]) => get(...args),
    post: (...args: unknown[]) => post(...args),
  },
}));

import CompanyLogoBulkRegister from '../CompanyLogoBulkRegister';

const candidate = (site: string, name: string, width = 180) => ({
  url: `https://${site}/${name}`,
  format: 'PNG',
  width,
  height: width,
  byteSize: 1000,
  source: 'ICON',
});

type Responder = (body: Record<string, string>) => Promise<unknown>;

/** 경로마다 응답을 정한다. 기본은 후보 2개 + siteName 없음, 올리기·등록 성공 */
const setupApi = (overrides: Record<string, Responder> = {}) => {
  const defaults: Record<string, Responder> = {
    '/admin/company-logo/favicon/candidates': async ({ siteUrl }) => {
      const site = new URL(siteUrl).hostname;
      return {
        data: {
          data: {
            candidates: [
              candidate(site, 'big.png'),
              candidate(site, 'small.png', 32),
            ],
            siteName: null,
          },
        },
      };
    },
    '/admin/company-logo/favicon': async ({ candidateUrl }) => ({
      data: {
        data: { imageUrl: `https://cdn.test/${candidateUrl.split('/').pop()}` },
      },
    }),
    '/admin/company-logo': async () => ({ data: { data: { id: 1 } } }),
  };
  const routes = { ...defaults, ...overrides };
  post.mockImplementation((url: string, body: Record<string, string>) =>
    routes[url](body),
  );
};

const renderBulk = () => {
  const onDirtyChange = vi.fn();
  const onGoToList = vi.fn();
  render(
    <QueryClientProvider
      client={
        new QueryClient({
          defaultOptions: { queries: { retry: false } },
        })
      }
    >
      <CompanyLogoBulkRegister
        onDirtyChange={onDirtyChange}
        onGoToList={onGoToList}
      />
    </QueryClientProvider>,
  );
  return { onDirtyChange, onGoToList };
};

const importSites = (...siteUrls: string[]) => {
  fireEvent.change(screen.getByLabelText('사이트 주소 목록'), {
    target: { value: siteUrls.join('\n') },
  });
  fireEvent.click(screen.getByRole('button', { name: '가져오기' }));
};

const rowOf = (siteUrl: string) =>
  screen.getByText(siteUrl).closest('tr') as HTMLElement;
const nameInput = (siteUrl: string) =>
  screen.getByLabelText(`${siteUrl} 회사명`) as HTMLInputElement;
const checkbox = (siteUrl: string) =>
  screen.getByLabelText(`${siteUrl} 저장 대상`) as HTMLInputElement;
const postedTo = (url: string) =>
  post.mock.calls.filter(([calledUrl]) => calledUrl === url);

describe('CompanyLogoBulkRegister', () => {
  beforeEach(() => {
    get.mockResolvedValue({
      data: {
        data: {
          companyLogoList: [
            { id: 9, name: '카카오', imageUrl: 'https://cdn.test/kakao.png' },
          ],
        },
      },
    });
    setupApi();
  });

  afterEach(() => vi.clearAllMocks());

  it('같은 사이트를 빼고 몇 개 뺐는지 알린다', async () => {
    renderBulk();
    importSites(
      'https://toss.im',
      'https://www.toss.im',
      '',
      'https://naver.com',
    );
    expect(screen.getByText('같은 사이트 1개를 뺐습니다.')).toBeInTheDocument();
    await screen.findAllByText('완료');
    expect(screen.getAllByRole('row')).toHaveLength(3); // 머리 + 2행
  });

  it('30개를 넘으면 가져오지 않고 알린다', () => {
    renderBulk();
    importSites(
      ...Array.from({ length: 31 }, (_, i) => `https://site${i}.test`),
    );
    expect(
      screen.getByText('한 번에 30개까지 가져올 수 있습니다. 지금 31개입니다.'),
    ).toBeInTheDocument();
    expect(post).not.toHaveBeenCalled();
  });

  it('후보 찾기는 동시에 3개까지만 보낸다', async () => {
    const pending: (() => void)[] = [];
    setupApi({
      '/admin/company-logo/favicon/candidates': ({ siteUrl }) =>
        new Promise((resolve) => {
          pending.push(() =>
            resolve({
              data: {
                data: {
                  candidates: [candidate(new URL(siteUrl).hostname, 'a.png')],
                  siteName: null,
                },
              },
            }),
          );
        }),
    });
    renderBulk();
    importSites(...['a', 'b', 'c', 'd', 'e'].map((s) => `https://${s}.test`));

    await waitFor(() => expect(post).toHaveBeenCalledTimes(3));
    expect(screen.getAllByText('가져오는 중')).toHaveLength(5);

    await act(async () => pending.shift()!());
    await waitFor(() => expect(post).toHaveBeenCalledTimes(4));
    await act(async () => {
      pending.splice(0).forEach((resolve) => resolve());
    });
    await waitFor(() => expect(post).toHaveBeenCalledTimes(5));
    await act(async () => pending.splice(0).forEach((resolve) => resolve()));
    await waitFor(() => expect(screen.getAllByText('완료')).toHaveLength(5));
  });

  it('기본 로고는 첫 후보, 회사명은 siteName 이고 없으면 호스트명이다', async () => {
    setupApi({
      '/admin/company-logo/favicon/candidates': async ({ siteUrl }) => ({
        data: {
          data: {
            candidates: [candidate(new URL(siteUrl).hostname, 'big.png')],
            siteName: siteUrl.includes('toss') ? '토스' : null,
          },
        },
      }),
    });
    renderBulk();
    importSites('https://toss.im', 'https://www.naver.com');

    await waitFor(() =>
      expect(nameInput('https://toss.im').value).toBe('토스'),
    );
    expect(nameInput('https://www.naver.com').value).toBe('naver.com');
    expect(checkbox('https://toss.im')).toBeChecked();
    expect(
      within(rowOf('https://toss.im'))
        .getByRole('button', { name: 'https://toss.im 로고 후보 바꾸기' })
        .querySelector('img'),
    ).toHaveAttribute('src', 'https://toss.im/big.png');
  });

  it('실패한 행은 문구를 보이고 체크를 풀어 막으며, 다시 시도할 수 있다', async () => {
    let attempt = 0;
    setupApi({
      '/admin/company-logo/favicon/candidates': async () => {
        attempt += 1;
        if (attempt === 1)
          throw { status: 400, code: 'COMPANY_LOGO_FAVICON_INVALID_URL' };
        return {
          data: {
            data: {
              candidates: [candidate('toss.im', 'a.png')],
              siteName: '토스',
            },
          },
        };
      },
    });
    renderBulk();
    importSites('https://toss.im');

    const row = await waitFor(() => {
      const found = rowOf('https://toss.im');
      expect(found).toHaveTextContent('실패');
      return found;
    });
    expect(row).toHaveTextContent('사이트 주소를 확인해 주세요.');
    expect(checkbox('https://toss.im')).not.toBeChecked();
    expect(checkbox('https://toss.im')).toBeDisabled();

    fireEvent.click(within(row).getByRole('button', { name: '다시 시도' }));
    await waitFor(() =>
      expect(rowOf('https://toss.im')).toHaveTextContent('완료'),
    );
    expect(checkbox('https://toss.im')).toBeChecked();
  });

  it('썸네일을 누르면 그 행의 다른 후보로 바꿀 수 있다', async () => {
    renderBulk();
    importSites('https://toss.im');
    fireEvent.click(
      await screen.findByRole('button', {
        name: 'https://toss.im 로고 후보 바꾸기',
      }),
    );
    fireEvent.click(screen.getByRole('radio', { name: 'PNG 32×32' }));
    fireEvent.click(screen.getByRole('button', { name: '저장 (1개)' }));

    await waitFor(() =>
      expect(postedTo('/admin/company-logo')).toHaveLength(1),
    );
    expect(postedTo('/admin/company-logo/favicon')[0][1]).toEqual({
      siteUrl: 'https://toss.im',
      candidateUrl: 'https://toss.im/small.png',
    });
  });

  it('라이브러리나 표 안에 같은 이름이 있으면 「중복」 을 단다', async () => {
    renderBulk();
    importSites('https://toss.im', 'https://naver.com');
    await waitFor(() => expect(screen.getAllByText('완료')).toHaveLength(2));
    expect(screen.queryByText('중복')).not.toBeInTheDocument();

    fireEvent.change(nameInput('https://toss.im'), {
      target: { value: '카카오' },
    });
    expect(
      within(rowOf('https://toss.im')).getByText('중복'),
    ).toBeInTheDocument();

    fireEvent.change(nameInput('https://toss.im'), {
      target: { value: '토스' },
    });
    fireEvent.change(nameInput('https://naver.com'), {
      target: { value: ' 토스 ' },
    });
    expect(screen.getAllByText('중복')).toHaveLength(2);
  });

  it('체크를 푼 행은 저장하지 않고, 올리기 → 등록 순서로 저장한 뒤 잠근다', async () => {
    renderBulk();
    importSites('https://toss.im', 'https://naver.com');
    await waitFor(() => expect(screen.getAllByText('완료')).toHaveLength(2));
    fireEvent.change(nameInput('https://toss.im'), {
      target: { value: '토스' },
    });
    fireEvent.click(checkbox('https://naver.com'));
    fireEvent.click(screen.getByRole('button', { name: '저장 (1개)' }));

    await waitFor(() =>
      expect(screen.getByText('1개 저장, 0개 실패')).toBeInTheDocument(),
    );
    const order = post.mock.calls
      .map(([url]) => url)
      .filter((url) => !url.endsWith('/candidates'));
    expect(order).toEqual([
      '/admin/company-logo/favicon',
      '/admin/company-logo',
    ]);
    expect(postedTo('/admin/company-logo')[0][1]).toEqual({
      name: '토스',
      imageUrl: 'https://cdn.test/big.png',
    });
    expect(rowOf('https://toss.im')).toHaveTextContent('저장됨');
    expect(checkbox('https://toss.im')).not.toBeChecked();
    expect(checkbox('https://toss.im')).toBeDisabled();
    expect(nameInput('https://toss.im')).toBeDisabled();
    expect(
      screen.getByRole('button', { name: '로고 목록으로' }),
    ).toBeInTheDocument();
  });

  it('등록이 409 면 그 행만 실패로 두고, 이름을 고쳐 다시 저장하면 다시 올리지 않고 등록만 한다', async () => {
    let createAttempt = 0;
    setupApi({
      '/admin/company-logo': async () => {
        createAttempt += 1;
        if (createAttempt === 1)
          throw { status: 409, code: 'COMPANY_LOGO_NAME_CONFLICT' };
        return { data: { data: { id: 2 } } };
      },
    });
    renderBulk();
    importSites('https://toss.im');
    await screen.findByText('완료');
    fireEvent.click(screen.getByRole('button', { name: '저장 (1개)' }));

    await waitFor(() =>
      expect(screen.getByText('0개 저장, 1개 실패')).toBeInTheDocument(),
    );
    expect(rowOf('https://toss.im')).toHaveTextContent(
      '같은 회사명이 이미 있습니다.',
    );
    expect(checkbox('https://toss.im')).toBeChecked();

    fireEvent.change(nameInput('https://toss.im'), {
      target: { value: '토스 2' },
    });
    fireEvent.click(screen.getByRole('button', { name: '저장 (1개)' }));
    await waitFor(() =>
      expect(rowOf('https://toss.im')).toHaveTextContent('저장됨'),
    );
    expect(postedTo('/admin/company-logo/favicon')).toHaveLength(1);
    expect(postedTo('/admin/company-logo')).toHaveLength(2);
  });

  it('저장하지 않은 행이 있으면 바깥에 알리고, 다 저장되면 거둔다', async () => {
    const { onDirtyChange } = renderBulk();
    importSites('https://toss.im');
    await screen.findByText('완료');
    expect(onDirtyChange).toHaveBeenLastCalledWith(true);

    fireEvent.click(screen.getByRole('button', { name: '저장 (1개)' }));
    await screen.findByText('저장됨');
    expect(onDirtyChange).toHaveBeenLastCalledWith(false);
  });
});
