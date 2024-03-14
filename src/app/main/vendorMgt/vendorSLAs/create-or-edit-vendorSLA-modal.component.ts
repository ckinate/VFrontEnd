import { Component, ViewChild, Injector, Output, EventEmitter, OnInit} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';
import { VendorSLAsServiceProxy, CreateOrEditVendorSLADto,
    VendorSLAVendorLookupTableDto,
    VendorSLADepartmentLookupTableDto,
    VendorSLACurrencyLookupTableDto,
    VendorSLAContractTypeLookupTableDto,
    VendorDto,
    VendorsServiceProxy
} from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as moment from 'moment';
import { DateTime } from 'luxon';



@Component({
    selector: 'createOrEditVendorSLAModal',
    templateUrl: './create-or-edit-vendorSLA-modal.component.html'
})
export class CreateOrEditVendorSLAModalComponent extends AppComponentBase implements OnInit {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    vendorSLA: CreateOrEditVendorSLADto = new CreateOrEditVendorSLADto();

    vendorCompanyName = '';
    departmentName = '';
    currencyCurrencyName = '';
    contractTypeDescription = '';
    date = new Date();
    allVendors: VendorSLAVendorLookupTableDto[];
    allDepartments: VendorSLADepartmentLookupTableDto[];
    allCurrencys: VendorSLACurrencyLookupTableDto[];
    allContractTypes: VendorSLAContractTypeLookupTableDto[];
    vendorList: VendorDto[];

    constructor(
        injector: Injector,
        private _vendorSLAsServiceProxy: VendorSLAsServiceProxy,
        private _vendorsServiceProxy: VendorsServiceProxy
    ) {
        super(injector);
    }
//     ngOnInit(): void {
//     this.getApprovedVendors();
// }
    show(vendorSLAId?: number): void {


        if (!vendorSLAId) {
            this.vendorSLA = new CreateOrEditVendorSLADto();
            this.vendorSLA.id = vendorSLAId;
            this.vendorSLA.commencementDate = DateTime.local();
            this.vendorSLA.reminder = DateTime.local();
            this.vendorCompanyName = '';
            this.departmentName = '';
            this.currencyCurrencyName = '';
            this.contractTypeDescription = '';


            this.active = true;
            this.modal.show();
        } else {
            this._vendorSLAsServiceProxy.getVendorSLAForEdit(vendorSLAId).subscribe(result => {
                this.vendorSLA = result.vendorSLA;

                this.vendorCompanyName = result.vendorCompanyName;
                this.departmentName = result.departmentName;
                this.currencyCurrencyName = result.currencyCurrencyName;
                this.contractTypeDescription = result.contractTypeDescription;


                this.active = true;
                this.modal.show();
            });
        }
        this.getApprovedVendors();
        // this._vendorSLAsServiceProxy.getAllVendorForTableDropdown().subscribe(result => {
        //     this.allVendors = result;
        // });
        // this._vendorSLAsServiceProxy.getAllDepartmentForTableDropdown().subscribe(result => {
        //     this.allDepartments = result;
        // });
        this._vendorSLAsServiceProxy.getAllCurrencyForTableDropdown().subscribe(result => {
            this.allCurrencys = result;
        });
        this._vendorSLAsServiceProxy.getAllContractTypeForTableDropdown().subscribe(result => {
            this.allContractTypes = result;
        });
    }
    getApprovedVendors() {
        this._vendorsServiceProxy.getAllAprrovedVendors().subscribe(item => {
          this.vendorList = item;
          console.log(this.vendorList);
        });
      }

    save(): void {
            this.saving = true;
            this._vendorSLAsServiceProxy.createOrEdit(this.vendorSLA)
             .pipe(finalize(() => { this.saving = false; }))
             .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.close();
                this.modalSave.emit(null);
             });
    }













    close(): void {
        this.active = false;
        this.modal.hide();
    }

     ngOnInit(): void {

     }
}
