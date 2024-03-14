import { Component, ViewChild, Injector, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { BankDetailsDto, EditVendorBeneficiaryAccountProfileInput, EditVendorContactInput, EditVendorEmailAndPhoneNumberInput, EditVendorForeignAccountInput, EditVendorInput, GetVendorForViewDto, GetVendorForViewOutput, VendorDto, VendorsServiceProxy, VendorSubCategoryDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
    selector: 'viewVendorModal',
    templateUrl: './view-vendor-modal.component.html'
})
export class ViewVendorModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    item: GetVendorForViewDto;
    items: GetVendorForViewOutput;
    vendor: EditVendorInput = new EditVendorInput();
    Questionarelist: any;
    userBankProfile: EditVendorBeneficiaryAccountProfileInput = new EditVendorBeneficiaryAccountProfileInput();
    vendorEmailAndPhoneNumberDto: EditVendorEmailAndPhoneNumberInput = new EditVendorEmailAndPhoneNumberInput();
    vendorContactDetailsDto: EditVendorContactInput = new EditVendorContactInput();
    vendorForeignAccountDto: EditVendorForeignAccountInput = new EditVendorForeignAccountInput();
    vendorContactDetailsList: any;
    vendorEmailAndPhoneNumberList: any;
    vendorForeignAccountDtoList: any;
    SubCategory: VendorSubCategoryDto[] = [];

    constructor(
        injector: Injector,
        private _vendorsServiceProxy: VendorsServiceProxy,
    ) {
        super(injector);
        this.item = new GetVendorForViewDto();
        this.items = new GetVendorForViewOutput();
        this.item.vendor = new VendorDto();  
        this.items.bankProfile = new EditVendorBeneficiaryAccountProfileInput();
        //this.items.extraContatPerson = new EditVendorContactInput[];

    }

    show(vendorId): void {
        debugger;       
          this._vendorsServiceProxy.getVendorForModification(vendorId).subscribe(result => {
            this.vendor = result.vendor;
            this.userBankProfile = result.bankProfile;
            this.Questionarelist = result.questResponse;
            this.vendorContactDetailsList = result.extraContatPerson;
            this.vendorEmailAndPhoneNumberList = result.extraEmailAndPhone;
            this.vendorForeignAccountDtoList = result.extraForeignAccount;
    
            // if ( this.vendorContactDetailsList) {
            //   this.isAddMoreContactDetails = this.vendorForeignAccountDtoList.length;
            // }
            // if ( this.vendorEmailAndPhoneNumberList) {
            //   this.isAddMoreEmailDetails = this.vendorForeignAccountDtoList.length;
            // }
            // if ( this.vendorForeignAccountDtoList) {
            //   this.isAddMoreForeignDetails = this.vendorForeignAccountDtoList.length;
            // }
            if (this.vendor.vendorCategoryId != null) {
              this.getVenSubCategory(this.vendor.vendorCategoryId);
            }
            this.active = true;
            this.modal.show();
          });
      }
    // show(item: GetVendorForViewDto): void {
    //     debugger;
    //     this.item = item;
    //     this.active = true;
    //     this.modal.show();
    // }

    getVenSubCategory(vcid) {
        this.SubCategory = [];
        this._vendorsServiceProxy.getVendorSubCatByCatId(vcid).subscribe((result: any) => {
          this.SubCategory = result;
        });
      }

    close(): void {
        this.active = false;
        this.modal.hide();
    }
}
