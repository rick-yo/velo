import { onCLS, onFID, onLCP, onINP, onFCP, onTTFB, Metric } from 'web-vitals';

export function register(
  baseURL: string,
  getRoutePath?: () => string
): () => void {
  let disableReport = false;
  const callbacks = [onCLS, onFID, onLCP, onINP, onFCP, onTTFB];
  callbacks.forEach((fn) => fn(report));

  function report(metric: Metric) {
    if (disableReport) {
      return;
    }

    const { name, value, id } = metric;
    const searchEntries: [string, string][] = [
      ['name', name],
      ['value', value.toString()],
      ['metric_id', id],
    ];
    const route = getRoutePath?.();
    if (route) {
      searchEntries.push(['route', route]);
    }

    const search = new URLSearchParams(searchEntries);
    fetch(`${baseURL}/collect?${search.toString()}`, { keepalive: true, mode: 'no-cors' });
  }

  return function dispose() {
    disableReport = true;
  };
}
