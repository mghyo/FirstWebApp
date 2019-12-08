import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient, HttpEvent, HttpRequest, HttpResponse } from '@angular/common/http';

import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';

import * as fromServices from '../../services';

@Component({
    selector: 'app-load-form',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['./load-form.component.scss'],
    templateUrl: './load-form.component.html'
})
export class LoadFormComponent {
    public loadForm: FormGroup;

    tableControlInvalid: boolean;
    fileControlInvalid: boolean;

    tableNames = [
        'vehicles',
        'routes',
        'stops'
    ];

    // Upload file code
    sendableFormData: FormData;  // populated via ngfFormData directive
    accept = '*';
    files: File[] = [];
    progress: number;
    url = '...';
    hasBaseDropZoneOver = false;
    httpEmitter: Subscription;
    httpEvent: HttpEvent<Event>;
    // Upload file code

    constructor(
        private router: Router,
        private formBuilder: FormBuilder,
        private httpClient: HttpClient,
        private backupStoreService: fromServices.BackupStoreService
    ) {
        this.loadForm = this.formBuilder.group({
            file: ['', Validators.required],
            table: ['', Validators.required]
        });

        this.tableControlInvalid = false;
        this.fileControlInvalid = false;
    }

    uploadFiles(files: File[]): void {
        alert('Feature not ready yet!');
    }
    // uploadFiles(files: File[]): Subscription {
    //     const req = new HttpRequest<FormData>('POST', this.url, this.sendableFormData, {
    //       reportProgress: true
    //     });

    //     return this.httpEmitter = this.httpClient.request(req)
    //         .subscribe((event: any) => {
    //             this.httpEvent = event;

    //             if (event instanceof HttpResponse) {
    //                 delete this.httpEmitter;
    //                 console.log('request done', event);
    //             }
    //         },
    //         (error) => console.log('Error Uploading', error)
    //         );
    // }

    exitForm(): void {
        this.router.navigateByUrl('/');
    }
}
