import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { StorageService } from '../services/storage.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private store: StorageService, private toaster:ToastrService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>>
  {
    return next.handle(request)
    .pipe(
        map(res => {
          return res;
        }),
        catchError((httpError: HttpErrorResponse) =>
        {
          let errorMsg = '';
          if (httpError.error instanceof ErrorEvent)
          {
            this.toaster.error('Client side error.');
            errorMsg = `Error: ${httpError.error.message}`;
          }
          else
          {
            if(httpError.status === 401)
            {
              var expiryDate = new Date(this.store.getUserClaims()?.tokenExpiry!);
              const currentDate = new Date();
              if(expiryDate > currentDate)
              {
                this.toaster.error('Unauthorized Access');
              }
              else
              {
                this.store.removeUserClaims();
                this.toaster.error('Token Expired, Please login again!');

                setTimeout(() => {
                  location.reload();
                }, 1000);
              }
            }
            else{
              if(httpError.error.message)
              {
                this.toaster.error(httpError.error.message);
              }
              else
              {
                this.toaster.error('Server side error.');
              }
              errorMsg = `Error Code: ${httpError.status},  Message: ${httpError.message}`;
            }
          }

          console.log(errorMsg);
          return throwError(errorMsg);
        })
      );
  }
}
