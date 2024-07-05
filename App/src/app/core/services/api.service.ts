import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { StorageService } from './storage.service';
import { ResponseModel } from '../models/response.models';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http:HttpClient, private store:StorageService)
  {}

  private createHeaders(showLoader: boolean): HttpHeaders {
    let headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.store.getUserClaims()?.token!,
    });

    if (showLoader) {
      headers = headers.append('Show-Loader', 'true');
    }
    return headers;
  }

  public GetRequest(endPoint: string, isProtected: boolean, showLoader: boolean = false): Observable<ResponseModel>
  {
    const headers = isProtected ? this.createHeaders(showLoader) : null;

    return this.http.get<ResponseModel>(environment.apiBaseUrl + endPoint, { headers });
  }

  public PostRequest(obj: any, endPoint: string, isProtected: boolean, showLoader: boolean = false): Observable<ResponseModel>
  {
    const headers = isProtected ? this.createHeaders(showLoader) : null;
    return this.http.post<ResponseModel>(environment.apiBaseUrl + endPoint, obj, { headers });
  }

  public PutRequest(obj: any, endPoint: string, isProtected: boolean, showLoader: boolean = false): Observable<ResponseModel>
  {
    const headers = isProtected ? this.createHeaders(showLoader) : null;

    return this.http.put<ResponseModel>(environment.apiBaseUrl + endPoint, obj, { headers });
  }

  public DeleteRequest(endPoint: string, isProtected: boolean, showLoader: boolean = false): Observable<ResponseModel>
  {
    const headers = isProtected ? this.createHeaders(showLoader) : null;
    return this.http.delete<ResponseModel>(environment.apiBaseUrl + endPoint, { headers });
  }

  public DownloadFile(endPoint: string, fileName: string): Observable<boolean> {
    var headers = this.createHeaders(true);
    headers = headers.append('Content-Type', 'text/csv');

    return this.http
      .get(environment.apiBaseUrl + endPoint, { headers, responseType: 'blob' })
      .pipe(
        map((blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = fileName;
          a.click();
          window.URL.revokeObjectURL(url);
          return true;
        }),
        catchError(() => {
          return of(false);
        })
      );
  }
}
