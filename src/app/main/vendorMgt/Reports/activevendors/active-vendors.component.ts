import { Component, Injector, OnInit, Pipe, PipeTransform, ViewEncapsulation } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppConsts } from '@shared/AppConsts';
import { AppComponentBase } from '@shared/common/app-component-base';
import { VendorCategoryDto, VendorsServiceProxy, VendorSubCategoryDto } from '@shared/service-proxies/service-proxies';

@Pipe({ name: 'finsafe' })
export class FINSafePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer,

    ) {

    }
  transform(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}

@Component({
  selector: 'app-active-vendors',
  templateUrl: './active-vendors.component.html',
  encapsulation: ViewEncapsulation.None,
  animations: [appModuleAnimation()]

})
export class ActiveVendorsComponent extends AppComponentBase implements OnInit {

  vendorStatus: number;
  constructor(injector: Injector,  private _vendorsServiceProxy: VendorsServiceProxy,) {
    super(injector); }
  link = '';
  UrlLink = '';
  myURL: any;
  searchText ="";
  SubCategory: VendorSubCategoryDto[] = [];
  VenCategory: VendorCategoryDto[] = [];
  vendorCategoryId : number ;
  subcategoryId : number;
  ngOnInit(): void {
      this.getVenCategory();
  }

  getVenCategory() {
    this._vendorsServiceProxy.getVenCategory().subscribe((result: any) => {
      this.VenCategory = result;
      console.log(result)
    });
  }
  getVenSubCategory(vcid) {
      if(vcid != null || vcid != "" || vcid != undefined){
        this.SubCategory = [];
        this._vendorsServiceProxy.getVendorSubCatByCatId(vcid).subscribe((result: any) => {
          this.SubCategory = result;
          console.log(result);

        });

      }

  }
  // ViewReport() {
  //   let url  =  AppConsts.reportUrl + '?TypeId=1' + '&vendorstatus=' + this.vendorStatus;
  //   console.log(url);
  //   this.link = url;
  // }
  // ViewReportList() {
  //   let url  =  AppConsts.reportUrl + '?TypeId=2' + '&vendorstatus=' + this.vendorStatus;
  //   console.log(url);
  //   this.UrlLink = url;
  // }
  ViewReport(myURL: string | URL) {
      if(this. vendorCategoryId == undefined){
       this. vendorCategoryId = null;
      }
      if(this. subcategoryId == undefined){
        this. subcategoryId = null;
       }

    myURL =  AppConsts.reportUrl + '?TypeId=1' + '&vendorstatus=' + this.vendorStatus  + '&searchText=' + this.searchText + '&vendorCategoryId=' + this.vendorCategoryId +'&subCategoryId=' + this.subcategoryId;
    let params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=0,height=0,left=1000,top=1000`;
    window.open(myURL, params);
    this.link = myURL;
  }
  ViewReportList(myURL: string | URL) {

    myURL =  AppConsts.reportUrl + '?TypeId=2' + '&vendorstatus=' + this.vendorStatus + '&searchText=' + this.searchText + '&vendorCategoryId=' + this.vendorCategoryId +'&subCategoryId=' + this.subcategoryId;
    let params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=0,height=0,left=1000,top=1000`;
    window.open(myURL, params);
    this.link = myURL;
  }
}


