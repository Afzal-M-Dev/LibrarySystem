import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, finalize } from 'rxjs';
import { LoaderService } from '../services/loader.service';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {

  constructor(private loader: LoaderService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const showLoader = request.headers.get('Show-Loader');

    if(showLoader)
      this.loader.setLoading(true);

    return next.handle(request).pipe(
      finalize(() => {
        this.loader.setLoading(false);
      })
    );
  }
}
