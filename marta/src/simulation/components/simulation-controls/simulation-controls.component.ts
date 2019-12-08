import { Component, ChangeDetectionStrategy, ViewChild, ElementRef } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import * as fromServices from '../../services';

@Component({
    selector: 'app-simulation-controls',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['./simulation-controls.component.scss'],
    templateUrl: './simulation-controls.component.html'
})
export class SimulationControlsComponent {
    running$: Observable<boolean>;
    stepping$: Observable<boolean>;
    disabled$: Observable<boolean>;
    steps$: Observable<number>;
    dateTime$: Observable<Date>;

    selectedDateTime: Date;
    steps: number;
    runContinuous: boolean;
    stepDurationMinutes: number;

    @ViewChild('dateTime') private dateTime: ElementRef;

    constructor(
        private simulationStoreService: fromServices.SimulationStoreService
    ) {
        this.running$ = this.simulationStoreService.getRunning$();
        this.stepping$ = this.simulationStoreService.getStepping$();
        this.disabled$ = this.simulationStoreService.getDisabled$();
        this.steps$ = this.simulationStoreService.getSteps$();
        this.dateTime$ = this.simulationStoreService.getDateTime$();

        this.runContinuous = true;
    }

    public dateChange() {
        const value = new Date(this.dateTime.nativeElement.value);
        this.simulationStoreService.updateDatetime(value);
    }

    onStepClick(): void {
        if (this.isStepDurationValid()) {
            this.simulationStoreService.step(this.stepDurationMinutes);
        } else {
            this.showDurationError('Must have an integer duration over 0!');
        }
    }

    onRunToggle(running: string): void {
        if (running === 'true') {
            this.simulationStoreService.pause();
        } else if (this.runContinuous) {
            this.playContinuous();
        } else {
            this.playInterval();
        }
    }

    getButtonClass(running: string): string {
        if (running === 'true') {
            return 'fa-pause';
        } else {
            return 'fa-play';
        }
    }

    private showDurationError(message: string): void {
        alert(message);
    }

    private playContinuous(): void {
        if (this.isStepDurationValid()) {
            this.simulationStoreService.playContinuous(this.stepDurationMinutes);
        } else {
            this.showDurationError('Must have an integer duration over 0!');
        }
    }

    private playInterval(): void {
        if (this.stepDurationMinutes > 0 && this.steps > 0) {
            this.simulationStoreService.playInterval(this.stepDurationMinutes, this.steps);
        } else if (!(this.isStepDurationValid() || this.isStepCountValid())) {
            this.showDurationError('Must have an integer duration and integer number of steps over 0!');
        } else if (!this.isStepDurationValid()) {
            this.showDurationError('Must have an integer duration over 0!');
        } else {
            this.showDurationError('Must have an integer number of steps over 0!');
        }
    }

    private isStepDurationValid(): boolean {
        return this.stepDurationMinutes && this.stepDurationMinutes >= 0;
    }

    private isStepCountValid(): boolean {
        return this.steps && this.steps >= 0;
    }
}
