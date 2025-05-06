export default function debounce(callback: TimerHandler, delay?: number) {
  let timerId: number;
  return (...args: any[]) => {
    if (timerId) clearTimeout(timerId);
    timerId = setTimeout(callback, delay ?? 300, ...args);
  };
}
