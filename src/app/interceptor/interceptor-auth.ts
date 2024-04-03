import { HttpInterceptorFn } from '@angular/common/http';

export const interceptorAuthInterceptor: HttpInterceptorFn = (req, next) => {
  const jwtToken = getJwtToken();
  if (jwtToken) {
    var cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });
    return next(cloned);
  }
  return next(req);
};

function getJwtToken():any {
  let tokens: any = localStorage.getItem('JWT_TOKEN');
  if (!tokens) return null;
  const token = tokens
  return token;
};
