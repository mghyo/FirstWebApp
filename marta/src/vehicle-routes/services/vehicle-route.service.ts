import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { catchError, map } from 'rxjs/operators';

import { api } from '../../api';
import { VehicleRoute } from '../../models';

@Injectable()
export class VehicleRouteService {
  constructor(private http: HttpClient) {}

  // public addVehicleRoute(vehicleRoute: VehicleRoute): Observable<VehicleRoute> {
  //   return this.http
  //     .post<VehicleRoute>(api.domain + `/api/vehicle-routes`, vehicleRoute)
  //     .pipe(catchError((error: any) => Observable.throw(error.json())));
  // }
  public addVehicleRoute(vehicleRoute: VehicleRoute): Observable<null> {
    return this.http
      .post<null>(api.domain + `/Routes`, vehicleRoute)
      .pipe(catchError((error: any) => Observable.throw(error.json())));
  }

  // public loadVehicleRoutes(): Observable<VehicleRoute[]> {
  //   return this.http
  //     .get<VehicleRoute[]>(api.domain + `/api/vehicle-routes`)
  //     .pipe(catchError((error: any) => Observable.throw(error.json())));
  // }
  public loadVehicleRoutes(): Observable<VehicleRoute[]> {
    return this.http.get<VehicleRoute[]>(api.domain + `/Routes`).pipe(
      map((objects: any[]) => {
        return objects.map((object: any): VehicleRoute => {
          return {
            ...object,
            isCircular: object.iscircular,
            stopIds: object.stopids
          };
        });
      }),
      catchError((error: any) => Observable.throw(error.json()))
    );
  }

  // public getNewVehicleRouteId(): Observable<number> {
  //   return this.http
  //     .get<VehicleRoute[]>(api.domain + '/api/vehicle-routes?_sort=id&_order=desc&_limit=1')
  //     .pipe(
  //       map((vehicleRoutes: VehicleRoute[]) => vehicleRoutes[0].id + 1),
  //       catchError((error: any) => Observable.throw(error.json()))
  //     );
  // }
  public getNewVehicleRouteId(): Observable<number> {
    return this.http
      .get<{ id: number }>(api.domain + '/Routes/Max')
      .pipe(
        map((idObject: { id: number }) => idObject.id + 1),
        catchError((error: any) => Observable.throw(error.json()))
      );
  }
}
