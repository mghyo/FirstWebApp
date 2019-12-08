import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { catchError, map } from 'rxjs/operators';

import { api } from '../../api';
import { Vehicle } from '../../models';

@Injectable()
export class VehicleService {
  constructor(private http: HttpClient) {}

  // public addVehicle(vehicle: Vehicle): Observable<Vehicle> {
  //     return this.http
  //         .post<Vehicle>(api.domain + `/api/vehicles`, vehicle)
  //         .pipe(catchError((error: any) => Observable.throw(error.json())));
  // }
  public addVehicle(vehicle: Vehicle): Observable<null> {
    return this.http
      .post<null>(api.domain + `/Vehicles`, vehicle)
      .pipe(catchError((error: any) => Observable.throw(error.json())));
  }

  // public loadVehicles(): Observable<Vehicle[]> {
  //     return this.http
  //         .get<Vehicle[]>(api.domain + `/api/vehicles`)
  //         .pipe(catchError((error: any) => Observable.throw(error.json())));
  // }
  public loadVehicles(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(api.domain + `/Vehicles`).pipe(
      map((objects: any[]) => {
        return objects.map((object: any): Vehicle => {
          return {
            ...object,
            routeId: object.routeid,
            nextStopId: object.nextstopid,
            currentStopId: object.currentstopid,
            minutesTillArrival: object.minutestillarrival,
            minutesTillDeparting: object.minutestilldeparting,
            traverseStopsUp: object.traversestopsup,
            riderIds: object.riderids
          };
        });
      }),
      catchError((error: any) => Observable.throw(error.json()))
    );
  }

  // public getNewVehicleId(): Observable<number> {
  //     return this.http
  //         .get<Vehicle[]>(api.domain + '/api/vehicles?_sort=id&_order=desc&_limit=1')
  //         .pipe(
  //             map((vehicles: Vehicle[]) => vehicles[0].id + 1),
  //             catchError((error: any) => Observable.throw(error.json()))
  //         );
  // }
  public getNewVehicleId(): Observable<number> {
    return this.http
      .get<{ id: number }>(api.domain + '/Vehicles/Max')
      .pipe(
        map((idObject: { id: number }) => idObject.id + 1),
        catchError((error: any) => Observable.throw(error.json()))
      );
  }
}
