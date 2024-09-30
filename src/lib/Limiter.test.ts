import { expect, it, vi } from 'vitest';
import { Limiter } from './Limiter'; // 실제 파일 경로에 맞게 수정해주세요

it('should allow 10 requests within 10 seconds', () => {
  const limiter = new Limiter();
  vi.useFakeTimers();

  for (let i = 0; i < 10; i++) {
    expect(limiter.check()).toBe(true);
  }

  vi.useRealTimers();
});

it('should reject the 11th request within 10 seconds', () => {
  const limiter = new Limiter();
  vi.useFakeTimers();

  for (let i = 0; i < 10; i++) {
    limiter.check();
  }
  expect(limiter.check()).toBe(false);

  vi.useRealTimers();
});

it('should allow requests after 10 seconds', () => {
  const limiter = new Limiter();
  vi.useFakeTimers();

  for (let i = 0; i < 10; i++) {
    limiter.check();
  }

  vi.advanceTimersByTime(10000);

  expect(limiter.check()).toBe(true);

  vi.useRealTimers();
});

it('should handle requests over time', () => {
  const limiter = new Limiter();
  vi.useFakeTimers();

  // 5초 동안 5개의 요청
  for (let i = 0; i < 5; i++) {
    expect(limiter.check()).toBe(true);
  }

  // 4초 후
  vi.advanceTimersByTime(4000);

  // 추가 5개의 요청 (총 10개)
  for (let i = 0; i < 5; i++) {
    expect(limiter.check()).toBe(true);
  }

  // 11번째 요청은 거부되어야 함
  expect(limiter.check()).toBe(false);

  // 6초 후 (첫 5개의 요청이 만료됨)
  vi.advanceTimersByTime(6000);

  // 이제 5개의 요청이 가능해야 함
  for (let i = 0; i < 5; i++) {
    expect(limiter.check()).toBe(true);
  }

  // 6번째 요청은 다시 거부되어야 함
  expect(limiter.check()).toBe(false);

  vi.useRealTimers();
});

it('should reset after long period of inactivity', () => {
  const limiter = new Limiter();
  vi.useFakeTimers();

  // 10개의 요청을 빠르게 보냄
  for (let i = 0; i < 10; i++) {
    expect(limiter.check()).toBe(true);
  }

  // 11번째 요청은 거부되어야 함
  expect(limiter.check()).toBe(false);

  // 12초 후
  vi.advanceTimersByTime(12000);

  // 이제 다시 10개의 요청이 허용되어야 함
  for (let i = 0; i < 10; i++) {
    expect(limiter.check()).toBe(true);
  }

  vi.useRealTimers();
});
