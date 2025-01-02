import { appBootstrapLoader } from '@common';
import { AppModule } from './app.module';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      persona?: any;
    }
  }
}

appBootstrapLoader(AppModule, { swagger: { enabled: true, config: { version: '1.0.0' } } });
