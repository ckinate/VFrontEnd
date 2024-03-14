import {AppConsts} from '@shared/AppConsts';
import { Component, Injector, ViewEncapsulation, ViewChild } from '@angular/core';
import { ActivatedRoute , Router} from '@angular/router';
import { VendorSLAsServiceProxy, VendorSLADto  } from '@shared/service-proxies/service-proxies';
import { NotifyService } from 'abp-ng2-module';
import { AppComponentBase } from '@shared/common/app-component-base';
import { TokenAuthServiceProxy } from '@shared/service-proxies/service-proxies';
import { CreateOrEditVendorSLAModalComponent } from './create-or-edit-vendorSLA-modal.component';

import { ViewVendorSLAModalComponent } from './view-vendorSLA-modal.component';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Table } from 'primeng/table';
import { Paginator } from 'primeng/paginator';
import { LazyLoadEvent } from 'primeng/public_api';
import { FileDownloadService } from '@shared/utils/file-download.service';
import * as _ from 'lodash';
import * as moment from 'moment';


@Component({
    templateUrl: './vendorSLAs.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class VendorSLAsComponent extends AppComponentBase {
    @ViewChild('createOrEditVendorSLAModal', { static: true }) createOrEditVendorSLAModal: CreateOrEditVendorSLAModalComponent;
    @ViewChild('viewVendorSLAModalComponent', { static: true }) viewVendorSLAModal: ViewVendorSLAModalComponent;
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;

    advancedFiltersAreShown = false;
    filterText = '';
        vendorCompanyNameFilter = '';
        departmentNameFilter = '';
        currencyCurrencyNameFilter = '';
        contractTypeDescriptionFilter = '';
        SlaNumber = '';
        VendorSlaStatus = 2;
        vendorSLA: VendorSLADto = new VendorSLADto();


    constructor(
        injector: Injector,
        private _vendorSLAsServiceProxy: VendorSLAsServiceProxy,
        private _notifyService: NotifyService,
        private _tokenAuth: TokenAuthServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private _fileDownloadService: FileDownloadService
    ) {
        super(injector);
    }

    getVendorSLAs(event?: LazyLoadEvent) {
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);
            return;
        }

        this.primengTableHelper.showLoadingIndicator();

        this._vendorSLAsServiceProxy.getAll(
            this.filterText,
            this.vendorCompanyNameFilter,
            this.VendorSlaStatus,
            this.SlaNumber,
            this.departmentNameFilter,
            this.currencyCurrencyNameFilter,
            this.contractTypeDescriptionFilter,
            this.primengTableHelper.getSorting(this.dataTable),
            this.primengTableHelper.getSkipCount(this.paginator, event),
            this.primengTableHelper.getMaxResultCount(this.paginator, event)
        ).subscribe(result => {
            this.primengTableHelper.totalRecordsCount = result.totalCount;
            this.primengTableHelper.records = result.items;
            this.primengTableHelper.hideLoadingIndicator();
            console.log(result);
        });

    }

    reloadPage(): void {
        this.paginator.changePage(this.paginator.getPage());
    }

    createVendorSLA(): void {
        this.createOrEditVendorSLAModal.show();
    }


    deleteVendorSLA(vendorSLA: VendorSLADto): void {
        this.message.confirm(
            '',
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this._vendorSLAsServiceProxy.delete(vendorSLA.id)
                        .subscribe(() => {
                            this.reloadPage();
                            this.notify.success(this.l('SuccessfullyDeleted'));
                        });
                }
            }
        );
    }

    changeStatus(record: VendorSLADto, status: string) {
        this._vendorSLAsServiceProxy.statusChange(record).subscribe((result) => {
            if (status === 'Active') {
                this.notify.info(this.l('Activated Successfully'));
            } else {
                this.notify.info(this.l('Paused Successfully'));
            }
            this.getVendorSLAs();
        });
    }
    exportToExcel(): void {
        this._vendorSLAsServiceProxy.getVendorSLAsToExcel(
        this.filterText,
            this.vendorCompanyNameFilter,
            this.departmentNameFilter,
            this.currencyCurrencyNameFilter,
            this.contractTypeDescriptionFilter,
        )
        .subscribe(result => {
            this._fileDownloadService.downloadTempFile(result);
         });
    }




}
