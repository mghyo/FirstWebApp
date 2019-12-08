import { Component } from '@angular/core';

import { VehicleType } from '../../../models';

@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.scss']
})
export class TablesComponent {
  public busType = VehicleType.BUS;
  public trainType = VehicleType.TRAIN;

  constructor() {}
}
