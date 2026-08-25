import { SUPER_LOGGER } from './custom';

export function withPrefix(prefix: string) {
  return () => prefix + ':';
}
export function withDate() {
  return () => new Date().toISOString() + ': ';
}

type PrefixFunction = () => string;

export function provideLogging(...fns: PrefixFunction[]) {
  const prefixes = fns.map((fn) => fn());

  return {
    provide: SUPER_LOGGER,
    useValue: (x: string) => console.log(`${prefixes.join(' ')}  ${x}`),
  };
}
