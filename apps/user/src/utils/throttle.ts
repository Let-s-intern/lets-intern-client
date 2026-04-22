export default function throttle(callback: () => void, delay: number) {
  let timeId: NodeJS.Timeout | null;

  return () => {
    if (timeId) return;
    timeId = setTimeout(() => {
      callback();
      timeId = null;
    }, delay);
  };
}
