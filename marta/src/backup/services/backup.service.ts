import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { catchError, map } from 'rxjs/operators';

import { api } from '../../api';

@Injectable()
export class BackupService {
  constructor(private http: HttpClient) {}

  public loadData(tableName: string, fileName: string): Observable<null> {
    return this.http
      .post<null>(api.domain + `/addMartaStopData`, { tableName, fileName })
      .pipe(catchError((error: any) => Observable.throw(error)));
  }

  public saveData(tableName: string, fileName: string): Observable<null> {
    return this.http
      .post<null>(api.domain + `/Save`, { tableName, fileName })
      .pipe(catchError((error: any) => Observable.throw(error)));
  }

  public resetSimulation(): Observable<null> {
    return this.http
      .post<null>(api.domain + `/Reset`, null)
      .pipe(catchError((error: any) => Observable.throw(error)));
  }
}
