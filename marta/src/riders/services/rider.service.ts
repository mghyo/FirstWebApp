import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { catchError, map } from 'rxjs/operators';

import { api } from '../../api';
import { VehicleType } from '../../models';
import { Rider } from '../../models/rider.model';

@Injectable()
export class RiderService {
  constructor(private http: HttpClient) {}

  public addRider(rider: Rider): Observable<null> {
    return this.http
      .post<null>(api.domain + `/Riders`, rider)
      .pipe(catchError((error: any) => Observable.throw(error.json())));
  }

  public getNewRiderId(): Observable<number> {
    return this.http
      .get<{id: number}>(api.domain + '/Riders/Max')
      .pipe(
        map((idObject: {id: number}) => idObject.id + 1),
        catchError((error: any) => Observable.throw(error.json()))
      );
  }
}
