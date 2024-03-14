import { Component, EventEmitter, Injector, OnInit, Output, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { VendorCategoryDto, VendorsServiceProxy, VendorSubCategoryDto } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/internal/operators/finalize';

@Component({
  selector: 'vendorcategorymodal',
  templateUrl: './vendor-category-modal.component.html',

})
export class VendorCategoryModalComponent extends AppComponentBase implements OnInit {
  @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;

  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
  active = false;
  saving = false;

  narration = '';
  VCategory: VendorCategoryDto = new VendorCategoryDto();

  constructor(
    injector: Injector,
    private _vendor: VendorsServiceProxy,

  ) {
    super(injector);
   }
  ngOnInit(): void {
  }
  // show() {

  //   this.active = true;
  //     this.modal.show();


  //       }
        show(CategoryId?: number) {
          if (!CategoryId) {
            this.VCategory = new VendorCategoryDto();
            this.VCategory.id = CategoryId;
      // this.narration = '';
            this.active = true;
            this.modal.show();
        } else {
            this._vendor.getCategoryForEdit(CategoryId).subscribe(result => {
                this.VCategory = result.vendorCategory;
                this.active = true;
                this.modal.show();
            });
        }
      }
  save() {
          this.saving = true,
          this.VCategory.tenantId = this.appSession.tenantId;


          this._vendor.createOrEditCat(this.VCategory)
          .pipe(
            finalize(() => {
            this.saving = false;
            this.primengTableHelper.hideLoadingIndicator();

          })
        )
         .subscribe(() => {
            this.notify.info(this.l('SavedSuccessfully'));
            this.VCategory = new VendorCategoryDto();
            this.close();
            this.modalSave.emit(null);
         });
}
close() {
    this.active = false;
    this.modal.hide();
}
}
