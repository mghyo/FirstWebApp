import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { catchError, map } from 'rxjs/operators';

import { api } from '../../api';
import { Stop } from '../../models';

@Injectable()
export class StopService {
  constructor(private http: HttpClient) {}

  // public addStop(stop: Stop): Observable<Stop> {
  //   return this.http
  //     .post<Stop>(api.domain + `/api/stops`, stop)
  //     .pipe(catchError((error: any) => Observable.throw(error.json())));
  // }
  public addStop(stop: Stop): Observable<null> {
    return this.http
      .post<null>(api.domain + `/Stops`, stop)
      .pipe(catchError((error: any) => Observable.throw(error.json())));
  }

  // public loadStops(): Observable<Stop[]> {
  //   return this.http
  //     .get<Stop[]>(api.domain + `/api/stops`)
  //     .pipe(catchError((error: any) => Observable.throw(error.json())));
  // }
  public loadStops(): Observable<Stop[]> {
    return this.http.get<Stop[]>(api.domain + `/Stops`).pipe(
      map((objects: any[]) => {
        return objects.map((object: any): Stop => {
          return {
            ...object,
            riderCapacity: object.ridercapacity,
            riderIds: object.riderids,
            xCoordinate: object.xcoordinate,
            yCoordinate: object.ycoordinate
          };
        });
      }),
      catchError((error: any) => Observable.throw(error.json()))
    );
  }

  // public getNewStopId(): Observable<number> {
  //   return this.http
  //     .get<Stop[]>(api.domain + '/api/stops?_sort=id&_order=desc&_limit=1')
  //     .pipe(
  //       map((stops: Stop[]) => stops[0].id + 1),
  //       catchError((error: any) => Observable.throw(error.json()))
  //     );
  // }
  public getNewStopId(): Observable<number> {
    return this.http
      .get<{ id: number }>(api.domain + '/Stops/Max')
      .pipe(
        map((idObject: { id: number }) => idObject.id + 1),
        catchError((error: any) => Observable.throw(error.json()))
      );
  }
}
