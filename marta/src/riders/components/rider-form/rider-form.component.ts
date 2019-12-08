import { Component, OnDestroy } from '@angular/core';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';

import {
  IMultiSelectOption,
  IMultiSelectTexts,
  IMultiSelectSettings
} from 'angular-4-dropdown-multiselect';
import { debug } from 'util';

import { VehicleRoute, VehicleType, Stop, Rider } from '../../../models';
import * as fromRouteServices from '../../../vehicle-routes/services';
import * as fromRiderServices from '../../services';
import * as fromStopServices from '../../../stops/services';
import * as fromSimulationServices from '../../../simulation/services';

@Component({
  selector: 'app-rider-form',
  templateUrl: './rider-form.component.html',
  styleUrls: ['./rider-form.component.scss']
})
export class RiderFormComponent implements OnDestroy {
  private vehicleType: VehicleType;
  public riderForm: FormGroup;

  public stops: Stop[];
  public startingStops$: Subject<Stop[]>;
  public startingStopSelected: Stop;
  public endingStops$: Subject<Stop[]>;
  public endingStopIdSelected: number;
  public enableSubmit: boolean;

  public routes: VehicleRoute[];
  public routes$: Subject<VehicleRoute[]>;
  public routeSelected: VehicleRoute;

  private subscriptions: Subscription[];
  private selectedDateTime: Date;

  public routeTypeControlInvalid: boolean;
  public startingStopControlInvalid: boolean;
  public endingStopControlInvalid: boolean;
  public routeControlInvalid: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private stopStoreService: fromStopServices.StopStoreService,
    private vehicleRouteStoreService: fromRouteServices.VehicleRouteStoreService,
    private simulationStoreService: fromSimulationServices.SimulationStoreService,
    private riderStoreService: fromRiderServices.RiderStoreService
  ) {
    this.createForm();
    this.enableSubmit = false;
    this.subscriptions = [];

    this.routes = [];
    this.stops = [];
    this.routes$ = new Subject<VehicleRoute[]>();
    this.startingStops$ = new Subject<Stop[]>();
    this.endingStops$ = new Subject<Stop[]>();

    this.routeTypeControlInvalid = false;
    this.startingStopControlInvalid = false;
    this.endingStopControlInvalid = false;
    this.routeControlInvalid = false;

    this.subscriptions.push(
      this.vehicleRouteStoreService
        .getVehicleRoutes$()
        .subscribe((vehicleRoutes: VehicleRoute[]) => {
          this.routes = vehicleRoutes;
        })
    );
    this.subscriptions.push(
      this.stopStoreService.getStops$().subscribe((stops: Stop[]) => {
        this.stops = stops;
      })
    );
    this.subscriptions.push(
      this.simulationStoreService.getDateTime$().subscribe((datetime: Date) => this.selectedDateTime = datetime)
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) =>
      subscription.unsubscribe()
    );
  }

  private createForm() {
    this.riderForm = this.formBuilder.group({
      routeType: ['', Validators.required],
      routeId: ['', Validators.required],
      startingStopId: ['', Validators.required],
      endingStopId: ['', Validators.required]
    });
  }

  public onRouteTypeChange(routeType: string): void {
    this.enableSubmit = false;
    this.vehicleType = parseInt(routeType, 10);
    this.routes$.next(
      this.routes.filter(
        (route: VehicleRoute) => route.type === this.vehicleType
      )
    );
  }

  public onRouteChange(routeId: string): void {
    this.enableSubmit = false;

    this.routeSelected = this.routes.find((route: VehicleRoute) => {
      return route.id === parseInt(routeId, 10);
    });

    this.startingStops$.next(
      this.stops.filter((stop: Stop) => {
        return (
          this.routeSelected.stopIds.includes(stop.id) &&
          stop.type === this.vehicleType
        );
      })
    );
  }

  public onStartingStopChange(stopId: string): void {
    this.enableSubmit = false;

    this.startingStopSelected = this.stops.find((stop: Stop) => {
      return stop.id === parseInt(stopId, 10);
    });

    const routeStops = this.stops.filter((stop: Stop) => {
      return (
        this.routeSelected.stopIds.includes(stop.id) &&
        stop.type === this.vehicleType
      );
    });

    this.endingStops$.next(
      routeStops.filter((stop: Stop) => {
        if (!this.startingStopSelected) {
          return false;
        }
        return stop.id !== this.startingStopSelected.id;
      })
    );
  }

  public onEndingStopChange(stopId: string): void {
    this.endingStopIdSelected = parseInt(stopId, 10);
    this.enableSubmit = true;
  }

  public cancelForm(): void {
    this.router.navigateByUrl('');
  }

  public createRider(): void {
    if (this.riderForm.valid) {
      this.routeTypeControlInvalid = false;
      this.startingStopControlInvalid = false;
      this.endingStopControlInvalid = false;
      this.routeControlInvalid = false;

      this.riderStoreService.addRider({
        id: undefined,
        stopArrivalDateTime: this.selectedDateTime,
        atStopId: this.startingStopSelected.id,
        beginningStopId: this.startingStopSelected.id,
        endStopId: this.endingStopIdSelected,
        routeId: this.routeSelected.id
      });

      this.router.navigateByUrl('');
    }
  }
}
