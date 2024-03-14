import { Injector, ViewEncapsulation } from '@angular/core';
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { VendorCategoryDto, VendorsServiceProxy, VendorSubCategoryDto } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Table, Paginator, LazyLoadEvent } from 'primeng';
import { VendorSubCategoryModalComponent } from './vendor-sub-category-modal.component';


@Component({
  selector: 'app-vendor-sub-category',
  templateUrl: './vendor-sub-category.component.html',
  encapsulation: ViewEncapsulation.None,
  animations: [appModuleAnimation()]
})
export class VendorSubCategoryComponent extends AppComponentBase implements OnInit  {

  @ViewChild('vendorsubcategorymodal', { static: true }) vendorsubcategorymodal: VendorSubCategoryModalComponent;
  @ViewChild('dataTable', { static: true }) dataTable: Table;
  @ViewChild('paginator', { static: true }) paginator: Paginator;
  vendorCatgory: VendorCategoryDto = new VendorCategoryDto();
  vendorSubCategory: VendorSubCategoryDto[];

  filterText = '';
  narration = '';
  categoryName = '';
  constructor(
      injector: Injector,
    private _vendorsServiceProxy: VendorsServiceProxy, ) {
      super(injector);
     }

     ngOnInit() {
       this.getSubCatRecord();
     }
getSubCatRecord() {
  this._vendorsServiceProxy.getAllSubCategory(
    ).subscribe(result => {
        this.primengTableHelper.totalRecordsCount = result.totalCount;
        this.primengTableHelper.records = result.items;
        this.primengTableHelper.hideLoadingIndicator();
        console.log( result);
    });
}
  getSubCategory(event?: LazyLoadEvent) {
    if (this.primengTableHelper.shouldResetPaging(event)) {
        this.paginator.changePage(0);
        return;
    }

    this.primengTableHelper.showLoadingIndicator();

    this._vendorsServiceProxy.getAllSubCategory(
    ).subscribe(result => {
        this.primengTableHelper.totalRecordsCount = result.totalCount;
        this.primengTableHelper.records = result.items;
        this.primengTableHelper.hideLoadingIndicator();
        console.log( result);
    });
}
createSubCategory(): void {
  this.vendorsubcategorymodal.show();
}
reloadPage(): void {
  this.paginator.changePage(this.paginator.getPage());
}
deleteItem(item: number): void {
  debugger;
  this.message.confirm('',
      this.l('Are You Sure'),
      (isConfirmed) => {
          if (isConfirmed) {
              this._vendorsServiceProxy.deleteSubCat(item)
                  .subscribe(() => {
                    this.reloadPage();
                      this.notify.success(this.l('Successfully Deleted'));
                  });
          }
      }
  );
}
}
