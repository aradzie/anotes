export function debounce<F extends (...args: any[]) => void>(callback: F, ms: number) {
  let handle: NodeJS.Timeout | null = null;
  return (...args: Parameters<F>): void => {
    if (handle != null) {
      clearTimeout(handle);
    }
    handle = setTimeout(() => {
      handle = null;
      callback(...args);
    }, ms);
  };
}
