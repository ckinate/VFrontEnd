import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import {VendorsServiceProxy} from '@shared/service-proxies/service-proxies';
import { PrimengTableHelper } from '@shared/helpers/PrimengTableHelper';


@Component({
  selector: 'app-one-off-vendor',
  templateUrl: './one-off-vendor.component.html',
  styleUrls: ['./one-off-vendor.component.css']
})
export class OneOffVendorComponent   extends AppComponentBase implements OnInit  {
  primengTableHelper = new PrimengTableHelper();
  constructor(injector: Injector,
  private _oneTime: VendorsServiceProxy,
  ) {super(injector); }

  ngOnInit(): void {
    this.load()
  }
  load() {
    this.primengTableHelper.isLoading = true;
    this._oneTime.getOneOffVendorMgt().subscribe(one => {
      if (one) {
        this.numberOfTimes = one.numberOfTimesForRequisition;
      }
      this.primengTableHelper.isLoading = false;
    })
  }

  save():void{
    this.primengTableHelper.isLoading = true;
    if (this.numberOfTimes < 0) return;
    this._oneTime.addOrEditOneTimeVendorNumberOfRequisition(this.numberOfTimes).subscribe(x => {
      this.load()
    })
  }

  cleanValue():void {
    this.numberOfTimes = this.numberOfTimes < 0 ? 1 : this.numberOfTimes
    this.numberOfTimes = parseInt(String(this.numberOfTimes).replace(/[\-\<\>]+/g,''))
  }

  numberOfTimes: number

}
