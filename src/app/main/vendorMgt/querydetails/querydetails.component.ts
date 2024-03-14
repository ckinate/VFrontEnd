import { AfterViewInit, ChangeDetectorRef, Component, Injector, OnInit, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { PrimengTableHelper } from '@shared/helpers/PrimengTableHelper';
import { OperatingExpenseServiceServiceProxy, VendorsServiceProxy, WorkflowQueryDto, WorkflowServiceServiceProxy } from '@shared/service-proxies/service-proxies';
import { Table } from 'primeng';
import { finalize } from 'rxjs/operators';
import { FileuploadComponent } from '@app/main/FileDocuments/fileupload/fileupload.component';
//import { FileuploadComponent } from '../FileDocuments/fileupload/fileupload.component';
import { QueryreplymodalComponent } from './queryreplymodal/queryreplymodal.component';

@Component({
  selector: 'app-querydetails',
  templateUrl: './querydetails.component.html',
  styleUrls: ['./querydetails.component.css']
})
export class QuerydetailsComponent extends AppComponentBase implements OnInit, AfterViewInit {
    @ViewChild("queryreplymodal", { static: true })
    queryModal: QueryreplymodalComponent;

    @ViewChild("dataTable", { static: true }) dataTable: Table;
    primengTableHelper = new PrimengTableHelper();
    saving = false;
    OpexQuery: WorkflowQueryDto = new WorkflowQueryDto();
    records: WorkflowQueryDto[] = [];
    @ViewChild('fileUpload', { static: true }) fileUpload: FileuploadComponent;
   // @ViewChild('workflowdetails', { static: true })    workflowdetails:WorkflowDetailsComponent;
    constructor(injector: Injector,
    private _opex: OperatingExpenseServiceServiceProxy,private _workflowService: WorkflowServiceServiceProxy,
    public notifier: ChangeDetectorRef,
    private _vendorsServiceProxy: VendorsServiceProxy
    ) {
    super(injector);
  }

  ngOnInit(): void {
    this.getWorkflowquery();
  }
  ngAfterViewInit(): void {
  }
  loadqueryTrail() {
    this.primengTableHelper.showLoadingIndicator();
    this._opex.getloginopexQuery().pipe(
        finalize(() => this.primengTableHelper.hideLoadingIndicator())
    ).subscribe(result => {
        this.primengTableHelper.records = result;
        console.log(result);
        this.primengTableHelper.hideLoadingIndicator();
    });
  }
  response(record: WorkflowQueryDto){
   // this.OpexQuery = record;
    //this.isshow = true;
    this.queryModal.show(record)
 }

 showDocument(id: any,operationid:number){

  // this.appdocuments.ShowAttachmentforQuery(id,operationid);
   this.fileUpload.ShowAttachmentByRef(id, operationid);

 }


 getWorkflowquery() {




  this.primengTableHelper.showLoadingIndicator();
  this._vendorsServiceProxy.getloginVendorQuery().pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator())).subscribe(result => {



    this.primengTableHelper.hideLoadingIndicator();
    this.records= result;


  });

  }
}
