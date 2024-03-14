import {AppConsts} from "@shared/AppConsts";
import { Component, ViewChild, Injector, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { GetVendorSLAForViewDto, VendorSLADto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
    selector: 'viewVendorSLAModal',
    templateUrl: './view-vendorSLA-modal.component.html'
})
export class ViewVendorSLAModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    item: GetVendorSLAForViewDto;


    constructor(
        injector: Injector
    ) {
        super(injector);
        this.item = new GetVendorSLAForViewDto();
        this.item.vendorSLA = new VendorSLADto();
    }

    show(item: GetVendorSLAForViewDto): void {
        this.item = item;
        this.active = true;
        this.modal.show();
    }
    
    

    close(): void {
        this.active = false;
        this.modal.hide();
    }
}
