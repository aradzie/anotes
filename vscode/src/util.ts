export function debounce<F extends (...args: any[]) => void>(fn: F, ms: number) {
  let handle: NodeJS.Timeout | undefined;
  return (...args: Parameters<F>) => {
    if (handle) {
      clearTimeout(handle);
    }
    handle = setTimeout(() => fn(...args), ms);
  };
}
