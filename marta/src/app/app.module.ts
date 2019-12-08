import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { ActionReducerMap, StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import * as fromRouter from '@ngrx/router-store';

import { MultiselectDropdownModule } from 'angular-4-dropdown-multiselect';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { ngfModule, ngf } from 'angular-file';

import * as fromComponents from './components';
import * as fromRootStore from './store';
import * as fromBackup from '../backup';
import * as fromVehicles from '../vehicles';
import * as fromStops from '../stops';
import * as fromSimulation from '../simulation';
import * as fromRiders from '../riders';
import * as fromVehicleRoutes from '../vehicle-routes';

const subComponents: any[] = [
  ...fromVehicles.components,
  ...fromStops.components,
  ...fromVehicleRoutes.components,
  ...fromSimulation.components,
  ...fromRiders.components,
  ...fromBackup.components
];

const subServices: any[] = [
  ...fromVehicles.services,
  ...fromStops.services,
  ...fromVehicleRoutes.services,
  ...fromSimulation.services,
  ...fromRiders.services,
  ...fromBackup.services
];

export interface ApplicationState {
  routerReducer: fromRouter.RouterReducerState<fromRootStore.RouterStateUrl>;
  vehicleReducer: fromVehicles.VehicleState;
  stopReducer: fromStops.StopState;
  vehicleRouteReducer: fromVehicleRoutes.VehicleRouteState;
  simulationReducer: fromSimulation.SimulationState;
}

export const reducers: ActionReducerMap<ApplicationState> = {
  routerReducer: fromRouter.routerReducer,
  vehicleReducer: fromVehicles.reducer,
  stopReducer: fromStops.reducer,
  vehicleRouteReducer: fromVehicleRoutes.reducer,
  simulationReducer: fromSimulation.reducer
};

export const effects = [
  fromVehicles.VehiclesEffects,
  fromStops.StopsEffects,
  fromVehicleRoutes.VehicleRoutesEffects,
  fromSimulation.SimulationEffects,
  fromRiders.RidersEffects,
  fromBackup.BackupEffects
];

const routes: Routes = [
  {
    path: '',
    component: fromComponents.DashboardComponent
  },
  {
    path: 'add-vehicle/:type',
    component: fromVehicles.VehicleFormComponent
  },
  {
    path: 'add-stop/:type',
    component: fromStops.StopFormComponent
  },
  {
    path: 'add-vehicle-route/:type',
    component: fromVehicleRoutes.VehicleRouteFormComponent
  },
  {
    path: 'add-rider',
    component: fromRiders.RiderFormComponent
  },
  {
    path: 'save-data-form',
    component: fromBackup.SaveFormComponent
  },
  {
    path: 'load-data-form',
    component: fromBackup.LoadFormComponent
  }
];

import { Directive, HostListener } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Directive({
    selector: 'input[type=file]',
    providers: [
        {provide: NG_VALUE_ACCESSOR, useExisting: FileValueAccessorDirective, multi: true}
    ]
})
export class FileValueAccessorDirective implements ControlValueAccessor {
    @HostListener('change', ['$event.target.files']) onChange = (_) => {};
    @HostListener('blur') onTouched = () => {};

    writeValue(value) {}
    registerOnChange(fn: any) { this.onChange = fn; }
    registerOnTouched(fn: any) { this.onTouched = fn; }
}

@NgModule({
  declarations: [
    ...fromComponents.components,
    ...subComponents,
    FileValueAccessorDirective
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MultiselectDropdownModule,
    RouterModule.forRoot(routes),
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot(effects),
    StoreDevtoolsModule.instrument(),
    fromRouter.StoreRouterConnectingModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    ngfModule
  ],
  providers: [
    {
      provide: fromRouter.RouterStateSerializer,
      useClass: fromRootStore.CustomSerializer
    },
    ...subServices
  ],
  bootstrap: [fromComponents.AppComponent]
})
export class AppModule {}
