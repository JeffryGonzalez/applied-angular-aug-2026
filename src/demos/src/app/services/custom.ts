import { InjectionToken } from '@angular/core';

export const SUPER_LOGGER = new InjectionToken<(x: string) => void>('SuperLogger');

type EnvDescription = {
  started: Date;
  environment: string;
};

export const ENV_DESCRIPTOR = new InjectionToken<EnvDescription>('EnvDescriptor');

const DEVELOPMENT_DEV: EnvDescription = {
  started: new Date(),
  environment: 'development',
};

export function getCurrentEnvDescriptor(): EnvDescription {
  return window.location.hostname === 'localhost'
    ? DEVELOPMENT_DEV
    : {
        started: new Date(),
        environment: 'production',
      };
}
