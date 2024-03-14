import { Component, EventEmitter, Injector, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { VendorCategoryDto, VendorsServiceProxy } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Table, Paginator, LazyLoadEvent } from 'primeng';
import { VendorCategoryModalComponent } from './vendor-category-modal.component';
@Component({
  selector: 'vendorcategory',
  templateUrl: './vendor-category.component.html',
  encapsulation: ViewEncapsulation.None,
  animations: [appModuleAnimation()]
})
export class VendorCategoryComponent extends AppComponentBase implements OnInit  {
  @ViewChild('vendorcategorymodal', { static: true }) vendorcategorymodal: VendorCategoryModalComponent;
  @ViewChild('dataTable', { static: true }) dataTable: Table;
  @ViewChild('paginator', { static: true }) paginator: Paginator;
  VCategory: VendorCategoryDto[];

    active = false;
    saving = false;
    filterText = '';
    CategoryName = '';
    constructor(
      injector: Injector,
      private _vendor: VendorsServiceProxy,
    ) {
      super(injector);
     }
     ngOnInit() {
      this.getVenCat();
    }

    getVenCat() {
      this.primengTableHelper.showLoadingIndicator();
      this._vendor.getAllVendorCategory(
        this.filterText,
       this.CategoryName,
    ).subscribe(result => {
        this.primengTableHelper.totalRecordsCount = result.totalCount;
        this.primengTableHelper.records = result.items;
        this.primengTableHelper.hideLoadingIndicator();
        console.log(result);
    });
    }
  getVendorCategory(event?: LazyLoadEvent) {
    if (this.primengTableHelper.shouldResetPaging(event)) {
        this.paginator.changePage(0);
        return;
    }

    this.primengTableHelper.showLoadingIndicator();

    this._vendor.getAllVendorCategory(
        this.filterText,
       this.CategoryName,
    ).subscribe(result => {
        this.primengTableHelper.totalRecordsCount = result.totalCount;
        this.primengTableHelper.records = result.items;
        this.primengTableHelper.hideLoadingIndicator();
        console.log(result);
    });
  }
  createCategory(): void {
    this.vendorcategorymodal.show();
}

reloadPage(): void {
  this.paginator.changePage(this.paginator.getPage());
}
deleteItem(item: number): void {
  debugger;
    this.message.confirm('',
        this.l('AreYouSure'),
        (isConfirmed) => {
            if (isConfirmed) {
                this._vendor.deleteCat(item)
                    .subscribe(() => {
                      this.reloadPage();
                        this.notify.success(this.l('SuccessfullyDeleted'));
                    });
            }
        }
    );
}
}
