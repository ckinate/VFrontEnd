import { Component, Injector, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FileuploadComponent } from '@app/main/FileDocuments/fileupload/fileupload.component';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { VendorQueryHistoryDto, VendorsServiceProxy, WorkflowQueryDto } from '@shared/service-proxies/service-proxies';
import { EnquiryHistoryComponent } from './enquiry-history/enquiry-history.component';

@Component({
  selector: 'app-vendor-query-history',
  templateUrl: './vendor-query-history.component.html',
  styleUrls: ['./vendor-query-history.component.css'],
  encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class VendorQueryHistoryComponent extends AppComponentBase  implements OnInit {

  constructor(injector: Injector,  private _vendorsServiceProxy: VendorsServiceProxy) {
    super(injector);
   }
   @ViewChild('fileUpload', { static: true }) fileUpload: FileuploadComponent;
   @ViewChild("enquirryHistorymodal", { static: true }) enquirryHistorymodal: EnquiryHistoryComponent;
   vendorQueryHistory: VendorQueryHistoryDto[] = []

  ngOnInit(): void {
      this. getVendorQueryHistory();
  }

  getVendorQueryHistory(){
      this.showMainSpinner()
      this._vendorsServiceProxy.getVendorQueryHistory().subscribe(res=>{
          this. vendorQueryHistory = res;
          this.hideMainSpinner();
      },error=>{
          this.hideMainSpinner();
      })
  }
  showDocument(id: any,operationid:number){

    // this.appdocuments.ShowAttachmentforQuery(id,operationid);
     this.fileUpload.ShowAttachmentByRef(id, operationid);

   }
   vendorEnquiry(record: VendorQueryHistoryDto){
    // this.OpexQuery = record;
     //this.isshow = true;
     this.enquirryHistorymodal.show(record)
  }

}
