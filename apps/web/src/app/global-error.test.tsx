import React from 'react';
import { render, act } from '@testing-library/react';
import GlobalError from './global-error';

jest.mock('@sentry/nextjs', () => ({
  captureException: jest.fn(),
}));

jest.mock('@/utils/webhook', () => ({
  sendErrorToWebhook: jest.fn(() => Promise.resolve()),
}));

import * as Sentry from '@sentry/nextjs';

const mockCaptureException = Sentry.captureException as jest.MockedFunction<
  typeof Sentry.captureException
>;

describe('GlobalError', () => {
  beforeEach(() => {
    mockCaptureException.mockClear();
  });

  it('kind=server-component 태그와 digest, route가 captureException에 포함된다', async () => {
    const err = Object.assign(new Error('RSC 오류'), { digest: 'abc123' });

    await act(async () => {
      render(<GlobalError error={err} />);
    });

    expect(mockCaptureException).toHaveBeenCalledWith(
      err,
      expect.objectContaining({
        tags: expect.objectContaining({ kind: 'server-component' }),
        extra: expect.objectContaining({ digest: 'abc123' }),
      }),
    );
  });
});
