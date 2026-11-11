import { env } from './env';

export const appConfig = {
  name: env.appName,
  tagline: 'Project operations',
  description:
    'Plan projects, track delivery, and keep the team aligned in one workspace.',
  supportEmail: 'team@northstar.dev',
  demoEmail: 'avery@northstar.dev',
  demoPassword: 'demo1234',
} as const;
