import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import * as fromServices from '../../services';
import { Stop, VehicleType } from '../../../models';

@Component({
  selector: 'app-stop-form',
  styleUrls: ['./stop-form.component.scss'],
  templateUrl: './stop-form.component.html'
})
export class StopFormComponent implements OnInit {
  private vehicleName: string;
  private typeStop: number;
  public model: Stop = {};
  submitted = false;

  constructor(
    private stopStoreService: fromServices.StopStoreService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.typeStop = parseInt(this.route.snapshot.params['type'], 10);
    // I used === but it's evaluating to false all the time, so changed to == for now
    if (this.typeStop === VehicleType.BUS) {
      this.vehicleName = 'Bus';
      this.model.type = VehicleType.BUS;
    } else if (this.typeStop === VehicleType.TRAIN) {
      this.vehicleName = 'Train';
      this.model.type = VehicleType.TRAIN;
    } else {
      alert('Invalid Stop type');
      this.router.navigateByUrl('');
    }
  }

  public onSubmit() {
    this.submitted = true;
    // need to confirm whether we need to call service or store
    this.stopStoreService.addStop(this.model);
    this.router.navigateByUrl('');
  }

  public cancelForm(): void {
    this.router.navigateByUrl('');
  }
}
