import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

import * as fromServices from '../../services';
import * as fromStopServices from '../../../stops/services';
import * as fromRouteServices from '../../../vehicle-routes/services';
import { VehicleRoute, VehicleType, Stop } from '../../../models';

@Component({
    selector: 'app-vehicle-form',
    styleUrls: ['./vehicle-form.component.scss'],
    templateUrl: './vehicle-form.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class VehicleFormComponent implements OnInit, OnDestroy {
    public vehicleForm: FormGroup;
    public stops: Stop[];
    public subscriptions: Subscription[];

    public routes$: Observable<VehicleRoute[]>;
    public routes: VehicleRoute[];
    public routeSelected: VehicleRoute;

    public startingStops$: Subject<Stop[]>;
    public startingStopSelected: Stop;

    public nextStops$: Subject<Stop[]>;
    public nextStopIdSelected: number;

    public enableSubmit: boolean;

    public routeControlInvalid: boolean;
    public startingStopControlInvalid: boolean;
    public nextStopControlInvalid: boolean;
    public capacityControlInvalid: boolean;

    private vehicleType: VehicleType;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private vehicleStoreService: fromServices.VehicleStoreService,
        private routeStoreService: fromRouteServices.VehicleRouteStoreService,
        private stopStoreService: fromStopServices.StopStoreService,
    ) {
        this.createForm();
        this.enableSubmit = false;

        this.startingStops$ = new Subject<Stop[]>();
        this.nextStops$ = new Subject<Stop[]>();
        this.subscriptions = [];
        this.stops = [];

        this.routeControlInvalid = false;
        this.startingStopControlInvalid = false;
        this.nextStopControlInvalid = false;
        this.capacityControlInvalid = false;
    }

    ngOnInit() {
        this.vehicleType = parseInt(this.route.snapshot.params['type'], 10);

        if (this.vehicleType === VehicleType.BUS) {
            this.routes$ = this.routeStoreService.getBusRoutes$();
            this.subscriptions.push(this.stopStoreService.getBusStops$().subscribe((stops: Stop[]) => {
                this.stops = stops;
            }));
        } else if (this.vehicleType === VehicleType.TRAIN) {
            this.routes$ = this.routeStoreService.getTrainRoutes$();
            this.subscriptions.push(this.stopStoreService.getTrainStops$().subscribe((stops: Stop[]) => {
                this.stops = stops;
            }));
        }

        this.subscriptions.push(this.routes$.subscribe((routes: VehicleRoute[]) => {
            this.routes = routes;
        }));
    }

    ngOnDestroy() {
        this.subscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
    }

    private createForm() {
        this.vehicleForm = this.formBuilder.group({
            vehicleRouteId: ['', Validators.required],
            startingStopId: ['', Validators.required],
            nextStopId: ['', Validators.required],
            capacity: ['', Validators.required]
        });
    }

    public onRouteChange(routeId: string): void {
        this.enableSubmit = false;
        this.routeSelected = this.routes.find((route: VehicleRoute) => {
            return route.id === parseInt(routeId, 10);
        });
        this.startingStops$.next(this.stops.filter((stop: Stop) => {
            if (this.routeSelected) {
                return this.routeSelected.stopIds.includes(stop.id);
            }
            return false;
        }));
    }

    public onStartingStopChange(stopId: string): void {
        this.enableSubmit = false;
        this.startingStopSelected = this.stops.find((stop: Stop) => {
            return stop.id === parseInt(stopId, 10);
        });
        this.nextStops$.next(this.stops.filter((stop: Stop) => {
            if (!this.startingStopSelected) { return false; }

            if (this.routeSelected.isCircular && this.routeSelected.stopIds.length > 2) {
                return this.isAdjacentStopForCircularRoute(stop, this.routeSelected.stopIds, parseInt(stopId, 10));
            } else {
                return this.isAdjacentStopForLinearRoute(stop, this.routeSelected.stopIds, parseInt(stopId, 10));
            }
        }));
    }

    public onNextStopChange(stopId: string): void {
        this.nextStopIdSelected = parseInt(stopId, 10);
        this.enableSubmit = true;
    }

    public cancelForm(): void {
        this.router.navigateByUrl('');
    }

    public createVehicle(): void {
        if (this.vehicleForm.valid) {
            this.routeControlInvalid = false;
            this.startingStopControlInvalid = false;
            this.nextStopControlInvalid = false;
            this.capacityControlInvalid = false;
            this.vehicleStoreService.addVehicle({
                type: this.vehicleType,
                id: undefined,
                routeId: this.routeSelected.id,
                nextStopId: this.nextStopIdSelected,
                currentStopId: this.startingStopSelected.id,
                atStop: true,
                capacity: this.vehicleForm.value.capacity,
                minutesTillArrival: 0,
                minutesTillDeparting: 0,
                traverseStopsUp: this.areStopsTraversedUp(),
                riderIds: []
            });
            this.router.navigateByUrl('');
        } else {
            this.capacityControlInvalid = true;
        }
    }

    public getVehicleString(): string {
        return this.vehicleType === VehicleType.BUS ? 'Bus' : 'Train';
    }

    private getIndexOfSelectedStopInRoute(routeStopIds: number[], stopId: number): number {
        return routeStopIds.findIndex((id: number) => id === stopId);
    }

    private isAdjacentStopForCircularRoute(stop: Stop, routeStopIds: number[], selectedStopId: number): boolean {
        const indexOfSelectedStop = this.getIndexOfSelectedStopInRoute(routeStopIds, selectedStopId);
        if (indexOfSelectedStop === 0) {
            const foundOne = stop.id === this.routeSelected.stopIds[indexOfSelectedStop + 1];
            const foundTwo = stop.id === this.routeSelected.stopIds[routeStopIds.length - 1];
            return foundOne || foundTwo;
        } else if (indexOfSelectedStop === routeStopIds.length) {
            const foundOne = stop.id === this.routeSelected.stopIds[0];
            const foundTwo = stop.id === this.routeSelected.stopIds[routeStopIds.length - 1];
            return foundOne || foundTwo;
        } else {
            const foundOne = stop.id === this.routeSelected.stopIds[indexOfSelectedStop - 1];
            const foundTwo = stop.id === this.routeSelected.stopIds[indexOfSelectedStop + 1];
            return foundOne || foundTwo;
        }
    }

    private isAdjacentStopForLinearRoute(stop: Stop, routeStopIds: number[], selectedStopId: number): boolean {
        const indexOfSelectedStop = this.getIndexOfSelectedStopInRoute(routeStopIds, selectedStopId);
        if (indexOfSelectedStop === 0) {
            return stop.id === this.routeSelected.stopIds[1];
        } else if (indexOfSelectedStop === routeStopIds.length) {
            return stop.id === this.routeSelected.stopIds[routeStopIds.length - 2];
        } else {
            const foundOne = stop.id === this.routeSelected.stopIds[indexOfSelectedStop - 1];
            const foundTwo = stop.id === this.routeSelected.stopIds[indexOfSelectedStop + 1];
            return foundOne || foundTwo;
        }
    }

    private areStopsTraversedUp(): boolean {
        const indexOfStartingStop = this.getIndexOfSelectedStopInRoute(this.routeSelected.stopIds, this.startingStopSelected.id);
        const indexOfNextStop = this.getIndexOfSelectedStopInRoute(this.routeSelected.stopIds, this.nextStopIdSelected);
        return indexOfStartingStop < indexOfNextStop;
    }
}
