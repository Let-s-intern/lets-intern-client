import React from 'react';
import { render, act } from '@testing-library/react';
import StaleChunkHandler from './StaleChunkHandler';

const mockReload = jest.fn();

Object.defineProperty(window, 'location', {
  configurable: true,
  value: { ...window.location, reload: mockReload },
});

const mockSessionStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] ?? null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'sessionStorage', {
  configurable: true,
  value: mockSessionStorage,
});

function dispatchErrorEvent(error: Error) {
  const event = new ErrorEvent('error', { error });
  window.dispatchEvent(event);
}

describe('StaleChunkHandler', () => {
  beforeEach(() => {
    mockReload.mockClear();
    mockSessionStorage.getItem.mockClear();
    mockSessionStorage.setItem.mockClear();
    mockSessionStorage.clear();
  });

  it('ChunkLoadError 발생 시 1회 reload', () => {
    render(<StaleChunkHandler />);

    const chunkError = new Error('Loading chunk 123 failed.');
    chunkError.name = 'ChunkLoadError';

    act(() => {
      dispatchErrorEvent(chunkError);
    });

    expect(mockReload).toHaveBeenCalledTimes(1);
    expect(mockSessionStorage.setItem).toHaveBeenCalledWith(
      'sentry_stale_chunk_reloaded',
      '1',
    );
  });

  it('이미 reload flag 있으면 reload 하지 않음', () => {
    mockSessionStorage.getItem.mockReturnValue('1');
    render(<StaleChunkHandler />);

    const chunkError = new Error('Loading chunk 456 failed.');
    chunkError.name = 'ChunkLoadError';

    act(() => {
      dispatchErrorEvent(chunkError);
    });

    expect(mockReload).not.toHaveBeenCalled();
  });

  it('일반 에러는 reload 하지 않음', () => {
    render(<StaleChunkHandler />);

    act(() => {
      dispatchErrorEvent(new TypeError('일반 에러'));
    });

    expect(mockReload).not.toHaveBeenCalled();
  });
});
