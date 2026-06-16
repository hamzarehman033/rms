import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { providePrimeNG } from 'primeng/config';
import { MessageService } from 'primeng/api';
import { provideEchartsCore } from 'ngx-echarts';
import { customTheme } from './theme/primeng-theme';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { jwtInterceptor } from './core/interceptors/jwt.interceptor';
import { tokenRefreshInterceptor } from './core/interceptors/token-refresh.interceptor';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([jwtInterceptor, tokenRefreshInterceptor, errorInterceptor])),
    providePrimeNG({
      theme: {
        preset: customTheme,
        options: {
          darkMode: true,
          cssVariablePrefix: 'p'
        }
      }
    }),
    provideEchartsCore({
      echarts: () => import('echarts/core')
    }),
    MessageService,
  ]
};
