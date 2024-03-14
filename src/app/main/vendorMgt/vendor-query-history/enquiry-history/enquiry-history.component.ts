import { Component, EventEmitter, Injector, OnInit, Output, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { VendorQueryHistoryDto, WorkflowQueryDto, WorkflowQueryTrailsDto, WorkflowServiceServiceProxy } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'enquiry-history',
  templateUrl: './enquiry-history.component.html',
  styleUrls: ['./enquiry-history.component.css']
})
export class EnquiryHistoryComponent extends AppComponentBase implements OnInit {
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('enquiryHistory' , {static: true}) modal: ModalDirective;
    isshow: boolean = false;
    Refnumber: string;
    queryResponse:string;
    saving = false;
    transtypeId:any;
    requestDate:any;
    comment:any;
    refno:any;
    responsepersone:any;
    operationname:any;
    active = false;
    operationId:any;
    concurrenceResponse=" ";

    createworkflowtrail: WorkflowQueryTrailsDto = new WorkflowQueryTrailsDto();
    querytraillist:  WorkflowQueryTrailsDto[] = [];

    vendorQuery: VendorQueryHistoryDto = new VendorQueryHistoryDto();

  constructor( injector: Injector, private _workflowService: WorkflowServiceServiceProxy) {
    super(injector);
   }

  ngOnInit(): void {
  }


  close(): void {
    this.modal.hide();
    this.active = false;
}
show(record: VendorQueryHistoryDto): void {
    this.vendorQuery = record;
    console.log(`The Operational ID is ${record.operationId}`);
    this.createworkflowtrail.query=this.vendorQuery.query;
    this.Refnumber= record.refNo;
    this.loadWorkflowqueryTrail();
    this.modal.show();
}

  loadWorkflowqueryTrail(){
    this.showMainSpinner();
    this._workflowService.getQueryTrailsHistory(this.vendorQuery.refNo, this.vendorQuery.operationId).subscribe((res)=>{
     this.querytraillist = res;
     this.hideMainSpinner();
    })

  }
}
