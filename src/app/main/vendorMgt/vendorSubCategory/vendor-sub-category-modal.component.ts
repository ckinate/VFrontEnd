import { Component, EventEmitter, Injector, OnInit, Output, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { VendorsServiceProxy, VendorCategoryDto, VendorSubCategoryDto } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/internal/operators/finalize';

@Component({
  selector: 'vendorsubcategorymodal',
  templateUrl: './vendor-sub-category-modal.component.html',
})
export class VendorSubCategoryModalComponent extends AppComponentBase implements OnInit {
  @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;

  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
  VCategory: VendorCategoryDto[];
  active = false;
  saving = false;
  narration = '';
  vendorSubCatgory: VendorSubCategoryDto = new VendorSubCategoryDto();
  constructor(
    injector: Injector,
    private _vendor: VendorsServiceProxy,

  ) {
    super(injector);
   }

  ngOnInit(): void {
  }
  show(SCategoryId?: number) {
    if (!SCategoryId) {
      this.vendorSubCatgory = new VendorSubCategoryDto();
      this.vendorSubCatgory.id = SCategoryId;
     this.narration = '';
      this.active = true;
      this.modal.show();
  } else {
      this._vendor.getSubCategoryForEdit(SCategoryId).subscribe(result => {
          this.vendorSubCatgory = result.vendorSubCategory;
          this.narration = result.categoryName;
          this.active = true;
          this.modal.show();
      });
  }
    this._vendor.getAllVCForTableDropdown().subscribe(result => {
      this.VCategory = result;
    });
    this.active = true;
    this.modal.show();
  }
  save() {

    this.message.confirm(this.l('ProceedToCreateSetup'),
      this.l('AreYouSure'),
      isConfirmed => {
        if (isConfirmed) {
          this.vendorSubCatgory.tenantId = this.appSession.tenantId;
          this._vendor.createOrEditSubCat(this.vendorSubCatgory)
          .pipe(finalize(() => {
              this.saving = false;
              this.primengTableHelper.hideLoadingIndicator();
            })
          )
          .subscribe(x => {

            this.message.success(this.l('SavedSuccessfully'));
            this.close();
            this.vendorSubCatgory = new VendorSubCategoryDto();
            this.modalSave.emit();
            console.log(x);
          });
        }
      }
    );
  }
  close() {
    this.active = false;
    this.modal.hide();
  }
}
