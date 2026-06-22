import { onOpenPlanSheet, openPlanSheet } from './planSheet';

describe('planSheet 이벤트 채널', () => {
  it('openPlanSheet() dispatch 시 구독 핸들러가 호출된다', () => {
    const handler = jest.fn();
    const unsubscribe = onOpenPlanSheet(handler);

    openPlanSheet();
    expect(handler).toHaveBeenCalledTimes(1);

    unsubscribe();
  });

  it('unsubscribe 후에는 더 이상 호출되지 않는다', () => {
    const handler = jest.fn();
    const unsubscribe = onOpenPlanSheet(handler);

    unsubscribe();
    openPlanSheet();
    expect(handler).not.toHaveBeenCalled();
  });
});
