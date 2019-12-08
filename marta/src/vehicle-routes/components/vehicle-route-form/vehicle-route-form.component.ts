import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormArray,
  FormBuilder,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { map } from 'rxjs/operators';

import {
  IMultiSelectOption,
  IMultiSelectTexts,
  IMultiSelectSettings
} from 'angular-4-dropdown-multiselect';

import { VehicleRoute, VehicleType, Stop } from '../../../models';
import * as fromServices from '../../services';
import * as fromStopServices from '../../../stops/services';
import { isUndefined } from 'util';

@Component({
  selector: 'app-vehicle-route',
  templateUrl: './vehicle-route-form.component.html',
  styleUrls: ['./vehicle-route-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VehicleRouteFormComponent implements OnInit, OnDestroy {
  public vehicleName: string;
  public dropdownModel: number[];
  public vehicleRouteForm: FormGroup;

  public stops$: Observable<Stop[]>;
  public stopList$: Subject<string[]>;

  private stopsOfCorrectType: Stop[];
  private routeType: VehicleType;
  private subscriptions: Subscription[];

  // Settings configuration
  public mySettings: IMultiSelectSettings;
  // Text configuration
  public myTexts: IMultiSelectTexts;
  // Dropdown options
  public myOptions: IMultiSelectOption[];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private stopStoreService: fromStopServices.StopStoreService,
    private vehicleRouteStoreService: fromServices.VehicleRouteStoreService
  ) {
    this.vehicleRouteForm = this.formBuilder.group({
      name: ['', Validators.required],
      isCircular: ['', Validators.required],
      selectedStopsValues: [[], Validators.required]
    });

    this.mySettings = {
      enableSearch: true,
      checkedStyle: 'checkboxes',
      buttonClasses: 'btn btn-outline-info',
      dynamicTitleMaxItems: 3,
      displayAllSelectedText: true,
      showCheckAll: true,
      closeOnClickOutside: true,
      ignoreLabels: true
    };
    this.myTexts = {
      checkAll: 'Select all',
      uncheckAll: 'Unselect all',
      checked: 'item selected',
      checkedPlural: 'items selected',
      searchPlaceholder: 'Find a stop',
      searchEmptyResult: 'Nothing found...',
      searchNoRenderText: 'Type in search box to see results...',
      defaultTitle: 'Select',
      allSelected: 'All selected'
    };
    this.subscriptions = [];
    this.stopList$ = new Subject<string[]>();
  }

  ngOnInit() {
    this.routeType = parseInt(this.route.snapshot.params['type'], 10);

    if (this.routeType === VehicleType.BUS) {
      this.stops$ = this.stopStoreService.getBusStops$();
      this.vehicleName = 'Bus';
    } else if (this.routeType === VehicleType.TRAIN) {
      this.stops$ = this.stopStoreService.getTrainStops$();
      this.vehicleName = 'Train';
    } else {
      alert('Invalid Stop type');
    }

    this.subscriptions.push(
      this.stops$.subscribe((entities: { [id: number]: Stop }) => {
        this.myOptions = Object.keys(entities).map((key: string) => {
          return {
            id: entities[parseInt(key, 10)].id,
            name: entities[parseInt(key, 10)].name
          };
        });
        this.stopsOfCorrectType = Object.keys(entities).map((key: string) => {
          return entities[parseInt(key, 10)];
        });
      })
    );

    // Next step: extract all the ids and name from the routeStops$
    // create a new array that have only id and name to match interface
    // of selectors.
    // e.g : newRouteStops= [ { id:1 , name: mystop1 }, { id:2, name: myStop2} ].
    // this.vehicleRouteForm = this.formBuilder.group({
    //   name: ['', Validators.required],
    //   isCircular: ['', Validators.required],
    //   selectedStopsValues: ['', Validators.required]
    // });
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription: Subscription) =>
      subscription.unsubscribe()
    );
  }

  public updateStopList(ids: number[]): void {
    if (ids && ids.length) {
      const selectedStopNames = ids.map((id: number) => {
        return this.stopsOfCorrectType.find((stop: Stop) => stop.id === id).name;
      });
      this.stopList$.next(selectedStopNames);
    }
  }

  public cancelForm(): void {
    this.router.navigateByUrl('');
  }

  public createVehicleRoute(form: FormGroup) {
    const { value, valid } = form;

    if (valid && !this.stopControlInvalid) {
      this.vehicleRouteStoreService.addVehicleRoute({
        id: undefined,
        type: this.routeType,
        name: value.name,
        isCircular: value.isCircular === 'true',
        stopIds: this.getSelectedStopIds()
      });
      this.router.navigateByUrl('');
    }
  }

  private getSelectedStopIds(): number[] {
    if (isUndefined(this.vehicleRouteForm.value.selectedStopsValues)) {
      return [];
    }

    return this.vehicleRouteForm.value.selectedStopsValues.map((id: number) => {
      return this.stopsOfCorrectType.find((stop: Stop) => stop.id === id).id;
    });
  }

  get nameControl() {
    return this.vehicleRouteForm.get('name') as FormControl;
  }

  get nameControlInvalid() {
    return this.nameControl.hasError('required') && this.nameControl.touched;
  }

  get circularControl() {
    return this.vehicleRouteForm.get('isCircular') as FormControl;
  }

  get circularControlInvalid() {
    return (
      this.circularControl.hasError('required') && this.circularControl.touched
    );
  }

  get stopControl() {
    return this.vehicleRouteForm.get('selectedStopsValues') as FormControl;
  }

  get stopControlInvalid() {
    if (this.stopControl.hasError('required') && this.stopControl.touched) {
      return true;
    }
    return this.getSelectedStopIds().length < 2 && this.stopControl.touched;
  }
}
