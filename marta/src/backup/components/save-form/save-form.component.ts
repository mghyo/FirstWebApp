import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import * as fromServices from '../../services';

@Component({
    selector: 'app-save-form',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['./save-form.component.scss'],
    templateUrl: './save-form.component.html'
})
export class SaveFormComponent {
    public saveForm: FormGroup;

    tableControlInvalid: boolean;

    tableNames = [
        'vehicles',
        'routes',
        'stops'
    ];

    constructor(
        private router: Router,
        private formBuilder: FormBuilder,
        private backupStoreService: fromServices.BackupStoreService
    ) {
        this.saveForm = this.formBuilder.group({
            table: ['', Validators.required]
        });

        this.tableControlInvalid = false;
    }

    saveFiles(files: File[]): void {
        alert('Feature not ready yet!');
    }

    exitForm(): void {
        this.router.navigateByUrl('/');
    }
}
