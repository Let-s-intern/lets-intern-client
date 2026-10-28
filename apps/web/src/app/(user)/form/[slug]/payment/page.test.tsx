import Page from './page';

jest.mock('@/domain/one-time-form/payment/ui/PaymentStepPage', () => ({
  __esModule: true,
  default: () => null,
}));

const render = (searchParams: Record<string, string | string[]>) =>
  Page({
    params: Promise.resolve({ slug: 'portfolio-1115' }),
    searchParams: Promise.resolve(searchParams),
  });

describe('/form/[slug]/payment page', () => {
  it('쿼리가 없으면 실패 안내 없이 그린다', async () => {
    const element = await render({});
    expect(element.props).toEqual({
      slug: 'portfolio-1115',
      tossFailureMessage: null,
    });
  });

  it('토스 failUrl 의 code·message 가 있으면 message 를 넘긴다', async () => {
    const element = await render({
      code: 'PAY_PROCESS_CANCELED',
      message: '사용자에 의해 결제가 취소되었습니다.',
      orderId: 'letsOrder1',
    });
    expect(element.props.tossFailureMessage).toBe(
      '사용자에 의해 결제가 취소되었습니다.',
    );
  });

  it('code 만 있으면 빈 문구로 안내만 띄운다', async () => {
    const element = await render({ code: 'PAY_PROCESS_ABORTED' });
    expect(element.props.tossFailureMessage).toBe('');
  });
});
