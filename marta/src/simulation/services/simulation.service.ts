import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { catchError, map } from 'rxjs/operators';
// import { Subject } from 'rxjs/Subject';

import { api } from '../../api';

@Injectable()
export class SimulationService {
  // subjectDate1 = new Subject<Date>();
  // subjectDate2 = new Subject<Date>();
  // subjectNumber = new Subject<number>();
  constructor(private http: HttpClient) {}

  // public loadDatetime(): Observable<Date> {
  //   this.delayDate1();
  //   return this.subjectDate1;
  // }
  public loadDatetime(): Observable<Date> {
    return this.http.get<{ date: string }>(api.domain + `/SimDate`).pipe(
      map((dateObject: { date: string }) => {
        return new Date(dateObject.date);
      }),
      catchError((error: any) => Observable.throw(error))
    );
  }

  // public updateDatetime(date: Date): Observable<Date> {
  //   this.delayDate2();
  //   return this.subjectDate2;
  // }
  public updateDatetime(date: Date): Observable<null> {
    return this.http
      .post<null>(api.domain + `/SimDate`, date)
      .pipe(catchError((error: any) => Observable.throw(error.json())));
  }

  // public step(stepDurationMinutes: number): Observable<number> {
  //   this.delayNumber();
  //   return this.subjectNumber;
  // }
  public step(stepDurationMinutes: number): Observable<null> {
    return this.http
      .post<null>(api.domain + `/SimStep/${stepDurationMinutes}`, null)
      .pipe(catchError((error: any) => Observable.throw(error.json())));
  }

  // private delayDate1(): void {
  //   setTimeout(() => {
  //     this.subjectDate1.next(new Date());
  //   }, 1000);
  // }

  // private delayDate2(): void {
  //   setTimeout(() => {
  //     this.subjectDate2.next(new Date());
  //   }, 1000);
  // }

  // private delayNumber(): void {
  //   setTimeout(() => {
  //     this.subjectNumber.next(0);
  //   }, 1000);
  // }
}
