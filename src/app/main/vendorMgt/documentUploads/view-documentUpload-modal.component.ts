﻿import { Component, ViewChild, Injector, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { GetDocumentUploadForViewDto, DocumentUploadDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
    selector: 'viewDocumentUploadModal',
    templateUrl: './view-documentUpload-modal.component.html'
})
export class ViewDocumentUploadModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    item: GetDocumentUploadForViewDto;


    constructor(
        injector: Injector
    ) {
        super(injector);
        this.item = new GetDocumentUploadForViewDto();
        this.item.documentUpload = new DocumentUploadDto();
    }

    show(item: GetDocumentUploadForViewDto): void {
        this.item = item;
        this.active = true;
        this.modal.show();
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }
}
