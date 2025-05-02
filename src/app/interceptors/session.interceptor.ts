import {HttpInterceptorFn} from '@angular/common/http';
import {inject} from '@angular/core';
import {SessionService} from '../services/session.service';
import {catchError, throwError} from 'rxjs';

export const sessionInterceptor: HttpInterceptorFn = (req, next) => {
  const sessionService = inject(SessionService);

  return next(req.clone({
    setHeaders: {
      'X-Session-ID': sessionService.sessionId
    }
  })).pipe(
    catchError(error => {
      if (error.status === 401) {
        sessionService.clearSession();
        window.location.reload();
      }
      return throwError(() => error);
    })
  );
};
